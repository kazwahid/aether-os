"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Terminal.module.css";

interface Line {
  id: string;
  type: "system" | "user" | "ai" | "error" | "success";
  text: string;
}

const BOOT: Line[] = [
  { id: "b1", type: "system",  text: "AETHER CORE v2.8.4 — SECURE CHANNEL ESTABLISHED" },
  { id: "b2", type: "system",  text: "TOKEN BUCKET ACTIVE — 5 REQUESTS / 30s PER IP" },
  { id: "b3", type: "success", text: "Ready. Type 'help' for commands, or ask anything." },
];

export function Terminal() {
  const [input, setInput]      = useState("");
  const [history, setHistory]  = useState<Line[]>(BOOT);
  const [responding, setResponding] = useState(false);
  const [stream, setStream]    = useState("");

  const logRef   = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history, stream]);

  const push = (type: Line["type"], text: string) =>
    setHistory(p => [...p, { id: `${type}-${Date.now()}-${Math.random()}`, type, text }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || responding) return;

    push("user", `æ $ ${q}`);
    setInput("");

    // ── Local commands ─────────────────────────────────────────────
    switch (q.toLowerCase()) {
      case "clear":
        setHistory([]);
        return;
      case "help":
        push("success",
          "COMMANDS:\n" +
          "  help     — list commands\n" +
          "  about    — shader and system specs\n" +
          "  system   — runtime metrics\n" +
          "  clear    — wipe buffer\n" +
          "  [query]  — send to AETHER Core AI"
        );
        return;
      case "about":
        push("success",
          "AETHER OS SPECS:\n" +
          "  Renderer  : Vanilla WebGL — 4-octave fBm domain warp\n" +
          "  Palette   : Cosine gradient — black → charcoal → orange\n" +
          "  Mouse     : Rotation matrix swirl · exp(–d·4) decay\n" +
          "  Fallback  : prefers-reduced-motion → static frame\n" +
          "  DPR cap   : 2.0\n" +
          "  Backend   : Gemini 2.5 Flash · streaming ReadableStream"
        );
        return;
      case "system":
        push("system",
          `RUNTIME STATUS:\n` +
          `  VIEWPORT  : ${window.innerWidth}×${window.innerHeight}  DPR: ${Math.min(window.devicePixelRatio, 2).toFixed(1)}\n` +
          `  RATE LIMIT: 5 req / 30s · refill 1/6s\n` +
          `  INPUT CAP : 800 chars\n` +
          `  STREAM    : ReadableStream · maxDuration 30s`
        );
        return;
    }

    // ── AI request ─────────────────────────────────────────────────
    setResponding(true);
    setStream("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      // Non-2xx → read JSON error
      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          errMsg = j.error ?? errMsg;
        } catch { /* ignore */ }
        push("error", `ERROR — ${errMsg}`);
        setResponding(false);
        return;
      }

      // ── Stream reading — works with both chunked and buffered responses
      const reader = res.body?.getReader();
      if (!reader) {
        // Fallback: read as text directly
        const text = await res.text();
        push("ai", text);
        setResponding(false);
        return;
      }

      const dec = new TextDecoder("utf-8");
      let acc   = "";

      while (true) {
        let done = false, value: Uint8Array | undefined;
        try {
          ({ done, value } = await reader.read());
        } catch {
          break; // network cut
        }
        if (done) break;
        if (value) {
          acc += dec.decode(value, { stream: true });
          setStream(acc);
        }
      }
      // Flush any remaining bytes
      acc += dec.decode();
      if (acc) push("ai", acc);
      setStream("");

    } catch (err) {
      console.error("Terminal fetch error:", err);
      push("error", "NETWORK ERROR — could not reach core");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div
      className={styles.frame}
      onClick={() => inputRef.current?.focus()}
      role="presentation"
    >
      {/* Window chrome */}
      <div className={styles.chrome}>
        <div className={styles.dots}><span /><span /><span /></div>
        <span className={styles.chromeTitle}>aether://core-console</span>
        <span className={styles.statusBadge}>ONLINE</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.log} ref={logRef}>
          {history.map(l => (
            <div key={l.id} className={`${styles.line} ${styles[l.type]}`}>
              {l.text}
            </div>
          ))}

          {responding && stream && (
            <div className={`${styles.line} ${styles.ai}`}>
              {stream}<span className={styles.streamCursor} />
            </div>
          )}
          {responding && !stream && (
            <div className={`${styles.line} ${styles.system}`}>
              routing to core<span className={styles.pulseCursor}>▌</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.promptRow}>
          <span className={styles.promptSign}>æ&nbsp;$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 800))}
            disabled={responding}
            placeholder={responding ? "awaiting stream…" : "enter command or query"}
            className={styles.promptInput}
            autoComplete="off"
            spellCheck={false}
            maxLength={800}
            aria-label="Aether Core console input"
          />
          <span className={styles.charCounter}>{input.length}/800</span>
        </form>
      </div>
    </div>
  );
}

export default Terminal;

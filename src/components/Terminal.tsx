"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Terminal.module.css";

interface Line { id: string; type: "system" | "user" | "ai" | "error" | "success"; text: string; }

const BOOT: Line[] = [
  { id: "b1", type: "system", text: "AETHER CORE v2.8.4 — SECURE CHANNEL ESTABLISHED" },
  { id: "b2", type: "system", text: "TOKEN BUCKET ACTIVE — 5 REQUESTS / 30s PER IP" },
  { id: "b3", type: "success", text: "Type 'help' for local protocols, or send any query to AETHER Core AI." },
];

export function Terminal() {
  const [input, setInput]   = useState("");
  const [history, setHistory] = useState<Line[]>(BOOT);
  const [responding, setResponding] = useState(false);
  const [stream, setStream] = useState("");

  const endRef  = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, stream]);

  const push = (type: Line["type"], text: string) =>
    setHistory(p => [...p, { id: `${type}-${Date.now()}`, type, text }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || responding) return;

    push("user", `æ $ ${q}`);
    setInput("");

    switch (q.toLowerCase()) {
      case "clear": setHistory([]); return;
      case "help":
        push("success",
          "LOCAL PROTOCOLS:\n" +
          "  help     — list commands\n" +
          "  about    — shader and system specs\n" +
          "  system   — runtime metrics\n" +
          "  clear    — wipe buffer\n" +
          "  [query]  — forward to AETHER Core AI"
        ); return;
      case "about":
        push("success",
          "AETHER OS SPECS:\n" +
          "  Renderer  : Custom WebGL — 4-octave fBm domain warp\n" +
          "  Palette   : Cosine gradient — black → charcoal → orange\n" +
          "  Mouse     : Coordinate swirl via rotation matrix · exp(–d·4) decay\n" +
          "  Fallback  : prefers-reduced-motion → static single frame\n" +
          "  DPR cap   : 2.0 (GPU overhead bounded)\n" +
          "  Backend   : Gemini 2.5 Flash · streaming ReadableStream"
        ); return;
      case "system":
        push("system",
          `RUNTIME STATUS:\n` +
          `  VIEWPORT  : ${window.innerWidth}×${window.innerHeight}  DPR: ${Math.min(window.devicePixelRatio, 2).toFixed(1)}\n` +
          `  RATE LIMIT: 5 req / 30s · refill 1/6s\n` +
          `  INPUT CAP : 800 chars\n` +
          `  STREAM    : ReadableStream · maxDuration 30s`
        ); return;
    }

    setResponding(true);
    setStream("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      if (!res.ok) {
        const err = await res.json();
        push("error", `SYSTEM HALT — ${err.error || "Unknown error"}`);
        setResponding(false);
        return;
      }

      const reader = res.body?.getReader();
      const dec    = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value);
        setStream(acc);
      }

      push("ai", acc);
      setStream("");
    } catch {
      push("error", "INTERFACE FAILURE — connection severed");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className={styles.frame} onClick={() => inputRef.current?.focus()} role="presentation">
      {/* Window chrome */}
      <div className={styles.chrome}>
        <div className={styles.dots}><span /><span /><span /></div>
        <span className={styles.chromeTitle}>aether://core-console</span>
        <span className={styles.statusBadge}>ONLINE</span>
      </div>

      {/* Terminal body */}
      <div className={styles.body}>
        <div className={styles.log}>
          {history.map(l => (
            <div key={l.id} className={`${styles.line} ${styles[l.type]}`}>{l.text}</div>
          ))}

          {responding && stream && (
            <div className={`${styles.line} ${styles.ai}`}>
              {stream}<span className={styles.streamCursor} />
            </div>
          )}
          {responding && !stream && (
            <div className={`${styles.line} ${styles.system}`}>
              Routing to core<span className={styles.pulseCursor}>_</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.promptRow}>
          <span className={styles.promptSign}>æ $</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 800))}
            disabled={responding}
            placeholder={responding ? "awaiting stream…" : "enter command or query"}
            className={styles.promptInput}
            autoComplete="off"
            spellCheck="false"
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

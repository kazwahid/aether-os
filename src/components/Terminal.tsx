"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Terminal.module.css";

interface TerminalLine {
  id: string;
  type: "system" | "user" | "ai" | "error" | "success";
  text: string;
}

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: "init-1",
      type: "system",
      text: "AETHER CENTRAL CORE [v2.8.4-RELEASE] INITIALIZED.",
    },
    {
      id: "init-2",
      type: "system",
      text: "SECURE TUNNEL OPENED VIA PORTAL 80-EDGE.",
    },
    {
      id: "init-3",
      type: "success",
      text: "Type 'help' to review core command protocols or ask AETHER Core AI a direct question.",
    },
  ]);
  const [isResponding, setIsResponding] = useState(false);
  const [currentResponseStream, setCurrentResponseStream] = useState("");

  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom when history or active stream changes
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, currentResponseStream]);

  // Focus input on terminal card click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isResponding) return;

    // Save user command to history and clear input
    const userLineId = `user-${Date.now()}`;
    setHistory((prev) => [
      ...prev,
      { id: userLineId, type: "user", text: `aether@core:~$ ${trimmedInput}` },
    ]);
    setInput("");

    // Process local command protocols
    const commandLower = trimmedInput.toLowerCase();
    
    if (commandLower === "clear") {
      setHistory([]);
      return;
    }

    if (commandLower === "help") {
      setHistory((prev) => [
        ...prev,
        {
          id: `help-${Date.now()}`,
          type: "success",
          text: 
            "AVAILABLE ENGINES:\n" +
            "  help      - List active command protocols.\n" +
            "  about     - Review AETHER OS background and WebGL rendering specs.\n" +
            "  system    - Read simulated hardware allocation / rate limit stats.\n" +
            "  clear     - Wipe terminal history buffer.\n" +
            "  [query]   - Input any custom prompt to access the AETHER Core AI.",
        },
      ]);
      return;
    }

    if (commandLower === "about") {
      setHistory((prev) => [
        ...prev,
        {
          id: `about-${Date.now()}`,
          type: "success",
          text:
            "AETHER OS SPECS:\n" +
            "  - Visual Core: Custom GLSL Fragment Shader utilizing domain-warped fBm noise.\n" +
            "  - Interaction: Mouse vector attraction via uniform 'u_mouse'.\n" +
            "  - Accessibility: Reduced-motion detection which disables animation updates.\n" +
            "  - Architecture: React 19 / Next.js 16 Edge API integration.\n" +
            "  - Rate Limiter: In-memory token bucket (5 tokens max, refills every 6s).",
        },
      ]);
      return;
    }

    if (commandLower === "system") {
      setHistory((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          type: "system",
          text:
            `SYSTEM STATUS:\n` +
            `  - WEBGL_DISPLAY : 100% OK\n` +
            `  - RESOLUTION    : ${window.innerWidth}x${window.innerHeight} [dpr:${Math.min(window.devicePixelRatio, 2.0)}]\n` +
            `  - RATE_LIMIT    : 5 queries / 30s window (Token Bucket Refill Active)\n` +
            `  - INPUT_LIMIT   : Max 800 characters per transaction.`,
        },
      ]);
      return;
    }

    // Trigger AI API stream request
    setIsResponding(true);
    setCurrentResponseStream("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!response.ok) {
        // Handle error payloads
        const errorData = await response.json();
        setHistory((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            type: "error",
            text: `SYSTEM HALT: ${errorData.error || "Unknown interface malfunction."}`,
          },
        ]);
        setIsResponding(false);
        return;
      }

      // Stream handling
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error("Failed to initialize response reader.");
      }

      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          setCurrentResponseStream(accumulatedText);
        }
      }

      // Once finished streaming, save the final reply to main history
      setHistory((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, type: "ai", text: accumulatedText },
      ]);
      setCurrentResponseStream("");
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "error",
          text: `INTERFACE FAILURE: Net connection broken or host unreachable.`,
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <section id="aether-terminal-section" className={styles.terminalSection}>
      <div className={styles.sectionHeading}>
        <h2 className={styles.secTitle}>Core Interface</h2>
        <p className={styles.secDesc}>
          Access the AETHER central intelligence terminal. Stream queries directly into the core matrix.
        </p>
      </div>

      <div className={styles.terminalFrame} onClick={focusInput} role="presentation">
        {/* Terminal Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.windowControls}>
            <span className={styles.dotRed}></span>
            <span className={styles.dotYellow}></span>
            <span className={styles.dotGreen}></span>
          </div>
          <div className={styles.terminalTitle}>AETHER SYSTEM CONSOLE v2.8</div>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>ONLINE</span>
          </div>
        </div>

        {/* Terminal Screen Buffer */}
        <div className={styles.terminalBody}>
          <div className={styles.historyLog}>
            {history.map((line) => (
              <div
                key={line.id}
                className={`${styles.logLine} ${styles[line.type]}`}
              >
                {line.text}
              </div>
            ))}

            {/* Active streaming text from backend */}
            {isResponding && currentResponseStream && (
              <div className={`${styles.logLine} ${styles.ai}`}>
                {currentResponseStream}
                <span className={styles.streamingCursor}>█</span>
              </div>
            )}

            {isResponding && !currentResponseStream && (
              <div className={`${styles.logLine} ${styles.system}`}>
                Estabilishing neural routing links...
                <span className={styles.pulseCursor}>_</span>
              </div>
            )}

            <div ref={historyEndRef} />
          </div>

          {/* Prompt Entry Form */}
          <form onSubmit={handleCommandSubmit} className={styles.terminalPrompt}>
            <span className={styles.promptSign}>aether@core:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 800))} // Client-side character cap
              disabled={isResponding}
              placeholder={isResponding ? "System waiting for stream completion..." : "Enter command or system inquiry..."}
              className={styles.promptInput}
              autoComplete="off"
              spellCheck="false"
              maxLength={800}
              aria-label="Aether Core command prompt input"
            />
            
            {/* Input length and status badge */}
            <div className={styles.charCounter}>
              {input.length}/800
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
export default Terminal;

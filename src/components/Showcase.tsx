"use client";

import { useEffect, useState } from "react";
import styles from "./Showcase.module.css";

const LOGS = [
  "BINDING WEBGL CONTEXT — DRAW BUFFER ALLOCATED",
  "COMPILING VERTEX SHADER STAGE [PASS]",
  "COMPILING FRAGMENT SHADER — FBM_WARP [PASS]",
  "LINKING PROGRAM — u_time · u_resolution · u_mouse",
  "CLAMPING devicePixelRatio → MAX 2.0",
  "visibilitychange LISTENER ATTACHED",
  "MOUSE LERP FACTOR 0.08 — SMOOTH EASING ACTIVE",
  "GARBAGE COLLECTION: PURGED STALE IP BUCKETS",
  "TOKEN BUCKET CAPACITY: 5 | REFILL 1/6s",
  "AETHER SYSTEM INTEGRITY: 100% OPERATIONAL",
];

export function Showcase() {
  const [activeLog, setActiveLog] = useState(0);
  const [metrics, setMetrics] = useState({ cpu: 12.4, mem: 41.8, coh: 99.82 });

  useEffect(() => {
    const t = setInterval(() => setActiveLog(i => (i + 1) % LOGS.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setMetrics({
        cpu: parseFloat((12.4 + Math.sin(now / 2000) * 3.5).toFixed(1)),
        mem: parseFloat((41.8 + Math.cos(now / 3000) * 0.4).toFixed(1)),
        coh: parseFloat((99.8 + Math.sin(now / 1000) * 0.05).toFixed(2)),
      });
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hypervisor" className={styles.section}>
      {/* Section header — same grid as page */}
      <div className={styles.header}>
        <span className={styles.secNum}>03</span>
        <h2 className={styles.title}>Hypervisor Monitor</h2>
      </div>

      {/* Mock OS window */}
      <div className={styles.window}>
        {/* Window chrome */}
        <div className={styles.chrome}>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
          <span className={styles.chromeTitle}>aether://kernel-monitor</span>
          <span className={styles.latency}>0.14ms</span>
        </div>

        {/* Three-column body */}
        <div className={styles.body}>
          {/* Sidebar nav */}
          <nav className={styles.sidebar}>
            {["Kernel Console", "Thread Manager", "Security Layer", "Shader Cache"].map(
              (item, i) => (
                <span key={item} className={`${styles.sideItem} ${i === 0 ? styles.sideActive : ""}`}>
                  {item}
                </span>
              )
            )}
          </nav>

          {/* Central visualizer */}
          <div className={styles.main}>
            {/* Dot-grid + SVG orbit */}
            <div className={styles.orbitArea}>
              <div className={styles.dotGrid} aria-hidden="true" />
              <svg viewBox="0 0 200 200" className={styles.svg}>
                <circle cx="100" cy="100" r="36" stroke="#ea3a00" strokeWidth="0.6" fill="none" strokeDasharray="4 4" className={styles.ring1} />
                <circle cx="100" cy="100" r="58" stroke="rgba(234,58,0,0.3)" strokeWidth="0.4" fill="none" className={styles.ring2} />
                <circle cx="100" cy="100" r="78" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" fill="none" />
                <line x1="100" y1="100" x2="55"  y2="55"  stroke="#ea3a00" strokeWidth="0.6" />
                <line x1="100" y1="100" x2="145" y2="55"  stroke="rgba(234,58,0,0.5)" strokeWidth="0.6" />
                <line x1="100" y1="100" x2="100" y2="158" stroke="rgba(234,58,0,0.3)" strokeWidth="0.6" />
                <circle cx="55"  cy="55"  r="2.5" fill="#ea3a00" />
                <circle cx="145" cy="55"  r="2.5" fill="#ff4d1a" />
                <circle cx="100" cy="158" r="2.5" fill="rgba(234,58,0,0.5)" />
                <circle cx="100" cy="100" r="4"   fill="#fff" />
              </svg>
              <span className={styles.orbitLabel}>CORE NODE</span>
            </div>

            {/* Scrolling log strip */}
            <div className={styles.logStrip}>
              {LOGS.map((log, i) => (
                <span key={i} className={`${styles.logLine} ${i === activeLog ? styles.logActive : ""}`}>
                  <span className={styles.logPrefix}>&gt;_</span>{log}
                </span>
              ))}
            </div>
          </div>

          {/* Right telemetry column */}
          <div className={styles.telemetry}>
            <span className={styles.telLabel}>TELEMETRY</span>
            {[
              { name: "CPU ALLOC", val: metrics.cpu, max: 100, pct: metrics.cpu },
              { name: "THREAD ALLOC", val: metrics.mem, max: 100, pct: metrics.mem },
              { name: "COHERENCE", val: metrics.coh, max: 100, pct: (metrics.coh - 99) * 100 },
            ].map(m => (
              <div key={m.name} className={styles.metric}>
                <div className={styles.metricTop}>
                  <span>{m.name}</span>
                  <span className={styles.metricVal}>{m.val}%</span>
                </div>
                <div className={styles.bar}>
                  <div className={styles.barFill} style={{ width: `${Math.min(m.pct, 100)}%` }} />
                </div>
              </div>
            ))}

            <div className={styles.metaGrid}>
              <span className={styles.metaKey}>TEMP</span>
              <span className={styles.metaValOrange}>34°C</span>
              <span className={styles.metaKey}>DPR CAP</span>
              <span>2.0×</span>
              <span className={styles.metaKey}>SHADER</span>
              <span>FBM_WARP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Showcase;

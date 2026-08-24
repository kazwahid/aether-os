"use client";

import { useEffect, useState } from "react";
import styles from "./Showcase.module.css";

// What each shader pass does — shown as live "signal" cards
const PASSES = [
  {
    id: "noise",
    label: "PASS 01",
    title: "Value Noise",
    desc: "Hashes a 2D grid of random scalars, then smoothly interpolates between them — the raw building block of organic texture.",
    live: "SAMPLING",
  },
  {
    id: "fbm",
    label: "PASS 02",
    title: "fBm Stack",
    desc: "Runs 4 noise passes at doubling frequency. Each halves its strength. The result is a naturalistic layered field — clouds, plasma, terrain.",
    live: "4 OCTAVES",
  },
  {
    id: "warp",
    label: "PASS 03",
    title: "Domain Warp",
    desc: "Feeds the field back into itself — f(p + 4·f(p)). The coordinates distort the coordinates. This is what creates the folding, turbulent motion.",
    live: "WARPING",
  },
  {
    id: "mouse",
    label: "PASS 04",
    title: "Cursor Gravity",
    desc: "Your cursor coordinates drive a 2D rotation matrix. The effect decays exponentially with distance — strongest near the pointer, invisible at the edge.",
    live: "TRACKING",
  },
];

// Simplified live telemetry — numbers that feel real but are cosmetic
function useTick(base: number, amp: number, period: number, decimals = 1) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => {
      setVal(parseFloat((base + Math.sin(Date.now() / period) * amp).toFixed(decimals)));
    }, 600);
    return () => clearInterval(t);
  }, [base, amp, period, decimals]);
  return val;
}

export function Showcase() {
  const [activePass, setActivePass] = useState(0);
  const fps   = useTick(60, 2, 1200, 0);
  const ms    = useTick(16.4, 1.2, 900, 1);
  const dpr   = 2.0;

  // Auto-cycle through passes
  useEffect(() => {
    const t = setInterval(() => setActivePass(p => (p + 1) % PASSES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const pass = PASSES[activePass];

  return (
    <section id="hypervisor" className={styles.section}>
      {/* Section header */}
      <div className={styles.header}>
        <span className={styles.secNum}>03</span>
        <div className={styles.headerRight}>
          <h2 className={styles.title}>Rendering Engine</h2>
          <p className={styles.subtitle}>
            Your hero section is drawn in real-time by a GLSL fragment shader —
            a program running directly on the GPU every frame. Here is what it is doing right now.
          </p>
        </div>
      </div>

      {/* Main layout: pass selector left | detail right | metrics far right */}
      <div className={styles.body}>

        {/* Pass tabs — left column */}
        <div className={styles.passList}>
          {PASSES.map((p, i) => (
            <button
              key={p.id}
              className={`${styles.passTab} ${i === activePass ? styles.passTabActive : ""}`}
              onClick={() => setActivePass(i)}
            >
              <span className={styles.passTabNum}>{p.label}</span>
              <span className={styles.passTabTitle}>{p.title}</span>
              {i === activePass && <span className={styles.passTabLive}>{p.live}</span>}
            </button>
          ))}
        </div>

        {/* Detail panel — center */}
        <div className={styles.detail}>
          {/* Mini visualizer: animated SVG representing domain warp */}
          <div className={styles.visualizer}>
            <svg viewBox="0 0 240 160" className={styles.vizSvg}>
              {/* Static grid lines */}
              {[0,1,2,3,4,5].map(i => (
                <line key={`h${i}`} x1="0" y1={i*32} x2="240" y2={i*32}
                  stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}
              {[0,1,2,3,4,5,6,7].map(i => (
                <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="160"
                  stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}
              {/* Animated warp curve — represents domain distortion */}
              <path
                d="M 0 80 C 40 40, 80 120, 120 80 S 200 40, 240 80"
                stroke="#ea3a00"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
                className={styles.vizCurve}
              />
              <path
                d="M 0 80 C 60 110, 100 50, 140 80 S 210 110, 240 80"
                stroke="rgba(234,58,0,0.3)"
                strokeWidth="0.6"
                fill="none"
                className={styles.vizCurve2}
              />
              {/* Active pass indicator dot */}
              <circle cx="120" cy="80" r="3" fill="#ea3a00" className={styles.vizDot}/>
              <circle cx="120" cy="80" r="8" fill="none" stroke="#ea3a00"
                strokeWidth="0.5" opacity="0.3" className={styles.vizRing}/>
            </svg>
            <span className={styles.vizLabel}>LIVE · {fps} FPS · {ms}ms</span>
          </div>

          {/* Active pass description */}
          <div className={styles.passDetail}>
            <div className={styles.passDetailHead}>
              <span className={styles.passDetailNum}>{pass.label}</span>
              <h3 className={styles.passDetailTitle}>{pass.title}</h3>
            </div>
            <p className={styles.passDetailDesc}>{pass.desc}</p>
            <div className={styles.passDetailCode}>
              {activePass === 0 && <code>{"fract(p * 127.1) · hash → mix(a,b,c,d)"}</code>}
              {activePass === 1 && <code>{"for i in 4: v += amp * noise(p); p *= 2; amp *= 0.5"}</code>}
              {activePass === 2 && <code>{"fbm(st + 4.0 * fbm(st + t))"}</code>}
              {activePass === 3 && <code>{"mat2(cos θ, -sin θ, sin θ, cos θ) · exp(-d·4)"}</code>}
            </div>
          </div>
        </div>

        {/* Metrics column — right */}
        <div className={styles.metrics}>
          <span className={styles.metricsLabel}>RUNTIME</span>

          <div className={styles.metricItem}>
            <span className={styles.metricName}>FRAME</span>
            <span className={styles.metricValue}>{ms}ms</span>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: `${Math.min(ms / 33 * 100, 100)}%` }}/>
            </div>
          </div>

          <div className={styles.metricItem}>
            <span className={styles.metricName}>FPS</span>
            <span className={styles.metricValue}>{fps}</span>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: `${Math.min(fps / 60 * 100, 100)}%` }}/>
            </div>
          </div>

          <div className={styles.metricItem}>
            <span className={styles.metricName}>DPR CAP</span>
            <span className={styles.metricValue}>{dpr}×</span>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "100%" }}/>
            </div>
          </div>

          <div className={styles.metricDivider}/>

          <div className={styles.staticMeta}>
            <span className={styles.staticKey}>OCTAVES</span>
            <span className={styles.staticVal}>4</span>
            <span className={styles.staticKey}>UNIFORMS</span>
            <span className={styles.staticVal}>3</span>
            <span className={styles.staticKey}>PRECISION</span>
            <span className={styles.staticVal}>MEDIUMP</span>
            <span className={styles.staticKey}>PALETTE</span>
            <span className={styles.staticValOrange}>COSINE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Showcase;

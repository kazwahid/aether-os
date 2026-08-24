"use client";

import { useEffect, useState } from "react";
import { ShaderHero } from "../components/ShaderHero";
import { Terminal }   from "../components/Terminal";
import styles from "./page.module.css";

// ── Scroll-reveal ─────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(`.${styles.reveal}`);
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add(styles.visible); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Shader pass data (for architecture section) ────────────
const PASSES = [
  { num: "01", label: "RENDERING",    title: "Domain Warp",     body: "4-octave fBm fed back into itself — f(p + 4·f(p+t)). The coordinates distort the coordinates. This is what creates the folding plasma, with zero repeating grid artifacts.", code: "fbm(st + 4.0 * fbm(st + t))" },
  { num: "02", label: "INTERACTION",  title: "Vector Gravity",  body: "Your cursor drives a 2D rotation matrix. Influence decays as e^(−dist×4) — strongest near the pointer, invisible at the edges. Move slowly. It follows.", code: "mat2(cos θ, -sin θ, sin θ, cos θ) · e^(-d·4)" },
  { num: "03", label: "PERFORMANCE",  title: "Visibility Sleep",body: "On tab hide the rAF loop halts entirely. On restore it resumes. DevicePixelRatio is clamped at 2.0. GPU overhead is always bounded, on any device.", code: "document.addEventListener('visibilitychange', ...)" },
  { num: "04", label: "SECURITY",     title: "Rate Gate",       body: "5-token sliding-window bucket per IP. Refills at 1 token per 6s. Stale records GC'd after 30 min. All prompts hard-capped at 800 chars serverside.", code: "429 — Retry-After: {sec}s" },
];

// ── Ticking metric hook ────────────────────────────────────
function useTick(base: number, amp: number, period: number, dp = 1) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setV(+((base + Math.sin(Date.now() / period) * amp).toFixed(dp))), 700);
    return () => clearInterval(t);
  }, [base, amp, period, dp]);
  return v;
}

// ── World dot map ─────────────────────────────────────────
const DOTS: [number, number][] = [
  [12,8],[13,8],[14,8],[15,9],[16,9],[17,10],[18,10],[18,11],[17,11],[16,11],[15,11],[14,12],[13,12],[12,12],[11,12],[10,13],[11,13],[12,13],[13,13],[14,14],[15,14],[16,14],[17,13],[18,12],[19,12],[19,13],[20,13],[20,14],[21,14],[22,14],[23,14],[24,14],[23,15],[24,15],[25,15],[24,16],[25,16],[24,17],[25,17],[25,18],[24,18],[24,19],
  [42,7],[43,7],[44,8],[45,8],[46,8],[47,9],[48,9],[49,9],[50,8],[51,8],[43,9],[44,9],[45,9],[46,9],[47,10],[48,10],[46,10],[45,10],[44,10],[44,13],[45,13],[46,13],[47,13],[48,13],[49,14],[50,14],[51,14],[52,15],[44,14],[45,14],[46,14],[47,14],[48,14],[49,15],[50,15],[51,15],[45,15],[46,15],[47,15],[48,15],[47,16],[48,16],[49,16],[48,17],[47,17],
  [52,7],[53,7],[54,7],[55,7],[56,7],[57,8],[58,8],[59,8],[60,8],[61,8],[62,9],[63,9],[64,9],[65,9],[66,9],[67,10],[68,10],[69,10],[70,11],[52,8],[53,8],[54,8],[55,8],[56,8],[57,9],[58,9],[59,9],[60,9],[61,9],[62,10],[63,10],[64,10],[65,10],[66,10],[67,11],[68,11],
  [68,17],[69,17],[70,17],[71,17],[69,18],[70,18],[71,18],[68,18],
];
const HIGHLIGHT_DOTS: [number, number][] = [[15,10],[45,9],[62,9],[50,14]];

export default function Home() {
  useScrollReveal();

  // Force scroll to top on every page load
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const scrollToConsole = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("aether-terminal-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const [activePass, setActivePass] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActivePass(p => (p + 1) % PASSES.length), 3400);
    return () => clearInterval(t);
  }, []);

  const fps = useTick(60, 1.5, 1100, 0);
  const ms  = useTick(16.2, 0.9, 800, 1);


  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <header className={styles.nav}>
        {/* Just Æ */}
        <span className={styles.navLogo} aria-label="Aether OS">Æ</span>

        <nav className={styles.navCenter}>
          <a href="#architecture" className={styles.navLink}>Engine</a>
          <a href="#terminal"     className={styles.navLink} onClick={scrollToConsole}>Console</a>
        </nav>

        {/* INITIALIZE — text + underline that disappears on hover */}
        <button
          className={styles.navInit}
          onClick={scrollToConsole}
          aria-label="Open console"
        >
          INITIALIZE
        </button>
      </header>

      {/* 01 — HERO */}
      <ShaderHero />

      {/* 02 — STATEMENT: asymmetric full-bleed type */}
      <section className={`${styles.statement} ${styles.reveal}`}>
        <p className={styles.statNum}>02</p>
        <p className={styles.statLine1}>Not a library.</p>
        <p className={styles.statLine2}>Not a component.</p>
        <p className={styles.statLine3}>
          Raw <em>WebGL</em> — every pixel computed<br/>
          on the GPU, every frame shaped<br/>
          by <em>where you point</em>.
        </p>
      </section>

      {/* Dot map — pure visual divider, zero text */}
      <div className={styles.dotMapWrap} aria-hidden="true">
        <svg viewBox="0 0 840 240" className={styles.dotMapSvg}>
          {DOTS.map(([cx, cy], i) => (
            <circle key={i} cx={cx * 10 + 5} cy={cy * 10 + 5} r="1.4" fill="rgba(255,255,255,0.1)" />
          ))}
          {HIGHLIGHT_DOTS.map(([cx, cy], i) => (
            <circle key={`h${i}`} cx={cx * 10 + 5} cy={cy * 10 + 5} r="2.4" fill="#ea3a00" opacity="0.6" />
          ))}
        </svg>
      </div>

      {/* 03 — ARCHITECTURE: Rendering Engine + Specs merged, asymmetric */}
      <section id="architecture" className={`${styles.arch} ${styles.reveal}`}>
        {/* Left rail — large display title, anchored left */}
        <div className={styles.archLeft}>
          <span className={styles.archNum}>03</span>
          <h2 className={styles.archTitle}>
            Æther<br/>
            Architecture
          </h2>
          <p className={styles.archSubtitle}>
            Four systems running in parallel, every frame.
            One program on the GPU. Zero dependencies.
          </p>

          {/* Live metrics strip */}
          <div className={styles.archMetrics}>
            <div className={styles.archMetric}>
              <span className={styles.archMetricN}>{fps}</span>
              <span className={styles.archMetricL}>FPS</span>
            </div>
            <div className={styles.archMetricDiv}/>
            <div className={styles.archMetric}>
              <span className={styles.archMetricN}>{ms}</span>
              <span className={styles.archMetricL}>MS / FRAME</span>
            </div>
            <div className={styles.archMetricDiv}/>
            <div className={styles.archMetric}>
              <span className={styles.archMetricN}>0</span>
              <span className={styles.archMetricL}>DEPENDENCIES</span>
            </div>
          </div>

          {/* Animated SVG visualizer */}
          <div className={styles.vizBox}>
            <svg viewBox="0 0 240 140" className={styles.vizSvg}>
              {[0,1,2,3,4,5,6].map(i=>(
                <line key={`h${i}`} x1="0" y1={i*24} x2="240" y2={i*24} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}
              {[0,1,2,3,4,5,6,7,8].map(i=>(
                <line key={`v${i}`} x1={i*34} y1="0" x2={i*34} y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              ))}
              <path d="M 0 70 C 40 35, 80 105, 120 70 S 200 35, 240 70"
                stroke="#ea3a00" strokeWidth="1" fill="none" opacity="0.7"
                className={styles.vizCurve}/>
              <path d="M 0 70 C 60 95, 100 45, 140 70 S 210 95, 240 70"
                stroke="rgba(234,58,0,0.3)" strokeWidth="0.6" fill="none"
                className={styles.vizCurve2}/>
              <circle cx="120" cy="70" r="3" fill="#ea3a00" className={styles.vizDot}/>
            </svg>
            <span className={styles.vizLabel}>LIVE · GLSL · GPU</span>
          </div>
        </div>

        {/* Right rail — 4 pass rows, no max-width */}
        <div className={styles.archRight}>
          {PASSES.map((p, i) => (
            <button
              key={p.num}
              className={`${styles.passRow} ${i === activePass ? styles.passRowActive : ""}`}
              onClick={() => setActivePass(i)}
            >
              <div className={styles.passRowTop}>
                <span className={styles.passRowNum}>{p.num}</span>
                <span className={styles.passRowLabel}>{p.label}</span>
                <span className={styles.passRowTitle}>{p.title}</span>
              </div>
              {i === activePass && (
                <div className={styles.passRowDetail}>
                  <p className={styles.passRowBody}>{p.body}</p>
                  <code className={styles.passRowCode}>{p.code}</code>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 04 — CONSOLE with large Æ typemark behind it */}
      <section
        id="aether-terminal-section"
        className={`${styles.consoleSection} ${styles.reveal}`}
      >
        {/* Large Æ mark — visual, not readable */}
        <span className={styles.aeMark} aria-hidden="true">Æ</span>

        <div className={styles.consoleInner}>
          <div className={styles.consoleHeader}>
            <h2 className={styles.consoleTitle}>Core Console</h2>
            <p className={styles.consoleDesc}>
              Streaming AI responses through a hardened edge function.
              Ask anything about Æther OS, the shader, or the architecture.
            </p>
          </div>
          <Terminal />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span className={styles.footerLogo}>ÆTHER OS</span>
          <div className={styles.footerMeta}>
            <span>Next.js 16.3</span>
            <span className={styles.footerDot}>·</span>
            <span>Vanilla WebGL</span>
            <span className={styles.footerDot}>·</span>
            <span>Gemini 2.5 Flash</span>
            <span className={styles.footerDot}>·</span>
            <span>Edge Runtime</span>
          </div>
        </div>
        <div className={styles.footerRule}/>
        <div className={styles.footerBottom}>
          <span>ALL PROTOCOLS OPERATIONAL</span>
          <span>© 2026 ÆTHER OS</span>
        </div>
      </footer>

    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ShaderHero }  from "../components/ShaderHero";
import { Showcase }    from "../components/Showcase";
import { Terminal }    from "../components/Terminal";
import styles from "./page.module.css";

// Scroll-reveal hook — adds .visible class when element enters viewport
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(`.${styles.reveal}`);
    const io  = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const SPECS = [
  {
    label: "RENDERING",
    title: "Domain Warp Matrix",
    body: "4-octave fBm fed back into itself — f(p + 4f(p + t)) — produces plasma with no repeating grid artifacts.",
    tag: "FBM_WARP",
    stat: "4",
    statLabel: "OCTAVES",
  },
  {
    label: "INTERACTION",
    title: "Vector Gravity",
    body: "Your mouse coordinates drive a rotation matrix. Influence decays as e^(−dist×4) — a gravitational swirl that fades at distance.",
    tag: "u_mouse",
    stat: "∞",
    statLabel: "ATTRACTOR",
  },
  {
    label: "PERFORMANCE",
    title: "Visibility Sleep",
    body: "On tab hide the animation loop halts completely. On restore it resumes. DPR is clamped at 2.0 — GPU overhead is always bounded.",
    tag: "rAF_GUARD",
    stat: "2×",
    statLabel: "DPR CAP",
  },
  {
    label: "SECURITY",
    title: "Rate Gatekeeper",
    body: "5-token IP bucket, refilling at 1 per 6s. Stale records GC'd after 30 min. All prompts hard-capped at 800 chars server-side.",
    tag: "429",
    stat: "5",
    statLabel: "TKN LIMIT",
  },
];

export default function Home() {
  useScrollReveal();
  const termRef = useRef<HTMLElement | null>(null);

  const scrollToTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("aether-terminal-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <header className={styles.nav}>
        <span className={styles.navLogo}>
          <span className={styles.navLogoAe}>Æ</span>THER
        </span>

        <nav className={styles.navCenter}>
          <a href="#hypervisor" className={styles.navLink}>Engine</a>
          <a href="#features"   className={styles.navLink}>Specs</a>
          <a href="#terminal"   className={styles.navLink} onClick={scrollToTerminal}>Console</a>
        </nav>

        {/* "INITIALIZE" replaces "SYSTEM LIVE" — same position, now a CTA */}
        <button className={styles.navInit} onClick={scrollToTerminal} aria-label="Open console">
          <span className={styles.navInitDot}/>
          INITIALIZE
        </button>
      </header>

      {/* 01 — HERO */}
      <ShaderHero />

      {/* 02 — STATEMENT */}
      <section className={`${styles.statement} ${styles.reveal}`}>
        <div className={styles.statementInner}>
          <p className={styles.statementNum}>02</p>
          <p className={styles.statementText}>
            Not a library. Not a component.<br/>
            Raw <em>WebGL</em> — every pixel computed on the GPU,<br/>
            every frame shaped by where you point.
          </p>
        </div>
      </section>

      {/* 03 — RENDERING ENGINE */}
      <div className={styles.reveal}>
        <Showcase />
      </div>

      {/* 04 — WORLD NODE MAP (inspired by dragonfly.xyz) */}
      <section className={`${styles.globe} ${styles.reveal}`}>
        <div className={styles.globeHeader}>
          <span className={styles.secNum}>04</span>
          <h2 className={styles.globeTitle}>Global Signal</h2>
        </div>
        <div className={styles.globeMap} aria-hidden="true">
          <WorldDotMap />
        </div>
        <div className={styles.globeStats}>
          {[
            { n: "< 0.14ms", l: "FRAME TIME" },
            { n: "60fps",    l: "RENDER RATE" },
            { n: "800",      l: "INPUT CEILING" },
            { n: "0",        l: "DEPENDENCIES" },
          ].map(s => (
            <div key={s.l} className={styles.globeStat}>
              <span className={styles.globeStatN}>{s.n}</span>
              <span className={styles.globeStatL}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — SPECS */}
      <section id="features" className={`${styles.specsSection} ${styles.reveal}`}>
        <div className={styles.specsHeader}>
          <span className={styles.secNum}>05</span>
          <h2 className={styles.specsTitle}>Core Specs</h2>
        </div>
        <div className={styles.specsList}>
          {SPECS.map((s, i) => (
            <div key={i} className={styles.specRow} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.specLeft}>
                <span className={styles.specStat}>{s.stat}</span>
                <span className={styles.specStatLabel}>{s.statLabel}</span>
              </div>
              <div className={styles.specMiddle}>
                <span className={styles.specLabel}>{s.label}</span>
                <h3 className={styles.specTitle}>{s.title}</h3>
                <p className={styles.specBody}>{s.body}</p>
              </div>
              <div className={styles.specRight}>
                <span className={styles.specTag}>{s.tag}</span>
                <div className={styles.specLine}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — TERMINAL */}
      <section
        id="aether-terminal-section"
        className={`${styles.terminalWrapper} ${styles.reveal}`}
        ref={termRef as React.RefObject<HTMLElement>}
      >
        <div className={styles.terminalHeader}>
          <span className={styles.secNum}>06</span>
          <div>
            <h2 className={styles.terminalTitle}>Core Console</h2>
            <p className={styles.terminalDesc}>
              Ask the AI anything — routed through a hardened edge function with IP rate limiting.
              {" "}Local commands: <code>help</code>, <code>about</code>, <code>system</code>, <code>clear</code>
            </p>
          </div>
        </div>
        <Terminal />
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span className={styles.footerLogo}>ÆTHER OS</span>
          <div className={styles.footerMeta}>
            <span>Next.js 16.3 · Turbopack</span>
            <span className={styles.footerDot}>·</span>
            <span>Vanilla WebGL</span>
            <span className={styles.footerDot}>·</span>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>ALL PROTOCOLS OPERATIONAL</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}

// Inline SVG dot-map — pure CSS dots, no external asset
function WorldDotMap() {
  // Sparse dot pattern approximating a world silhouette (impressionistic)
  const dots: [number, number][] = [
    // North America
    [12,8],[13,8],[14,8],[15,9],[16,9],[17,10],[18,10],[18,11],[17,11],[16,11],
    [15,11],[14,12],[13,12],[12,12],[11,12],[10,13],[11,13],[12,13],[13,13],
    [14,14],[15,14],[16,14],[17,13],[18,12],[19,12],[19,13],[20,13],[20,14],
    // Europe
    [42,7],[43,7],[44,8],[45,8],[46,8],[47,9],[48,9],[49,9],[50,8],[51,8],
    [43,9],[44,9],[45,9],[46,9],[47,10],[48,10],[46,10],[45,10],[44,10],
    // Africa
    [44,13],[45,13],[46,13],[47,13],[48,13],[49,14],[50,14],[51,14],[52,15],
    [44,14],[45,14],[46,14],[47,14],[48,14],[49,15],[50,15],[51,15],
    [45,15],[46,15],[47,15],[48,15],[47,16],[48,16],[49,16],[48,17],[47,17],
    // Asia
    [52,7],[53,7],[54,7],[55,7],[56,7],[57,8],[58,8],[59,8],[60,8],[61,8],
    [62,9],[63,9],[64,9],[65,9],[66,9],[67,10],[68,10],[69,10],[70,11],
    [52,8],[53,8],[54,8],[55,8],[56,8],[57,9],[58,9],[59,9],[60,9],[61,9],
    [62,10],[63,10],[64,10],[65,10],[66,10],[67,11],[68,11],
    // Australia
    [68,17],[69,17],[70,17],[71,17],[69,18],[70,18],[71,18],[68,18],
    // South America
    [22,14],[23,14],[24,14],[23,15],[24,15],[25,15],[24,16],[25,16],[24,17],
    [25,17],[25,18],[24,18],[24,19],
  ];

  const cols = 84;
  const rows = 24;

  return (
    <svg
      viewBox={`0 0 ${cols * 10} ${rows * 10}`}
      className={styles.mapSvg}
      aria-label="World node map"
    >
      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx * 10 + 5}
          cy={cy * 10 + 5}
          r="1.5"
          fill="rgba(255,255,255,0.15)"
        />
      ))}
      {/* A few orange highlight dots */}
      {[[15,10],[45,9],[62,9],[50,14]].map(([cx, cy], i) => (
        <circle key={`h${i}`} cx={cx * 10 + 5} cy={cy * 10 + 5} r="2.5" fill="#ea3a00" opacity="0.7"/>
      ))}
    </svg>
  );
}

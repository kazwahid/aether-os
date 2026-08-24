"use client";

import { ShaderHero } from "../components/ShaderHero";
import { Showcase } from "../components/Showcase";
import { Terminal } from "../components/Terminal";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.root}>

      {/* Minimal sticky nav — word + symbol + menu link */}
      <header className={styles.nav}>
        <span className={styles.navLogo}>Æ<span className={styles.navLogoSub}>THER</span></span>
        <nav className={styles.navCenter}>
          <a href="#hypervisor" className={styles.navLink}>Hypervisor</a>
          <a href="#features" className={styles.navLink}>Specs</a>
          <a href="#terminal" className={styles.navLink}
            onClick={(e) => { e.preventDefault(); document.getElementById("aether-terminal-section")?.scrollIntoView({ behavior: "smooth" }); }}
          >Console</a>
        </nav>
        <span className={styles.navBadge}>SYSTEM LIVE</span>
      </header>

      {/* SECTION 01 — WebGL Shader Hero */}
      <ShaderHero />

      {/* SECTION 02 — Narrative break: single full-width text statement */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <p className={styles.statementNum}>02</p>
          <p className={styles.statementText}>
            A rendering engine that speaks in frequency and heat —<br />
            built without a framework. Purely <em>WebGL</em>, purely <em>intentional</em>.
          </p>
        </div>
      </section>

      {/* SECTION 03 — Hypervisor Showcase */}
      <div id="hypervisor">
        <Showcase />
      </div>

      {/* SECTION 04 — Specs grid: left-label + right-content pairs */}
      <section id="features" className={styles.specsSection}>
        <div className={styles.specsHeader}>
          <span className={styles.secNum}>04</span>
          <h2 className={styles.specsTitle}>Core Specifications</h2>
        </div>

        <div className={styles.specsList}>
          {[
            {
              label: "RENDERING",
              title: "Domain Warp Matrix",
              body: "4-octave fBm fed back into itself — f(p + 4f(p + t)) — produces organic plasma with no repeating grid artifacts.",
              tag: "GLSL_FBM_WARP",
            },
            {
              label: "INTERACTION",
              title: "Vector Gravity",
              body: "Mouse coordinates drive a rotation matrix that twists the coordinate domain. Influence decays as exp(–dist × 4), producing a gravitational swirl.",
              tag: "u_mouse",
            },
            {
              label: "PERFORMANCE",
              title: "Visibility Sleep",
              body: "On visibilitychange the rAF loop halts. On tab restore it resumes. Combined with DPR clamped at 2.0, the GPU overhead is always bounded.",
              tag: "rAF_GUARD",
            },
            {
              label: "SECURITY",
              title: "Token Bucket Gatekeeper",
              body: "5-token IP bucket refills at 1 token per 6 s. Stale records garbage-collected after 30 min. All prompts capped at 800 chars server-side.",
              tag: "429_PROTECTED",
            },
          ].map((s, i) => (
            <div key={i} className={styles.specRow}>
              <span className={styles.specLabel}>{s.label}</span>
              <div className={styles.specContent}>
                <h3 className={styles.specTitle}>{s.title}</h3>
                <p className={styles.specBody}>{s.body}</p>
              </div>
              <span className={styles.specTag}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 05 — AI Console Terminal */}
      <section id="terminal" className={styles.terminalWrapper}>
        <div className={styles.terminalHeader}>
          <span className={styles.secNum}>05</span>
          <h2 className={styles.terminalTitle}>Core Console</h2>
          <p className={styles.terminalDesc}>
            Streaming queries routed through a hardened serverless edge function.
          </p>
        </div>
        <Terminal />
      </section>

      {/* SECTION 06 — Footer with architecture one-liners */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span className={styles.footerLogo}>ÆTHER OS</span>
          <div className={styles.footerLinks}>
            <span className={styles.footerItem}>Next.js 16.3 — App Router</span>
            <span className={styles.footerDot}>·</span>
            <span className={styles.footerItem}>Vanilla WebGL</span>
            <span className={styles.footerDot}>·</span>
            <span className={styles.footerItem}>Gemini 2.5 Flash</span>
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

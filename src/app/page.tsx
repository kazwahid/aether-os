"use client";

import { ShaderHero } from "../components/ShaderHero";
import { Showcase } from "../components/Showcase";
import { Terminal } from "../components/Terminal";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Translucent Apple-like Sticky Navigation Bar */}
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <span className={styles.logoSymbol}>Æ</span>THER
          </div>
          <nav className={styles.navLinks}>
            <a href="#hypervisor" className={styles.navLink}>Hypervisor</a>
            <a href="#features" className={styles.navLink}>Specs</a>
            <a href="#terminal" className={styles.navLink}>Console</a>
            <a href="#readme" className={styles.navLink}>Architecture</a>
          </nav>
          <a
            href="#terminal"
            className={styles.navCta}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("aether-terminal-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Launch Console
          </a>
        </div>
      </header>

      {/* 1. Fullscreen WebGL Shader Hero */}
      <div id="hero">
        <ShaderHero />
      </div>

      {/* 2. Simulated Core Hypervisor (Mock Video Showcase) */}
      <div id="hypervisor">
        <Showcase />
      </div>

      {/* 3. Enterprise Bento Grid Specs */}
      <section id="features" className={styles.bentoSection}>
        <div className={styles.bentoContainer}>
          <div className={styles.bentoHeader}>
            <span className={styles.bentoTag}>INTELLIGENCE MATRIX</span>
            <h2 className={styles.bentoTitle}>Core Grid Specifications</h2>
            <p className={styles.bentoSubtitle}>
              Aether OS is built around client-side graphic pipelines and robust 
              serverless security layers.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento Card 1: Domain Warping Matrix (Spans 2 columns) */}
            <div className={`${styles.bentoCard} ${styles.span2}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>❖</span>
                <h3>Domain Warping Matrix</h3>
              </div>
              <p className={styles.cardText}>
                The graphic core utilizes a 4-octave Fractional Brownian Motion (fBm) 
                vector field. By feeding noise coordinate matrices back into themselves:
                <code>f(p + 4.0 * f(p + u_time))</code>, we create organic plasma flows 
                that prevent grid locking and produce fluid, gas-like visual progressions.
              </p>
              <div className={styles.glowingOrbContainer}>
                <div className={styles.glowingOrbPurple}></div>
                <div className={styles.glowingOrbCyan}></div>
              </div>
            </div>

            {/* Bento Card 2: Mouse Vector Gravity (Spans 1 column) */}
            <div className={styles.bentoCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>☉</span>
                <h3>Vector Gravity</h3>
              </div>
              <p className={styles.cardText}>
                A coordinate swirl matrix twists the spatial domains based on cursor distance. 
                Strongest at the cursor vector, it decays exponentially:
                <code>exp(-dist * 3.5)</code>, simulating visual gravity.
              </p>
              <div className={styles.interactiveVectorGraph}>
                <span className={styles.axisX}></span>
                <span className={styles.axisY}></span>
                <span className={styles.vectorNode}></span>
              </div>
            </div>

            {/* Bento Card 3: Visibility Sleep Protocol (Spans 1 column) */}
            <div className={styles.bentoCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>☾</span>
                <h3>Visibility Sleep</h3>
              </div>
              <p className={styles.cardText}>
                A visibility listener automatically freezes the shader&apos;s draw ticks 
                whenever the browser tab is hidden. This reduces resource footprint 
                to 0% when backgrounded.
              </p>
              <div className={styles.sleepMonitor}>
                <span className={styles.statusLabel}>THREAD STATUS:</span>
                <span className={styles.statusValue}>HIBERNATION SAFE</span>
              </div>
            </div>

            {/* Bento Card 4: Token Bucket Gatekeeper (Spans 2 columns) */}
            <div className={`${styles.bentoCard} ${styles.span2}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⛨</span>
                <h3>Token Bucket Gatekeeper</h3>
              </div>
              <p className={styles.cardText}>
                Guarding the LLM streaming api from abuse is an IP-based token-bucket 
                rate limiter. Clients are allocated a burst quota of 5 tokens. Invocations 
                consume 1 token, refilling at 1 token every 6 seconds. Stale IP records 
                are garbage-collected after 30 minutes of inactivity.
              </p>
              <div className={styles.tokenVisualizer}>
                <span className={styles.tokenNode}></span>
                <span className={styles.tokenNode}></span>
                <span className={styles.tokenNode}></span>
                <span className={styles.tokenNode}></span>
                <span className={styles.tokenNode}></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive AI Terminal Console */}
      <div id="terminal">
        <Terminal />
      </div>

      {/* 5. Embedded System Documentation / Readme Section */}
      <section id="readme" className={styles.readmeSection}>
        <div className={styles.readmeContent}>
          <div className={styles.readmeHeader}>
            <span className={styles.systemTag}>ARCHITECTURE SCHEMATIC</span>
            <h2 className={styles.readmeTitle}>Technical Design Log</h2>
          </div>

          <div className={styles.grid}>
            {/* Column 1: WebGL Shader Architecture */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>✦</span>
                <h3>WebGL Rendering Lifecycle</h3>
              </div>
              <p className={styles.cardText}>
                Instead of loading 1MB of <code>three.js</code> libraries, Aether OS compiles vertex and fragment shaders directly inside a custom React hook using raw WebGL APIs. This keeps initial bundle size extremely lightweight (FCP optimization).
              </p>
              <p className={styles.cardText}>
                On window resize, a <code>devicePixelRatio</code> clamp restricts canvas dimensions to a maximum of 2.0. This preserves display crispness on 4K/Retina displays while preventing rendering lag.
              </p>
            </div>

            {/* Column 2: API Security */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>🛡</span>
                <h3>API Quota Security</h3>
              </div>
              <p className={styles.cardText}>
                To prevent malicious resource depletion, the <code>/api/chat</code> route intercepts requests and checks client IP headers (<code>x-forwarded-for</code>, <code>x-real-ip</code>) against our sliding rate limiter.
              </p>
              <p className={styles.cardText}>
                Incoming payloads are validated client-side and server-side to reject non-string formats or prompts exceeding a strict 800-character safety ceiling.
              </p>
            </div>
          </div>

          <div className={styles.readmeFooter}>
            <p>ÆTHER CORE SYSTEM DIRECTIVE. ALL PROTOCOLS VERIFIED.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { ShaderHero } from "../components/ShaderHero";
import { Terminal } from "../components/Terminal";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 1. Fullscreen WebGL Shader Hero */}
      <ShaderHero />

      {/* 2. Interactive AI Terminal Console */}
      <Terminal />

      {/* 3. Embedded System Documentation / Readme Section */}
      <section id="readme-section" className={styles.readmeSection}>
        <div className={styles.readmeContent}>
          <div className={styles.header}>
            <span className={styles.systemTag}>DOCUMENTATION PROTOCOL</span>
            <h2 className={styles.title}>System Architecture & Design Decisions</h2>
          </div>

          <div className={styles.grid}>
            {/* Column 1: Shader Mechanics */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>✦</span>
                <h3>WebGL Shader Architecture</h3>
              </div>
              <p className={styles.cardText}>
                The background is rendered in vanilla WebGL using a custom fragment shader, compiled inside a React lifecycle hook. It operates using three core inputs (uniforms):
              </p>
              <ul className={styles.list}>
                <li>
                  <strong><code>u_time</code></strong>: Drives the base coordinate progression, causing fluid waves to morph and shift.
                </li>
                <li>
                  <strong><code>u_resolution</code></strong>: Computes coordinate aspect ratio correction, preventing visual stretching on window resize.
                </li>
                <li>
                  <strong><code>u_mouse</code></strong>: Captures normalized mouse vectors to apply a swirl/twist matrix and repulsion warp to coordinate domains.
                </li>
              </ul>
              <p className={styles.cardText}>
                The graphic uses a 4-octave Fractional Brownian Motion (fBm) noise field, colored using a custom cosine gradient palette. A high-frequency noise hash adds a retro film grain overlay, preventing gradient banding on high-DPI displays.
              </p>
            </div>

            {/* Column 2: Production Hygiene */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>🛡</span>
                <h3>Production Hygiene & Safeguards</h3>
              </div>
              <p className={styles.cardText}>
                To protect host resources and API credit thresholds, the AETHER terminal endpoint uses a strict validation suite:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Sliding IP Rate Limiter</strong>: Built on an in-memory Token Bucket algorithm. IPs are capped at 5 requests per 30 seconds. Excess hits receive a <code>429 Too Many Requests</code> with a <code>Retry-After</code> indicator.
                </li>
                <li>
                  <strong>Payload Limits</strong>: Client input length is physically capped at 800 characters both client-side and server-side. Non-string or empty payloads are rejected.
                </li>
                <li>
                  <strong>Timeout Caps</strong>: Serverless Edge routing is configured with a 30-second <code>maxDuration</code> parameter, terminating hanging connections.
                </li>
              </ul>
            </div>

            {/* Column 3: Performance & Fallback */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>⚡</span>
                <h3>Performance & Fallbacks</h3>
              </div>
              <p className={styles.cardText}>
                AETHER OS ships responsibly by optimizing CPU/GPU allocation:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>DPR Clamping</strong>: Canvas rendering is capped at a maximum <code>devicePixelRatio</code> of 2.0. This prevents performance degradation on ultra-high-resolution screens (Retina, 4K) without affecting visible sharpness.
                </li>
                <li>
                  <strong>Tab Sleep</strong>: The render loop uses a <code>visibilitychange</code> listener to pause the WebGL drawing ticks when the tab is hidden, preventing resource consumption.
                </li>
                <li>
                  <strong>Reduced Motion</strong>: Emulated media query detection immediately suspends the animation frame requests, rendering a single static frame to accommodate visual accessibility needs.
                </li>
              </ul>
            </div>

            {/* Column 4: AI Attribution */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>⚙</span>
                <h3>AI Engineering Disclosures</h3>
              </div>
              <p className={styles.cardText}>
                This digital masterpiece was engineered in a collaborative pair-programming session with Antigravity, an AI assistant:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>WebGL Math</strong>: The AI suggested the exponential decay formula for gravitational warping around mouse coordinates, and helped implement the cosine color gradient parameters.
                </li>
                <li>
                  <strong>State Integration</strong>: The AI generated the modular React canvas hook that cleans up memory buffers and safely binds resize observers.
                </li>
                <li>
                  <strong>Throttling Logic</strong>: The AI implemented the token-bucket rate limiter structure to prevent credit depletion while supporting a realistic streaming text response experience.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footer}>
            <p>AETHER OS PORTAL. ALL SYSTEMS OPERATIONAL.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

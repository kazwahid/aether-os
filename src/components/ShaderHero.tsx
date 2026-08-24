"use client";

import { useEffect, useRef, useState } from "react";
import { useWebGLShader } from "../hooks/useWebGLShader";
import styles from "./ShaderHero.module.css";

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const matches = mq.matches;
    const t = setTimeout(() => setReducedMotion(matches), 0);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => { clearTimeout(t); mq.removeEventListener("change", onChange); };
  }, []);

  useWebGLShader(canvasRef, { reducedMotion });

  return (
    <section className={styles.hero}>
      {/* Full-bleed WebGL canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Thin noise overlay — adds grain texture over canvas */}
      <div className={styles.noise} aria-hidden="true" />

      {/* Edge-to-edge headline layout — left-anchored, NOT centered */}
      <div className={styles.content}>
        {/* Top-left metadata strip */}
        <div className={styles.metaRow}>
          <span className={styles.sectionNum}>01</span>
          <span className={styles.metaDivider}>/</span>
          <span className={styles.metaLabel}>CORE INTERFACE</span>
        </div>

        {/* Giant display headline spanning full width */}
        <h1 className={styles.headline}>
          <span className={styles.headlineOrange}>ÆTHER</span>
          <span className={styles.headlineWhite}>OS</span>
        </h1>

        {/* Subline — left rail */}
        <p className={styles.subline}>
          The neural web interface. Move your cursor — the quantum field bends.
        </p>

        {/* Bottom row: CTA left, scroll signal right */}
        <div className={styles.bottomRow}>
          <a
            href="#terminal"
            className={styles.ctaButton}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("aether-terminal-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Initialize Console
            <span className={styles.ctaArrow}>→</span>
          </a>

          <div className={styles.scrollHint}>
            <span className={styles.scrollLabel}>SCROLL</span>
            <span className={styles.scrollLine}></span>
          </div>
        </div>
      </div>

      {/* Bottom-left coordinates — like dragonfly */}
      <div className={styles.coords}>
        <span>LAT 33.8688° N</span>
        <span>LNG 151.2093° E</span>
      </div>
    </section>
  );
}

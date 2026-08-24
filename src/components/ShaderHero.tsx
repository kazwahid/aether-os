"use client";

import { useEffect, useRef, useState } from "react";
import { useWebGLShader } from "../hooks/useWebGLShader";
import styles from "./ShaderHero.module.css";

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t = setTimeout(() => setReducedMotion(mq.matches), 0);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => { clearTimeout(t); mq.removeEventListener("change", onChange); };
  }, []);

  useWebGLShader(canvasRef, { reducedMotion });

  return (
    <section className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.sectionNum}>01</span>
          <span className={styles.metaDivider}>/</span>
          <span className={styles.metaLabel}>INTERFACE</span>
        </div>

        {/* Single-line headline — ÆTHER OS */}
        <h1 className={styles.headline}>
          <span className={styles.headlineOrange}>Æ</span>
          <span className={styles.headlineWhite}>THER&nbsp;OS</span>
        </h1>

        <p className={styles.subline}>
          Move your cursor — the field bends around you.
        </p>
      </div>

      {/* Bottom-right geo */}
      <div className={styles.coords} aria-hidden="true">
        <span>33.8688° N</span>
        <span>151.2093° E</span>
      </div>

      {/* Scroll beacon — simple orange chevron, no animation rings */}
      <div className={styles.scrollBeacon} aria-hidden="true">
        <svg viewBox="0 0 24 14" fill="none" className={styles.chevron}>
          <polyline
            points="2,3 12,11 22,3"
            stroke="#ea3a00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="2,8 12,16 22,8"
            stroke="#ea3a00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
        </svg>
      </div>
    </section>
  );
}

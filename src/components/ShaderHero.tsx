"use client";

import { useEffect, useRef, useState } from "react";
import { useWebGLShader } from "../hooks/useWebGLShader";
import styles from "./ShaderHero.module.css";

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t  = setTimeout(() => setReducedMotion(mq.matches), 0);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => { clearTimeout(t); mq.removeEventListener("change", onChange); };
  }, []);

  useWebGLShader(canvasRef, { reducedMotion });

  return (
    <section className={styles.hero}>
      {/* Full-bleed WebGL canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Grain noise overlay */}
      <div className={styles.noise} aria-hidden="true" />

      {/* Left-rail content — bottom-anchored */}
      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.sectionNum}>01</span>
          <span className={styles.metaDivider}>/</span>
          <span className={styles.metaLabel}>CORE INTERFACE</span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineOrange}>Æ</span>
          <span className={styles.headlineWhite}>THER</span>
          <br />
          <span className={styles.headlineWhite}>OS</span>
        </h1>

        <p className={styles.subline}>
          A quantum neural interface.<br />
          Move your cursor — the field bends around you.
        </p>
      </div>

      {/* Bottom-right geo label */}
      <div className={styles.coords} aria-hidden="true">
        <span>33.8688° N</span>
        <span>151.2093° E</span>
      </div>

      {/* Centered bottom scroll beacon */}
      <div className={styles.scrollBeacon} aria-hidden="true">
        <div className={styles.beaconRing} />
        <div className={styles.beaconDot} />
        <svg className={styles.beaconChevron} viewBox="0 0 16 8" fill="none">
          <polyline points="2,2 8,6 14,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

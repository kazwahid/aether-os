"use client";

import { useEffect, useRef, useState } from "react";
import { useWebGLShader } from "../hooks/useWebGLShader";
import styles from "./ShaderHero.module.css";

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect user preferences for reduced motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set state asynchronously to avoid synchronous setState cascading renders in effect body
    const matches = mediaQuery.matches;
    const timeoutId = setTimeout(() => {
      setReducedMotion(matches);
    }, 0);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Initialize the WebGL shader rendering on the canvas
  useWebGLShader(canvasRef, { reducedMotion });

  const handleScrollToTerminal = () => {
    const terminalElement = document.getElementById("aether-terminal-section");
    if (terminalElement) {
      terminalElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* WebGL Canvas rendering the background fragment shader */}
      <canvas
        ref={canvasRef}
        className={styles.shaderCanvas}
        data-reduced-motion={reducedMotion ? "true" : "false"}
      />

      {/* Screen reader fallback text for accessibility */}
      <div className="sr-only" style={{ display: "none" }}>
        Interactive quantum field neural shader background. A flowing mesh of
        deep purple and neon blue waves that bend and react to your mouse movements.
      </div>

      {/* Hero Content Overlay */}
      <div className={styles.heroOverlay}>
        <div className={styles.glassCard}>
          <div className={styles.badge}>SYSTEM INTEGRITY: ACTIVE</div>
          <h1 className={styles.title}>AETHER OS</h1>
          <h2 className={styles.subtitle}>The Neural Web Interface</h2>
          
          <p className={styles.description}>
            Experience a digital masterpiece driven by intelligence and visual flow. 
            Moving your cursor bends the underlying quantum field, warping coordinate 
            dimensions in real-time.
          </p>

          <div className={styles.actions}>
            <button
              onClick={handleScrollToTerminal}
              className={styles.primaryButton}
              aria-label="Initialize Core Console API Connection"
            >
              Initialize Console
            </button>
            <a
              href="#documentation"
              className={styles.secondaryButton}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("readme-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              System Readme
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className={styles.scrollIndicator} onClick={handleScrollToTerminal}>
        <span className={styles.scrollText}>SCROLL TO INITIALIZE TERMINAL</span>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
}

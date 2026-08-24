"use client";

import { useEffect, useState } from "react";
import styles from "./Showcase.module.css";

export function Showcase() {
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING AETHER HYPERVISOR V2.8.4",
    "BOUNDING WEBGL RENDER BUFFER [1080P COMPENSATED]",
  ]);
  const [metrics, setMetrics] = useState({
    cpu: 14.2,
    memory: 42.1,
    coherence: 99.82,
  });

  // Simulated live log ticker
  useEffect(() => {
    const logDatabase = [
      "ESTABLISHING SECURE GATEWAY TUNNEL [PORTAL-80-EDGE]",
      "POLLING INTEL L1/L2 SHADER CACHE",
      "CLAMPING devicePixelRatio TO PREVENT OVERHEAD",
      "RESIZING DRAW BUFFER - SCALE STRETCH FIXED",
      "visibilitychange STATE: RUNNING (ACTIVE)",
      "REFRESHING MEMORY MAPS... OK",
      "COMPILING FRACTAL BROWNIAN MOTION ROUTINES",
      "SYNCHRONIZING u_mouse VECTORS",
      "GARBAGE COLLECTION: PURGED INACTIVE CLIENT IPs",
      "AETHER SYSTEM INTEGRITY CHECK: 100% OPERATIONAL",
    ];

    let index = 0;
    const logInterval = setInterval(() => {
      setLogs((prev) => {
        const nextLogs = [...prev, logDatabase[index]];
        if (nextLogs.length > 5) {
          nextLogs.shift(); // Keep buffer small
        }
        return nextLogs;
      });
      index = (index + 1) % logDatabase.length;
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  // Simulated metrics oscillator
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics(() => ({
        cpu: parseFloat((12.4 + Math.sin(Date.now() / 2000) * 3.5).toFixed(1)),
        memory: parseFloat((41.8 + Math.cos(Date.now() / 3000) * 0.4).toFixed(1)),
        coherence: parseFloat((99.8 + Math.sin(Date.now() / 1000) * 0.05).toFixed(2)),
      }));
    }, 800);

    return () => clearInterval(metricsInterval);
  }, []);

  return (
    <section className={styles.showcaseSection}>
      <div className={styles.container}>
        <div className={styles.tag}>CORE PREVIEW</div>
        <h2 className={styles.title}>Simulated Core Hypervisor</h2>
        <p className={styles.subtitle}>
          Observe the underlying telemetry of AETHER OS. Running processes, 
          thread loads, and memory footprints scale in sync with your canvas.
        </p>

        {/* Apple-style Mock Interface Window */}
        <div className={styles.windowFrame}>
          {/* Header Bar */}
          <div className={styles.windowHeader}>
            <div className={styles.dots}>
              <span className={styles.dotClose}></span>
              <span className={styles.dotMin}></span>
              <span className={styles.dotMax}></span>
            </div>
            <div className={styles.titleText}>aether-monitor://kernel-root</div>
            <div className={styles.latencyBadge}>LATENCY: 0.14ms</div>
          </div>

          {/* Window Body Layout */}
          <div className={styles.windowBody}>
            {/* Left Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.navGroup}>
                <span className={styles.groupLabel}>MONITORS</span>
                <span className={`${styles.navItem} ${styles.active}`}>
                  <span className={styles.icon}>◆</span> Kernel Console
                </span>
                <span className={styles.navItem}>
                  <span className={styles.icon}>◇</span> Thread Manager
                </span>
                <span className={styles.navItem}>
                  <span className={styles.icon}>◇</span> Security Shields
                </span>
              </div>
              <div className={styles.navGroup}>
                <span className={styles.groupLabel}>GRAPHICS</span>
                <span className={styles.navItem}>
                  <span className={styles.icon}>⚿</span> WebGL Viewport
                </span>
                <span className={styles.navItem}>
                  <span className={styles.icon}>⚙</span> Shader Cache
                </span>
              </div>
            </div>

            {/* Central Visualizer Area */}
            <div className={styles.mainArea}>
              <div className={styles.visualizerCard}>
                <div className={styles.gridOverlay}></div>
                
                {/* SVG pulsing neural diagram */}
                <svg viewBox="0 0 200 200" className={styles.neuralSvg}>
                  <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  {/* Glowing core */}
                  <circle cx="100" cy="100" r="45" fill="url(#glow)" className={styles.pulseCore} />
                  
                  {/* Outer Rings */}
                  <circle cx="100" cy="100" r="40" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="0.5" fill="none" />
                  <circle cx="100" cy="100" r="60" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" fill="none" />

                  {/* Pulsing connections */}
                  <line x1="100" y1="100" x2="60" y2="60" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.75" />
                  <line x1="100" y1="100" x2="140" y2="60" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.75" />
                  <line x1="100" y1="100" x2="100" y2="160" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.75" />
                  
                  {/* Orbit nodes */}
                  <circle cx="60" cy="60" r="3" fill="#a855f7" />
                  <circle cx="140" cy="60" r="3" fill="#06b6d4" />
                  <circle cx="100" cy="160" r="3" fill="#22c55e" />
                  <circle cx="100" cy="100" r="5" fill="#ffffff" />
                </svg>

                <div className={styles.statusOverlay}>
                  SYSTEM INTEGRITY SECURED
                </div>
              </div>

              {/* Bottom live logs stream */}
              <div className={styles.consoleLogs}>
                {logs.map((log, idx) => (
                  <div key={idx} className={styles.logLine}>
                    <span className={styles.timestamp}>[{new Date().toLocaleTimeString()}]</span>{" "}
                    {log}
                  </div>
                ))}
                <div className={styles.blinker}></div>
              </div>
            </div>

            {/* Right Telemetry Sidebar */}
            <div className={styles.rightSidebar}>
              <span className={styles.groupLabel}>TELEMETRY</span>
              
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <span>CPU ALLOCATION</span>
                  <span>{metrics.cpu}%</span>
                </div>
                <div className={styles.barBg}>
                  <div 
                    className={styles.barFillCyan} 
                    style={{ width: `${metrics.cpu * 4}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <span>THREAD ALLOCATION</span>
                  <span>{metrics.memory}%</span>
                </div>
                <div className={styles.barBg}>
                  <div 
                    className={styles.barFillPurple} 
                    style={{ width: `${metrics.memory}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <span>QUANTUM COHERENCE</span>
                  <span>{metrics.coherence}%</span>
                </div>
                <div className={styles.barBg}>
                  <div 
                    className={styles.barFillGreen} 
                    style={{ width: `${(metrics.coherence - 99.0) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.systemDetails}>
                <div className={styles.detailRow}>
                  <span>CORE TEMP</span>
                  <span className={styles.greenText}>34°C</span>
                </div>
                <div className={styles.detailRow}>
                  <span>MEMORY FOOTPRINT</span>
                  <span>412MB</span>
                </div>
                <div className={styles.detailRow}>
                  <span>ACTIVE KERNEL SHADERS</span>
                  <span>GLSL_FBM_WARP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Showcase;

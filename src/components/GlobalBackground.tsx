import { useEffect, useRef } from "react";
import {
  LIVE_BACKGROUND_NODES,
  LIVE_BACKGROUND_EDGES,
  LIVE_BACKGROUND_PARTICLES,
  computeBackgroundParallax,
} from "../data/portfolioData";
import "./styles/GlobalBackground.css";

/**
 * Live GPU-composited Obsidian-Black Developer Backdrop.
 * Features gently pulsing network nodes, traveling data signal lines,
 * sparse drifting micro-particles, slow ambient aurora lighting, and
 * eased cursor parallax (respecting prefers-reduced-motion & touch devices).
 */
const GlobalBackground = () => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = backdropRef.current;
    if (!el || typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    let prefersReduced = motionQuery.matches;
    let isCoarsePointer = pointerQuery.matches;

    let target = {
      networkX: 0,
      networkY: 0,
      particlesX: 0,
      particlesY: 0,
      glowX: 0,
      glowY: 0,
    };
    let current = { ...target };
    let rafId = 0;
    let isAnimating = false;

    const applyOffsets = (offsets: typeof current) => {
      el.style.setProperty("--bg-net-x", `${offsets.networkX.toFixed(2)}px`);
      el.style.setProperty("--bg-net-y", `${offsets.networkY.toFixed(2)}px`);
      el.style.setProperty("--bg-part-x", `${offsets.particlesX.toFixed(2)}px`);
      el.style.setProperty("--bg-part-y", `${offsets.particlesY.toFixed(2)}px`);
      el.style.setProperty("--bg-glow-x", `${offsets.glowX.toFixed(2)}px`);
      el.style.setProperty("--bg-glow-y", `${offsets.glowY.toFixed(2)}px`);
    };

    const stepParallax = () => {
      const lerp = 0.06;
      current.networkX += (target.networkX - current.networkX) * lerp;
      current.networkY += (target.networkY - current.networkY) * lerp;
      current.particlesX += (target.particlesX - current.particlesX) * lerp;
      current.particlesY += (target.particlesY - current.particlesY) * lerp;
      current.glowX += (target.glowX - current.glowX) * lerp;
      current.glowY += (target.glowY - current.glowY) * lerp;

      applyOffsets(current);

      const delta =
        Math.abs(target.networkX - current.networkX) +
        Math.abs(target.networkY - current.networkY) +
        Math.abs(target.particlesX - current.particlesX) +
        Math.abs(target.particlesY - current.particlesY);

      if (delta > 0.05 && !prefersReduced && !isCoarsePointer) {
        rafId = window.requestAnimationFrame(stepParallax);
      } else {
        isAnimating = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (prefersReduced || isCoarsePointer) return;
      target = computeBackgroundParallax(
        e.clientX,
        e.clientY,
        window.innerWidth,
        window.innerHeight,
        prefersReduced,
        isCoarsePointer
      );
      if (!isAnimating) {
        isAnimating = true;
        rafId = window.requestAnimationFrame(stepParallax);
      }
    };

    const onMediaChange = () => {
      prefersReduced = motionQuery.matches;
      isCoarsePointer = pointerQuery.matches;
      if (prefersReduced || isCoarsePointer) {
        window.cancelAnimationFrame(rafId);
        isAnimating = false;
        target = {
          networkX: 0,
          networkY: 0,
          particlesX: 0,
          particlesY: 0,
          glowX: 0,
          glowY: 0,
        };
        current = { ...target };
        applyOffsets(current);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    motionQuery.addEventListener?.("change", onMediaChange);
    pointerQuery.addEventListener?.("change", onMediaChange);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      motionQuery.removeEventListener?.("change", onMediaChange);
      pointerQuery.removeEventListener?.("change", onMediaChange);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className="global-live-backdrop"
      data-testid="global-3d-wallpaper"
      aria-hidden="true"
    >
      {/* Layer 1: Background grid and slowly moving atmospheric glow */}
      <div className="global-architectural-grid" />
      <div className="global-ambient-glow-wrap">
        <div className="global-aurora-orb global-orb-1" />
        <div className="global-aurora-orb global-orb-2" />
        <div className="global-aurora-orb global-orb-3" />
        <div className="global-horizon-beam" />
      </div>

      {/* Layer 2: Sparse, slowly drifting micro-particles */}
      <div className="global-particles-layer" data-testid="global-live-particles">
        {LIVE_BACKGROUND_PARTICLES.map((p) => (
          <span
            key={p.id}
            className={`global-particle global-particle-${p.tone}`}
            style={{
              left: `${p.leftPercent}%`,
              top: `${p.topPercent}%`,
              width: `${p.sizePx}px`,
              height: `${p.sizePx}px`,
              opacity: p.opacity,
              animationDuration: `${p.driftDurationSec}s`,
              animationDelay: `-${p.driftDelaySec}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Animated neural network constellation with traveling signals & pulsing nodes */}
      <svg
        className="global-3d-canvas-wrap"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="nodeGlowViolet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#a855f7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cffafe" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#35d6e7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="signalGradViolet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#c4a1ff" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#35d6e7" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="signalGradCyan" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#35d6e7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Static Base Network Connections */}
        <g className="global-network-edges">
          {LIVE_BACKGROUND_EDGES.map((edge) => (
            <line
              key={edge.id}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke={edge.tone === "violet" ? "#8b5cf6" : "#38bdf8"}
              strokeOpacity="0.16"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Traveling Light Signals on Selected Network Connections */}
        <g
          className="global-network-signals"
          data-testid="global-network-signals"
        >
          {LIVE_BACKGROUND_EDGES.filter((e) => e.hasSignal).map((edge) => (
            <line
              key={`sig-${edge.id}`}
              className="global-signal-line"
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke={
                edge.tone === "violet"
                  ? "url(#signalGradViolet)"
                  : "url(#signalGradCyan)"
              }
              strokeWidth="1.75"
              strokeLinecap="round"
              style={{
                animationDuration: `${edge.signalDurationSec}s`,
                animationDelay: `-${edge.signalDelaySec}s`,
              }}
            />
          ))}
        </g>

        {/* Gently Pulsing Network Nodes with Soft Radial Gradient Halo */}
        <g
          className="global-network-nodes"
          data-testid="global-network-nodes"
        >
          {LIVE_BACKGROUND_NODES.map((node) => (
            <g
              key={node.id}
              className="global-pulse-node"
              style={{
                transformOrigin: `${node.cx}px ${node.cy}px`,
                animationDuration: `${node.pulseDurationSec}s`,
                animationDelay: `-${node.pulseDelaySec}s`,
              }}
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 2.8}
                fill={
                  node.tone === "violet"
                    ? "url(#nodeGlowViolet)"
                    : "url(#nodeGlowCyan)"
                }
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 0.68}
                fill={node.tone === "violet" ? "#e9d5ff" : "#a5f3fc"}
                fillOpacity="0.94"
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="global-contrast-vignette" />
    </div>
  );
};

export default GlobalBackground;


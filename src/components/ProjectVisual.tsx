import React, { useState } from "react";
import "./styles/ProjectVisual.css";

interface ProjectVisualProps {
  projectId: string;
  title: string;
  inView?: boolean;
  imageUrl?: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  projectId,
  title,
  inView = true,
  imageUrl,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasCustomImage =
    Boolean(imageUrl) && imageUrl !== "/images/placeholder.webp";

  if (!inView) {
    return (
      <div
        className="project-visual-canvas project-visual-placeholder"
        aria-hidden="true"
        data-lazy-loaded="false"
      >
        <div className="visual-shimmer-pulse" />
        <div className="visual-badge">Loading Preview…</div>
      </div>
    );
  }

  const renderCustomImageLayer = () =>
    hasCustomImage ? (
      <img
        src={imageUrl}
        alt={`${title} preview`}
        loading="lazy"
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className={`visual-lazy-image ${imgLoaded ? "loaded" : ""}`}
      />
    ) : null;

  switch (projectId) {
    case "aarogya-x":
    case "aarogyax":
      return (
        <div
          className="project-visual-canvas aarogyax-visual visual-is-active"
          aria-hidden="true"
          data-lazy-loaded="true"
        >
          {renderCustomImageLayer()}
          <div className="visual-glow-bg" />
          <svg className="visual-svg visual-svg-enter" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Backdrop */}
            <defs>
              <pattern id="amr-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(194, 164, 255, 0.08)" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c2a4ff" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="url(#amr-grid)" />

            {/* Pathogen Radar Target */}
            <circle cx="100" cy="100" r="70" stroke="rgba(194, 164, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="45" stroke="rgba(194, 164, 255, 0.25)" strokeWidth="1" />
            <circle cx="100" cy="100" r="20" stroke="rgba(194, 164, 255, 0.4)" strokeWidth="1.2" />
            <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(194, 164, 255, 0.2)" strokeWidth="0.8" />
            <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(194, 164, 255, 0.2)" strokeWidth="0.8" />

            {/* Radar Polygon Profile */}
            <polygon
              points="100,40 140,85 125,135 65,120 70,75"
              fill="rgba(194, 164, 255, 0.2)"
              stroke="#c2a4ff"
              strokeWidth="1.8"
            />
            <circle cx="100" cy="40" r="3.5" fill="#c2a4ff" />
            <circle cx="140" cy="85" r="3.5" fill="#38bdf8" />
            <circle cx="125" cy="135" r="3.5" fill="#c2a4ff" />
            <circle cx="65" cy="120" r="3.5" fill="#a78bfa" />
            <circle cx="70" cy="75" r="3.5" fill="#38bdf8" />

            {/* Genomic Strand Path */}
            <path
              d="M 200 60 C 230 40, 260 80, 290 60 C 320 40, 350 80, 380 60"
              stroke="url(#dnaGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 200 80 C 230 100, 260 60, 290 80 C 320 100, 350 60, 380 80"
              stroke="url(#dnaGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Molecular Markers & Susceptibility indicators */}
            <g transform="translate(200, 110)">
              <rect x="0" y="0" width="180" height="26" rx="6" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(194, 164, 255, 0.3)" />
              <text x="12" y="17" fill="#c2a4ff" fontSize="10.5" fontFamily="monospace" fontWeight="600">
                ML AMR RISK PREDICTION
              </text>
            </g>
            <g transform="translate(200, 145)">
              <rect x="0" y="0" width="180" height="26" rx="6" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(56, 189, 248, 0.3)" />
              <text x="12" y="17" fill="#38bdf8" fontSize="10.5" fontFamily="monospace" fontWeight="600">
                STEWARDSHIP &amp; ADR ENGINE
              </text>
            </g>
          </svg>
          <div className="visual-badge">Healthcare AI · Python &amp; Scikit-learn</div>
        </div>
      );

    case "hirelogix":
      return (
        <div
          className="project-visual-canvas hirelogix-visual visual-is-active"
          aria-hidden="true"
          data-lazy-loaded="true"
        >
          {renderCustomImageLayer()}
          <div className="visual-glow-bg" />
          <svg className="visual-svg visual-svg-enter" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hire-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(194, 164, 255, 0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#hire-grid)" />

            {/* Circular Gauge 94% Match */}
            <circle cx="90" cy="100" r="54" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" />
            <circle
              cx="90"
              cy="100"
              r="54"
              stroke="#c2a4ff"
              strokeWidth="8"
              strokeDasharray="339.29"
              strokeDashoffset="20.35"
              strokeLinecap="round"
              transform="rotate(-90 90 100)"
            />
            <text x="90" y="96" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700" fontFamily="sans-serif">
              94%
            </text>
            <text x="90" y="114" textAnchor="middle" fill="#c2a4ff" fontSize="10" fontWeight="600" letterSpacing="0.8">
              ATS MATCH
            </text>

            {/* Pipeline Stream Connectors */}
            <line x1="160" y1="100" x2="190" y2="100" stroke="#c2a4ff" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Parse Pipeline Cards */}
            <g transform="translate(190, 45)">
              <rect width="185" height="34" rx="6" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(194, 164, 255, 0.25)" />
              <text x="12" y="21" fill="#fff" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                JobSpy Discovery Pipeline
              </text>
              <circle cx="165" cy="17" r="4" fill="#10b981" />
            </g>

            <g transform="translate(190, 88)">
              <rect width="185" height="34" rx="6" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(194, 164, 255, 0.25)" />
              <text x="12" y="21" fill="#c2a4ff" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                PDF Keyword Extractor
              </text>
              <circle cx="165" cy="17" r="4" fill="#c2a4ff" />
            </g>

            <g transform="translate(190, 131)">
              <rect width="185" height="34" rx="6" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(56, 189, 248, 0.25)" />
              <text x="12" y="21" fill="#38bdf8" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                FastAPI Resume Scoring
              </text>
              <circle cx="165" cy="17" r="4" fill="#38bdf8" />
            </g>
          </svg>
          <div className="visual-badge">Career Intelligence · Python &amp; FastAPI</div>
        </div>
      );

    case "nova-ai":
      return (
        <div
          className="project-visual-canvas nova-visual visual-is-active"
          aria-hidden="true"
          data-lazy-loaded="true"
        >
          {renderCustomImageLayer()}
          <div className="visual-glow-bg" />
          <svg className="visual-svg visual-svg-enter" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="nova-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(194, 164, 255, 0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#nova-grid)" />

            {/* Audio Wave Visualizer Center */}
            <circle cx="100" cy="100" r="50" stroke="rgba(194, 164, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="32" stroke="rgba(194, 164, 255, 0.4)" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="14" fill="#c2a4ff" />

            {/* Waveform Bars */}
            {[20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 180].map((x, i) => {
              const h = [24, 45, 60, 35, 75, 90, 70, 50, 65, 40, 20][i];
              return (
                <rect
                  key={i}
                  x={x + 190}
                  y={100 - h / 2}
                  width="8"
                  height={h}
                  rx="4"
                  fill="url(#novaGrad)"
                  className="wave-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}

            <defs>
              <linearGradient id="novaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c2a4ff" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Status telemetry tag */}
            <g transform="translate(30, 155)">
              <rect width="140" height="24" rx="4" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(194, 164, 255, 0.3)" />
              <text x="10" y="16" fill="#c2a4ff" fontSize="10" fontFamily="monospace" fontWeight="600">
                VOICE PIPELINE · ACTIVE
              </text>
            </g>
          </svg>
          <div className="visual-badge">Voice AI · Python &amp; OpenCV</div>
        </div>
      );

    case "programming-fundamentals":
      return (
        <div
          className="project-visual-canvas prog-visual visual-is-active"
          aria-hidden="true"
          data-lazy-loaded="true"
        >
          {renderCustomImageLayer()}
          <div className="visual-glow-bg" />
          <svg className="visual-svg visual-svg-enter" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Code Structure Diagram */}
            <rect x="25" y="30" width="165" height="140" rx="8" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(194, 164, 255, 0.3)" />
            <text x="40" y="55" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="600">class Algorithm:</text>
            <text x="50" y="75" fill="#a78bfa" fontSize="10" fontFamily="monospace">def solve(self, data):</text>
            <text x="50" y="95" fill="#9d96a0" fontSize="10" fontFamily="monospace">return optimize(data)</text>
            <text x="40" y="115" fill="#38bdf8" fontSize="11" fontFamily="monospace"># Modular OOP Design</text>
            <text x="40" y="135" fill="#c2a4ff" fontSize="10" fontFamily="monospace">Python · Java · OOP</text>
            <text x="40" y="152" fill="#10b981" fontSize="10" fontFamily="monospace">Clean Architecture</text>

            {/* Connecting Pointer */}
            <path d="M 190 100 L 230 100" stroke="#c2a4ff" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="230,96 238,100 230,104" fill="#c2a4ff" />

            {/* Core Pillars Card */}
            <rect x="240" y="30" width="135" height="140" rx="8" fill="rgba(17, 14, 24, 0.9)" stroke="rgba(255, 255, 255, 0.1)" />
            <text x="255" y="55" fill="#ffffff" fontSize="11" fontWeight="700">OOP Pillars</text>
            <text x="255" y="80" fill="#cfcbcf" fontSize="10">· Encapsulation</text>
            <text x="255" y="102" fill="#cfcbcf" fontSize="10">· Inheritance</text>
            <text x="255" y="124" fill="#cfcbcf" fontSize="10">· Polymorphism</text>
            <text x="255" y="146" fill="#cfcbcf" fontSize="10">· Abstraction</text>
          </svg>
          <div className="visual-badge">Python &amp; Java OOP Core</div>
        </div>
      );

    case "dsa-extra-questions":
    default:
      return (
        <div
          className="project-visual-canvas dsa-visual visual-is-active"
          aria-hidden="true"
          data-lazy-loaded="true"
        >
          {renderCustomImageLayer()}
          <div className="visual-glow-bg" />
          <svg className="visual-svg visual-svg-enter" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Binary Search Tree Nodes */}
            {/* Root */}
            <circle cx="200" cy="40" r="16" fill="rgba(194, 164, 255, 0.25)" stroke="#c2a4ff" strokeWidth="2" />
            <text x="200" y="44" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">50</text>

            {/* Branches Left & Right */}
            <line x1="188" y1="52" x2="135" y2="88" stroke="rgba(194, 164, 255, 0.4)" strokeWidth="1.5" />
            <line x1="212" y1="52" x2="265" y2="88" stroke="rgba(194, 164, 255, 0.4)" strokeWidth="1.5" />

            {/* Level 1 Nodes */}
            <circle cx="125" cy="100" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.8" />
            <text x="125" y="104" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">25</text>

            <circle cx="275" cy="100" r="14" fill="rgba(194, 164, 255, 0.2)" stroke="#c2a4ff" strokeWidth="1.8" />
            <text x="275" y="104" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">75</text>

            {/* Branches to Level 2 */}
            <line x1="115" y1="112" x2="80" y2="148" stroke="rgba(194, 164, 255, 0.3)" strokeWidth="1.2" />
            <line x1="135" y1="112" x2="160" y2="148" stroke="rgba(194, 164, 255, 0.3)" strokeWidth="1.2" />
            <line x1="265" y1="112" x2="240" y2="148" stroke="rgba(194, 164, 255, 0.3)" strokeWidth="1.2" />
            <line x1="285" y1="112" x2="315" y2="148" stroke="rgba(194, 164, 255, 0.3)" strokeWidth="1.2" />

            {/* Level 2 Nodes */}
            <circle cx="75" cy="158" r="11" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <text x="75" y="161" textAnchor="middle" fill="#cfcbcf" fontSize="9">12</text>

            <circle cx="165" cy="158" r="11" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <text x="165" y="161" textAnchor="middle" fill="#cfcbcf" fontSize="9">37</text>

            <circle cx="235" cy="158" r="11" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <text x="235" y="161" textAnchor="middle" fill="#cfcbcf" fontSize="9">62</text>

            <circle cx="320" cy="158" r="11" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <text x="320" y="161" textAnchor="middle" fill="#cfcbcf" fontSize="9">88</text>

            {/* Complexity notation badge */}
            <g transform="translate(20, 20)">
              <rect width="90" height="22" rx="4" fill="rgba(17, 14, 24, 0.85)" stroke="rgba(194, 164, 255, 0.3)" />
              <text x="10" y="15" fill="#c2a4ff" fontSize="10" fontFamily="monospace" fontWeight="600">
                O(log N) SEARCH
              </text>
            </g>
          </svg>
          <div className="visual-badge">Algorithms &amp; Data Structures</div>
        </div>
      );
  }
};

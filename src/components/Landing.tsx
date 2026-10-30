import { PropsWithChildren, useEffect, useRef } from "react";
import { FiDownload, FiFileText, FiTerminal, FiCode } from "react-icons/fi";
import { FaGithub } from "react-icons/fa6";
import "./styles/Landing.css";
import {
  PROFILE_INFO,
  RESUME_FILE,
  triggerResumeDownload,
  getTerminalTypingFrame,
  HERO_TERMINAL_STACK_SEQUENCES,
} from "../data/portfolioData";

interface LandingProps extends PropsWithChildren {
  onOpenResume?: () => void;
}

const INITIAL_TYPING_OFFSET_MS =
  HERO_TERMINAL_STACK_SEQUENCES[0].stackText.length * 42;

const Landing = ({ children, onOpenResume }: LandingProps) => {
  const cmdRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<HTMLElement>(null);

  const initialFrame = getTerminalTypingFrame(INITIAL_TYPING_OFFSET_MS);

  useEffect(() => {
    const startPerf = performance.now() - INITIAL_TYPING_OFFSET_MS;
    let lastDisplayed = initialFrame.displayedText;
    let lastCmd = initialFrame.command;

    const intervalId = window.setInterval(() => {
      const frame = getTerminalTypingFrame(
        Math.floor(performance.now() - startPerf)
      );
      if (frame.displayedText !== lastDisplayed && typedRef.current) {
        typedRef.current.textContent = frame.displayedText;
        lastDisplayed = frame.displayedText;
      }
      if (frame.command !== lastCmd) {
        if (cmdRef.current) {
          cmdRef.current.textContent = `~/daksh-mehra $ ${frame.command}`;
        }
        if (badgeRef.current) {
          badgeRef.current.textContent = frame.badge;
        }
        lastCmd = frame.command;
      }
    }, 60);

    return () => window.clearInterval(intervalId);
  }, [initialFrame.command, initialFrame.displayedText]);

  return (
    <div className="landing-section" id="landingDiv">
      {/* Multi-layered atmospheric hero stage backlight */}
      <div className="landing-ambient-glow" aria-hidden="true" />
      <div className="landing-cyber-halo" aria-hidden="true" />

      <div className="landing-container">
        {/* Top Hero Stage: Left & Right Typographic Balcony */}
        <div className="landing-hero-stage">
          {/* Left Side: Live Coder Terminal Typing Prompt + Editorial Introduction + Direct Resume Download */}
          <div className="landing-intro">
            <div className="hero-coder-terminal-box" data-testid="hero-coder-pill">
              <div className="hero-terminal-cmd-row">
                <span className="terminal-status-dot" />
                <FiTerminal className="terminal-pill-icon" />
                <code className="hero-terminal-cmd" ref={cmdRef}>
                  ~/daksh-mehra $ {initialFrame.command}
                </code>
                <span className="hero-terminal-stack-badge" ref={badgeRef}>
                  {initialFrame.badge}
                </span>
              </div>
              <div
                className="hero-terminal-typing-line"
                data-testid="hero-terminal-typing-output"
                aria-live="polite"
              >
                <span className="terminal-output-arrow">&gt;</span>
                <code className="terminal-typed-stack" ref={typedRef}>
                  {initialFrame.displayedText}
                </code>
                <span className="terminal-cursor-blink" aria-hidden="true">
                  ▋
                </span>
              </div>
            </div>

            <h2>Hello, I'm</h2>
            <h1>
              DAKSH
              <br />
              <span>MEHRA</span>
            </h1>

            <div className="landing-hero-cta-row">
              <a
                href={RESUME_FILE.url}
                download={RESUME_FILE.filename}
                onClick={(e) => {
                  void triggerResumeDownload(e);
                }}
                className="landing-btn landing-btn-cv"
                data-cursor="disable"
                aria-label="Download Daksh Mehra Official Resume PDF"
              >
                <FiDownload className="landing-cv-icon" />
                <span>Download Resume</span>
                <span className="landing-cv-badge">PDF</span>
              </a>

              {onOpenResume && (
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="landing-btn landing-btn-outline"
                  data-cursor="disable"
                  aria-label="Preview Resume"
                >
                  <FiFileText />
                  <span>View CV</span>
                </button>
              )}
            </div>

            <div className="hero-coder-quick-links">
              <a
                href={PROFILE_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="coder-profile-chip"
                data-cursor="disable"
              >
                <FaGithub />
                <span>@daksh-mehra-12</span>
              </a>
              <a
                href={PROFILE_INFO.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="coder-profile-chip coder-chip-leetcode"
                data-cursor="disable"
              >
                <FiCode />
                <span>LeetCode Profile</span>
              </a>
            </div>
          </div>

          {/* Center Side-by-Side 3D Avatar Column (Reserves center column on desktop, hosts inline canvas on <=1024px) */}
          <div className="landing-avatar-stage-col" data-testid="landing-avatar-stage-col">
            {children}
          </div>

          {/* Right Side: Specialization Titles + Live Python Code Window */}
          <div className="landing-info">
            <h3>AI &amp; Data Science Student</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AI / ML</div>
              <div className="landing-h2-2">Python</div>
            </h2>
            <h2 className="landing-info-role">
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Engineer</div>
            </h2>

            {/* Live Syntax-Highlighted Python IDE Card */}
            <div className="hero-ide-card" data-testid="hero-ide-card">
              <div className="hero-ide-header">
                <div className="ide-window-dots">
                  <span className="ide-dot ide-dot-red" />
                  <span className="ide-dot ide-dot-yellow" />
                  <span className="ide-dot ide-dot-green" />
                </div>
                <span className="ide-filename">daksh_profile.py</span>
                <span className="ide-lang-tag">Python 3.12</span>
              </div>
              <pre className="hero-ide-code">
                <code>
                  <span className="code-line">
                    <span className="code-ln">01</span>
                    <span className="code-kw">class</span>{" "}
                    <span className="code-cls">DakshMehra</span>(
                    <span className="code-type">AIEngineer</span>):
                  </span>
                  <span className="code-line">
                    <span className="code-ln">02</span>
                    {"  "}stack = [<span className="code-str">"Python"</span>,{" "}
                    <span className="code-str">"FastAPI"</span>,{" "}
                    <span className="code-str">"ML"</span>]
                  </span>
                  <span className="code-line">
                    <span className="code-ln">03</span>
                    {"  "}cgpa = <span className="code-num">8.47</span>{" "}
                    <span className="code-cmt"># JECRC '27</span>
                  </span>
                  <span className="code-line">
                    <span className="code-ln">04</span>
                    {"  "}
                    <span className="code-kw">def</span>{" "}
                    <span className="code-fn">build</span>(self):
                  </span>
                  <span className="code-line">
                    <span className="code-ln">05</span>
                    {"    "}
                    <span className="code-kw">return</span>{" "}
                    <span className="code-str">"Production Ready"</span>
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;



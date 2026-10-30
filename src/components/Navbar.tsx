import { useEffect, useRef, useState } from "react";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";
import {
  PROFILE_INFO,
  RESUME_FILE,
  triggerResumeDownload,
  calculateScrollProgress,
} from "../data/portfolioData";
import { FiFileText, FiDownload, FiMenu, FiX, FiMail, FiArrowUpRight } from "react-icons/fi";

export const smoother = {
  paused: (_state?: boolean) => {},
  scrollTo: (target: string) => {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  },
  scrollTop: (_val?: number) => {},
};

interface NavbarProps {
  onOpenResume?: () => void;
}

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "EXPERIENCE", href: "#career", id: "career" },
  { label: "PROJECTS", href: "#work", id: "work" },
  { label: "SKILLS", href: "#tech", id: "tech" },
  { label: "EDUCATION", href: "#education", id: "education" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

const Navbar = ({ onOpenResume }: NavbarProps) => {
  const [activeSection, setActiveSection] = useState<string>("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<boolean>(false);
  const activeSectionRef = useRef<string>("landing");

  useEffect(() => {
    let rafId = 0;
    const updateOnScroll = () => {
      rafId = 0;
      const scrollTop = Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0
      );
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight || 0;

      const isNowScrolled = scrollTop > 40;
      if (isNowScrolled !== scrolledRef.current) {
        scrolledRef.current = isNowScrolled;
        setScrolled(isNowScrolled);
      }

      const progress = calculateScrollProgress(
        scrollTop,
        scrollHeight,
        clientHeight
      );
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${progress}%`;
      }
      if (progressTrackRef.current) {
        const roundedProgress = String(Math.round(progress));
        progressTrackRef.current.setAttribute("aria-valuenow", roundedProgress);
        progressTrackRef.current.setAttribute(
          "data-scroll-progress",
          roundedProgress
        );
      }

      const sections = ["about", "what-i-do", "career", "work", "tech", "education", "contact"];
      const scrollPos = scrollTop + 250;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (activeSectionRef.current !== s) {
              activeSectionRef.current = s;
              setActiveSection(s);
            }
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      updateOnScroll();
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateOnScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    document.body.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateOnScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      document.body.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Subtle Top-of-Viewport Horizontal Scroll Progress Bar */}
      <div
        ref={progressTrackRef}
        className="viewport-scroll-progress-track"
        role="progressbar"
        aria-label="Portfolio scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        data-testid="scroll-progress-bar"
      >
        <div
          ref={progressFillRef}
          className="viewport-scroll-progress-fill"
          style={{ width: "0%" }}
        />
      </div>

      <header className={`header ${scrolled ? "header-scrolled" : ""}`} role="banner">
        <a
          href="#landingDiv"
          className="navbar-title"
          data-cursor="disable"
          aria-label="Daksh Mehra Home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#landingDiv");
          }}
        >
          <span className="navbar-monogram">DM</span>
          <span className="navbar-name">{PROFILE_INFO.name}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" role="navigation" aria-label="Main Navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? "nav-active" : ""}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  data-cursor="disable"
                >
                  <HoverLinks text={item.label} />
                </a>
              </li>
            ))}
            <li className="nav-cta-group">
              <a
                href={RESUME_FILE.url}
                download={RESUME_FILE.filename}
                onClick={(e) => {
                  void triggerResumeDownload(e);
                }}
                className="nav-download-cv-btn"
                data-cursor="disable"
                aria-label="Download CV"
              >
                <FiDownload className="nav-cv-icon" />
                <span>Download CV</span>
              </a>
              {onOpenResume && (
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="nav-resume-preview-btn"
                  data-cursor="disable"
                  aria-label="Preview Resume Modal"
                  title="Preview Interactive Resume"
                >
                  <FiFileText />
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="mobile-nav-toggle-wrap">
          <a
            href={RESUME_FILE.url}
            download={RESUME_FILE.filename}
            onClick={(e) => {
              void triggerResumeDownload(e);
            }}
            className="nav-download-cv-btn mobile-cv-pill"
            data-cursor="disable"
            aria-label="Download CV"
          >
            <FiDownload className="nav-cv-icon" />
            <span>Download CV</span>
          </a>
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            data-cursor="disable"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-menu-drawer ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-brand">
            <span className="navbar-monogram">DM</span>
            <div className="mobile-menu-brand-text">
              <h4>{PROFILE_INFO.name}</h4>
              <p>AI &amp; Data Science Student</p>
            </div>
          </div>

          <nav className="mobile-nav-links" role="navigation" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`mobile-nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                <span>{item.label}</span>
                <FiArrowUpRight className="mobile-nav-arrow" />
              </a>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <a
              href={RESUME_FILE.url}
              download={RESUME_FILE.filename}
              className="mobile-menu-resume-btn"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                void triggerResumeDownload(e);
              }}
            >
              <FiDownload />
              <span>Download CV (PDF)</span>
            </a>

            {onOpenResume && (
              <button
                type="button"
                className="mobile-menu-preview-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenResume();
                }}
              >
                <FiFileText />
                <span>Preview Interactive CV</span>
              </button>
            )}

            <a
              href={`mailto:${PROFILE_INFO.email}`}
              className="mobile-menu-email-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiMail />
              <span>{PROFILE_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

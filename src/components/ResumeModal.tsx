import React from "react";
import {
  PROFILE_INFO,
  RESUME_FILE,
  EXPERIENCES,
  EDUCATION,
  PROJECTS,
  TECH_CATEGORIES,
  ACHIEVEMENTS,
  CERTIFICATIONS,
  triggerResumeDownload,
} from "../data/portfolioData";
import {
  FiDownload,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiCode,
} from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import "./styles/ResumeModal.css";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="resume-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="resume-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="resume-modal-topbar">
          <div className="resume-topbar-title">
            <span>Official Curriculum Vitae</span>
            <h3>{PROFILE_INFO.name}</h3>
          </div>

          <div className="resume-topbar-actions">
            <div className="resume-view-tabs" aria-label="Resume view mode">
              <span className="resume-btn resume-tab-toggle active">
                <FiCode />
                <span>Interactive View</span>
              </span>
            </div>

            <a
              href={RESUME_FILE.url}
              download={RESUME_FILE.filename}
              onClick={(e) => {
                void triggerResumeDownload(e);
              }}
              className="resume-btn resume-btn-action resume-btn-primary-dl"
              title="Download Official Resume PDF"
            >
              <FiDownload />
              <span>Download CV (PDF)</span>
            </a>

            <button
              type="button"
              className="resume-btn-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Resume Document Paper View */}
        <div className="resume-paper" id="resume-printable-area">
            <header className="resume-paper-header">
              <h1>{PROFILE_INFO.name}</h1>
              <p className="resume-paper-headline">{PROFILE_INFO.headline}</p>

              <div className="resume-paper-contact">
                <span><FiMail /> {PROFILE_INFO.email}</span>
                <span><FiPhone /> {PROFILE_INFO.phone}</span>
                <span><FiMapPin /> {PROFILE_INFO.location}</span>
                <a href={PROFILE_INFO.socials.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin /> LinkedIn
                </a>
                <a href={PROFILE_INFO.socials.github} target="_blank" rel="noreferrer">
                  <FaGithub /> GitHub
                </a>
                {PROFILE_INFO.socials.leetcode && (
                  <a href={PROFILE_INFO.socials.leetcode} target="_blank" rel="noreferrer">
                    <FiCode /> LeetCode
                  </a>
                )}
              </div>
            </header>

            {/* Education */}
            <section className="resume-paper-section">
              <h2>EDUCATION</h2>
              <div className="resume-paper-divider"></div>
              {EDUCATION.map((edu, i) => (
                <div className="resume-item" key={i}>
                  <div className="resume-item-row">
                    <strong>{edu.degree}</strong>
                    <span className="resume-item-badge">{edu.score}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span>{edu.institution}</span>
                    <span>{edu.period}</span>
                  </div>
                  {edu.details && <p className="resume-item-details">{edu.details}</p>}
                </div>
              ))}
            </section>

            {/* Experience */}
            <section className="resume-paper-section">
              <h2>EXPERIENCE</h2>
              <div className="resume-paper-divider"></div>
              {EXPERIENCES.map((exp, i) => (
                <div className="resume-item" key={i}>
                  <div className="resume-item-row">
                    <strong>{exp.role}</strong>
                    <span>{exp.period}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="resume-bullet-list">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Key Projects */}
            <section className="resume-paper-section">
              <h2>PROJECTS</h2>
              <div className="resume-paper-divider"></div>
              {PROJECTS.filter((p) => p.type === "primary").map((proj, i) => (
                <div className="resume-item" key={i}>
                  <div className="resume-item-row">
                    <strong>{proj.title}</strong>
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="resume-gh-link">
                      Repository <FiExternalLink />
                    </a>
                  </div>
                  <div className="resume-item-sub">
                    <span>{proj.subtitle}</span>
                    <span className="resume-tech-sub">{proj.technologies.slice(0, 5).join(", ")}</span>
                  </div>
                  <p className="resume-item-desc">{proj.description}</p>
                </div>
              ))}
            </section>

            {/* Technical Skills */}
            <section className="resume-paper-section">
              <h2>TECHNICAL SKILLS</h2>
              <div className="resume-paper-divider"></div>
              <div className="resume-skills-grid">
                {TECH_CATEGORIES.map((cat, i) => (
                  <div key={i} className="resume-skill-line">
                    <strong>{cat.name}:</strong> <span>{cat.skills.join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements & Certifications */}
            <section className="resume-paper-section">
              <h2>ACHIEVEMENTS &amp; CERTIFICATIONS</h2>
              <div className="resume-paper-divider"></div>
              <div className="resume-achievements-list">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="resume-ach-item">
                    <strong>{a.title}</strong> — {a.organization} ({a.description})
                  </div>
                ))}
                {CERTIFICATIONS.map((c, i) => (
                  <div key={i} className="resume-ach-item">
                    <strong>{c.title}</strong> — {c.issuer}
                  </div>
                ))}
              </div>
            </section>
          </div>
      </div>
    </div>
  );
};

export default ResumeModal;

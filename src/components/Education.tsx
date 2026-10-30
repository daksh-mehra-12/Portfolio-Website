import "./styles/Education.css";
import { EDUCATION, ACHIEVEMENTS, CERTIFICATIONS } from "../data/portfolioData";
import { FiAward, FiBook, FiCheckCircle } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa6";

const Education = () => {
  return (
    <div className="education-section section-container" id="education">
      <div className="education-container">
        {/* Education Header */}
        <div className="education-header">
          <h2>
            Education <span>&amp; Credentials</span>
          </h2>
          <p className="education-subtitle">
            Formal education in Artificial Intelligence &amp; Data Science, along with hackathon achievements and industry certifications.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="education-block">
          <div className="block-title-row">
            <FaGraduationCap className="block-icon" />
            <h3>Academic Background</h3>
          </div>

          <div className="edu-cards-grid">
            {EDUCATION.map((edu, idx) => (
              <div className="edu-card" key={idx} data-cursor="disable">
                <div className="edu-card-top">
                  <span className="edu-period">{edu.period}</span>
                  <span className="edu-score-badge">{edu.score}</span>
                </div>
                <h4>{edu.degree}</h4>
                <h5>{edu.institution}</h5>
                {edu.details && <p className="edu-details">{edu.details}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements and Certifications Two-Column Layout */}
        <div className="credentials-row">
          {/* Achievements */}
          <div className="credential-column">
            <div className="block-title-row">
              <FiAward className="block-icon" />
              <h3>Recognitions &amp; Hackathons</h3>
            </div>
            <div className="credential-list">
              {ACHIEVEMENTS.map((ach, idx) => (
                <div className="achievement-card" key={idx} data-cursor="disable">
                  <div className="ach-badge">Honors</div>
                  <h4>{ach.title}</h4>
                  <div className="ach-org">{ach.organization}</div>
                  <p>{ach.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="credential-column">
            <div className="block-title-row">
              <FiBook className="block-icon" />
              <h3>Certifications</h3>
            </div>
            <div className="credential-list">
              {CERTIFICATIONS.map((cert, idx) => (
                <div className="cert-card" key={idx} data-cursor="disable">
                  <div className="cert-card-left">
                    <FiCheckCircle className="cert-check" />
                    <div>
                      <h4>{cert.title}</h4>
                      <span className="cert-issuer">{cert.issuer}</span>
                    </div>
                  </div>
                  <span className="cert-verified">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;

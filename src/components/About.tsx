import "./styles/About.css";
import { PROFILE_INFO } from "../data/portfolioData";
import { FiAward, FiBookOpen, FiCode, FiMapPin } from "react-icons/fi";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">{PROFILE_INFO.aboutPara}</p>

        <div className="about-highlights-grid">
          <div className="about-highlight-card" data-cursor="disable">
            <div className="about-card-icon">
              <FiBookOpen />
            </div>
            <div>
              <h4>B.Tech AI &amp; Data Science</h4>
              <p>JECRC Foundation, Jaipur (2023–2027)</p>
            </div>
          </div>

          <div className="about-highlight-card" data-cursor="disable">
            <div className="about-card-icon">
              <FiAward />
            </div>
            <div>
              <h4>Academic Standing</h4>
              <p>
                Current CGPA: <strong>8.47 / 10</strong>
              </p>
            </div>
          </div>

          <div className="about-highlight-card" data-cursor="disable">
            <div className="about-card-icon">
              <FiCode />
            </div>
            <div>
              <h4>Full-Stack &amp; ML Engineering</h4>
              <p>FastAPI, Flask, React, Scikit-learn, SQLAlchemy</p>
            </div>
          </div>

          <div className="about-highlight-card" data-cursor="disable">
            <div className="about-card-icon">
              <FiMapPin />
            </div>
            <div>
              <h4>Location</h4>
              <p>{PROFILE_INFO.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


import "./styles/SkillsMarquee.css";
import { getMarqueeSkillsTrack, MARQUEE_SKILLS } from "../data/portfolioData";
import { FiCode, FiCpu, FiDatabase, FiLayers, FiServer, FiTerminal } from "react-icons/fi";

const SKILL_ICON_MAP: Record<string, React.ReactNode> = {
  Python: <FiTerminal />,
  TensorFlow: <FiCpu />,
  PyTorch: <FiCpu />,
  SQL: <FiDatabase />,
  "Scikit-learn": <FiCpu />,
  FastAPI: <FiServer />,
  Flask: <FiServer />,
  React: <FiLayers />,
  TypeScript: <FiCode />,
};

const SkillsMarquee = () => {
  const trackItems = getMarqueeSkillsTrack(MARQUEE_SKILLS, 2);

  return (
    <div
      className="skills-marquee-shell"
      data-testid="skills-marquee"
      aria-label="Continuous technical skills marquee"
    >
      <div className="skills-marquee-header">
        <span className="skills-marquee-dot" aria-hidden="true" />
        <span>Core AI, Machine Learning &amp; Full-Stack Technologies</span>
      </div>

      <div className="skills-marquee-viewport">
        <div
          className="skills-marquee-track"
          data-testid="skills-marquee-track"
        >
          {trackItems.map((item) => (
            <div
              key={item.id}
              className={`skills-marquee-pill accent-${item.accent}`}
              data-skill-name={item.name}
            >
              <span className="skills-marquee-icon" aria-hidden="true">
                {SKILL_ICON_MAP[item.name] || <FiCode />}
              </span>
              <div className="skills-marquee-text">
                <span className="skills-marquee-name">{item.name}</span>
                <span className="skills-marquee-cat">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsMarquee;

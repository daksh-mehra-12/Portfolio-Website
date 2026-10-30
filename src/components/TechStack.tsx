import { useState } from "react";
import "./styles/TechStack.css";
import { TECH_CATEGORIES } from "../data/portfolioData";
import {
  FiCpu,
  FiServer,
  FiLayout,
  FiDatabase,
  FiTool,
  FiTerminal,
  FiCheckCircle,
  FiActivity,
} from "react-icons/fi";
import SkillsMarquee from "./SkillsMarquee";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Programming: <FiTerminal />,
  Backend: <FiServer />,
  Frontend: <FiLayout />,
  "AI & Data": <FiCpu />,
  Tools: <FiTool />,
  "Core Computer Science": <FiDatabase />,
};

const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredCategories =
    activeCategory === "All"
      ? TECH_CATEGORIES
      : TECH_CATEGORIES.filter((c) => c.name === activeCategory);

  return (
    <div className="techstack-section section-container" id="tech">
      <div className="techstack-container">
        <div className="techstack-header">
          <span className="techstack-live-badge">
            <FiActivity className="techstack-live-icon" />
            Interactive Neural Skill Matrix
          </span>
          <h2>
            Technology <span>Stack</span>
          </h2>
          <p className="techstack-subtitle">
            Core competencies across programming, machine learning, backend
            frameworks, and computer science fundamentals.
          </p>

          <div className="techstack-tabs">
            <button
              type="button"
              className={`tech-tab ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => setActiveCategory("All")}
              data-cursor="disable"
            >
              All Skills
            </button>
            {TECH_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.name}
                className={`tech-tab ${
                  activeCategory === cat.name ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat.name)}
                data-cursor="disable"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Horizontal Auto-Scrolling Skills Marquee */}
        <SkillsMarquee />

        <div className="techstack-content-wrapper">
          <div className="techstack-grid">
            {filteredCategories.map((category) => (
              <div
                className="tech-category-card"
                key={category.name}
                data-cursor="disable"
              >
                <div className="tech-cat-header">
                  <div className="tech-cat-icon">
                    {CATEGORY_ICONS[category.name] || <FiCpu />}
                  </div>
                  <div>
                    <h4>{category.name}</h4>
                    <span className="tech-count">
                      {category.skills.length} competencies
                    </span>
                  </div>
                </div>

                <div className="tech-chips-container">
                  {category.skills.map((skill) => (
                    <div className="tech-chip" key={skill}>
                      <FiCheckCircle className="chip-check" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;

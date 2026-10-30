import { useState } from "react";
import "./styles/Career.css";
import {
  getTimelineMilestones,
  TimelineFilterCategory,
} from "../data/portfolioData";
import { FaGithub, FaGraduationCap } from "react-icons/fa6";
import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
} from "react-icons/fi";

const Career = () => {
  const [activeFilter, setActiveFilter] =
    useState<TimelineFilterCategory>("all");

  const allMilestones = getTimelineMilestones("all");
  const internshipCount = getTimelineMilestones("internship").length;
  const educationCount = getTimelineMilestones("education").length;
  const milestones = getTimelineMilestones(activeFilter);

  return (
    <section
      className="career-section section-container"
      id="career"
      data-testid="vertical-timeline-section"
      aria-label="Internship Experience and Educational Background Timeline"
    >
      <div className="career-container">
        <div className="career-header-block">
          <span className="career-kicker">
            <FiBriefcase /> Career &amp; Academic Journey
          </span>
          <h2>
            Experience <span>&amp; Education</span> Timeline
          </h2>
          <p className="career-subtitle">
            A chronological vertical timeline of my AI/Python internship
            experience and formal academic background in Artificial Intelligence
            &amp; Data Science.
          </p>

          {/* Timeline Filter Tabs */}
          <div
            className="career-filter-tabs"
            role="tablist"
            aria-label="Filter timeline milestones"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "all"}
              className={`career-tab-btn ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("all")}
              data-testid="timeline-tab-all"
              data-cursor="disable"
            >
              All Milestones ({allMilestones.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "internship"}
              className={`career-tab-btn ${
                activeFilter === "internship" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("internship")}
              data-testid="timeline-tab-internship"
              data-cursor="disable"
            >
              Internship Experience ({internshipCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "education"}
              className={`career-tab-btn ${
                activeFilter === "education" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("education")}
              data-testid="timeline-tab-education"
              data-cursor="disable"
            >
              Educational Background ({educationCount})
            </button>
          </div>
        </div>

        {/* Vertical Timeline Track & Milestone Nodes */}
        <div
          className="career-info career-vertical-timeline"
          data-testid="vertical-timeline"
        >
          <div className="career-timeline" aria-hidden="true">
            <div className="career-timeline-line career-dot" />
          </div>

          {milestones.map((item) => {
            const isInternship = item.category === "internship";
            return (
              <article
                className={`career-timeline-item career-item-${item.category}`}
                key={item.id}
                data-testid={`timeline-item-${item.id}`}
              >
                {/* Vertical Timeline Node Marker */}
                <div
                  className={`career-timeline-node ${
                    isInternship ? "node-internship" : "node-education"
                  }`}
                  aria-hidden="true"
                >
                  {isInternship ? <FiBriefcase /> : <FaGraduationCap />}
                </div>

                {/* Milestone Card */}
                <div className="career-info-box">
                  <div className="career-info-in">
                    <div className="career-role">
                      <span
                        className={`career-type-badge ${
                          isInternship ? "badge-internship" : "badge-education"
                        }`}
                      >
                        {isInternship ? (
                          <FiBriefcase />
                        ) : (
                          <FaGraduationCap />
                        )}
                        {item.badgeLabel}
                      </span>
                      <h4>{item.title}</h4>
                      <h5>{item.organization}</h5>
                      <div className="career-meta">
                        <span>
                          <FiCalendar /> {item.period}
                        </span>
                        {item.location && (
                          <span>
                            <FiMapPin /> {item.location}
                          </span>
                        )}
                        {item.score && (
                          <span className="career-score-pill">
                            <FiAward /> {item.score}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="career-period-badge">
                      <h3>{item.period}</h3>
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="career-gh-link"
                          data-cursor="disable"
                          aria-label={`View ${item.organization} codebase on GitHub`}
                        >
                          <FaGithub /> <span>Codebase</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {item.highlights.length > 0 && (
                    <div className="career-responsibilities">
                      {item.highlights.map((resp, rIdx) => (
                        <div className="career-resp-item" key={rIdx}>
                          <FiCheckCircle className="career-resp-bullet" />
                          <p>{resp}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="career-tech-pills">
                      {item.technologies.map((tech, tIdx) => (
                        <span className="career-tech-tag" key={tIdx}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Career;

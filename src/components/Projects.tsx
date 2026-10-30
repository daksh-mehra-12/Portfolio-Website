import { useEffect, useRef, useState } from "react";
import "./styles/Projects.css";
import {
  PROJECTS,
  FEATURED_TECH_TAGS,
  filterProjects,
  getTopAiMlProjects,
  calculateCarouselScrollState,
  computeCarouselWheelScroll,
  Project,
  ProjectFilterCategory,
} from "../data/portfolioData";
import { FaGithub } from "react-icons/fa6";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiCpu,
  FiGrid,
  FiLayers,
  FiSliders,
  FiX,
} from "react-icons/fi";
import { ProjectVisual } from "./ProjectVisual";

const Projects = () => {
  const [categoryFilter, setCategoryFilter] =
    useState<ProjectFilterCategory>("all");
  const [techFilter, setTechFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(20);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef<number>(0);
  const dragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    scrollLeft: number;
    hasMoved: boolean;
  }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const topAiMlCount = getTopAiMlProjects(PROJECTS).length;
  const displayedProjects = filterProjects(
    PROJECTS,
    categoryFilter,
    techFilter
  );

  // Reset active slide when filters change
  useEffect(() => {
    activeIndexRef.current = 0;
    setActiveIndex(0);
    const initPercent =
      displayedProjects.length > 0 ? 100 / displayedProjects.length : 100;
    setProgressPercent(initPercent);
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${initPercent}%`;
    }
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [categoryFilter, techFilter, displayedProjects.length]);

  const syncCarouselStateFromTrack = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const { progressPercent: nextPercent, activeIndex: nextIdx } =
      calculateCarouselScrollState(
        track.scrollLeft,
        maxScrollLeft,
        displayedProjects.length
      );

    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${nextPercent}%`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.setAttribute(
        "aria-valuenow",
        String(Math.round(nextPercent))
      );
    }

    if (nextIdx !== activeIndexRef.current) {
      activeIndexRef.current = nextIdx;
      setProgressPercent(nextPercent);
      setActiveIndex(nextIdx);
    }
  };

  // Translate mouse wheel scroll (vertical or horizontal) into left/right carousel scroll
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || viewMode !== "carousel") return;

    const handleWheel = (e: WheelEvent) => {
      const track = trackRef.current;
      if (!track || e.ctrlKey) return;

      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const { shouldIntercept, nextScrollLeft } = computeCarouselWheelScroll(
        track.scrollLeft,
        maxScrollLeft,
        e.deltaX,
        e.deltaY,
        e.deltaMode
      );

      if (shouldIntercept) {
        e.preventDefault();
        track.scrollLeft = nextScrollLeft;
        syncCarouselStateFromTrack();
      }
    };

    shell.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      shell.removeEventListener("wheel", handleWheel);
    };
  }, [viewMode, displayedProjects.length]);

  const scrollToSlide = (index: number) => {
    if (displayedProjects.length === 0) return;
    const bounded = Math.max(0, Math.min(index, displayedProjects.length - 1));
    activeIndexRef.current = bounded;
    setActiveIndex(bounded);

    const nextPercent =
      displayedProjects.length > 0
        ? ((bounded + 1) / displayedProjects.length) * 100
        : 100;
    setProgressPercent(nextPercent);
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${nextPercent}%`;
    }

    const track = trackRef.current;
    if (!track) return;
    const slideNodes = track.querySelectorAll<HTMLElement>(
      ".project-carousel-slide"
    );
    const targetSlide = slideNodes[bounded];
    if (targetSlide) {
      const targetLeft = Math.max(
        0,
        targetSlide.offsetLeft - track.offsetLeft - 4
      );
      track.scrollTo({ left: targetLeft, behavior: "smooth" });
    } else {
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const ratio =
        displayedProjects.length > 1
          ? bounded / (displayedProjects.length - 1)
          : 0;
      track.scrollTo({ left: ratio * maxScrollLeft, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (displayedProjects.length === 0) return;
    const nextIdx =
      activeIndex > 0 ? activeIndex - 1 : displayedProjects.length - 1;
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    if (displayedProjects.length === 0) return;
    const nextIdx =
      activeIndex < displayedProjects.length - 1 ? activeIndex + 1 : 0;
    scrollToSlide(nextIdx);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;
    const track = trackRef.current;
    if (!track) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const track = trackRef.current;
    if (!track) return;
    const walk = (e.clientX - dragStateRef.current.startX) * 1.25;
    if (Math.abs(walk) > 4) {
      dragStateRef.current.hasMoved = true;
      e.preventDefault();
      track.scrollLeft = dragStateRef.current.scrollLeft - walk;
      syncCarouselStateFromTrack();
    }
  };

  const endMouseDrag = () => {
    if (!dragStateRef.current.isDown) return;
    dragStateRef.current.isDown = false;
    setIsDragging(false);
  };

  const scrubProgressBar = (clientX: number) => {
    const bar = progressBarRef.current;
    const track = trackRef.current;
    if (!bar || !track) return;
    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    track.scrollLeft = ratio * maxScrollLeft;
    syncCarouselStateFromTrack();
  };

  const handleTechClick = (tech: string) => {
    setTechFilter((prev) => (prev === tech ? "All" : tech));
  };

  const resetFilters = () => {
    setCategoryFilter("all");
    setTechFilter("All");
  };

  return (
    <section
      className="projects-section section-container"
      id="work"
      data-testid="projects-section"
      data-view-mode={viewMode}
      aria-label="AI and Machine Learning Project Showcase Carousel"
    >
      <div className="projects-container">
        {/* Header & Category Filter Controls */}
        <div className="projects-header-row">
          <div className="projects-heading-block">
            <span className="projects-kicker">
              <FiCpu className="projects-kicker-icon" />
              AI, Machine Learning &amp; Python Showcase
            </span>
            <h2>
              AI/ML Project <span>Showcase</span>
            </h2>
            <p className="projects-header-subtitle">
              Interactive project carousel featuring complete architecture
              descriptions, technology stacks, and source code repositories.
            </p>
          </div>

          <div className="projects-controls-cluster">
            <div
              className="projects-filter-tabs"
              role="tablist"
              aria-label="Project showcase categories"
            >
              <button
                type="button"
                role="tab"
                aria-selected={categoryFilter === "all"}
                className={`projects-tab-btn ${
                  categoryFilter === "all" ? "active" : ""
                }`}
                onClick={() => setCategoryFilter("all")}
                data-cursor="disable"
              >
                All Showcase ({PROJECTS.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryFilter === "ai-python"}
                className={`projects-tab-btn ${
                  categoryFilter === "ai-python" ? "active" : ""
                }`}
                onClick={() => setCategoryFilter("ai-python")}
                data-cursor="disable"
              >
                Top AI/ML ({topAiMlCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryFilter === "secondary"}
                className={`projects-tab-btn ${
                  categoryFilter === "secondary" ? "active" : ""
                }`}
                onClick={() => setCategoryFilter("secondary")}
                data-cursor="disable"
              >
                CS &amp; DSA (
                {filterProjects(PROJECTS, "secondary", "All").length})
              </button>
            </div>

            {/* View Mode Switcher: Carousel Mode (default) vs Grid View */}
            <div
              className="projects-view-toggle"
              role="group"
              aria-label="Project display mode"
            >
              <button
                type="button"
                className={`projects-mode-btn ${
                  viewMode === "carousel" ? "active" : ""
                }`}
                onClick={() => setViewMode("carousel")}
                data-testid="view-mode-carousel"
                data-cursor="disable"
              >
                <FiSliders />
                <span>Carousel</span>
              </button>
              <button
                type="button"
                className={`projects-mode-btn ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={() => setViewMode("grid")}
                data-testid="view-mode-grid"
                data-cursor="disable"
              >
                <FiGrid />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technology Filter Bar */}
        <div
          className="projects-tech-filter-bar"
          aria-label="Filter projects by technology"
        >
          <span className="projects-tech-filter-label">
            <FiCode /> Filter by Tech Stack:
          </span>
          <div className="projects-tech-filter-pills">
            {FEATURED_TECH_TAGS.map((tag) => {
              const isActive =
                tag === "All"
                  ? techFilter === "All"
                  : techFilter.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTechFilter(tag)}
                  className={`projects-tech-filter-btn ${
                    isActive ? "active" : ""
                  }`}
                  data-cursor="disable"
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {(categoryFilter !== "all" || techFilter !== "All") && (
            <button
              type="button"
              className="projects-filter-reset-btn"
              onClick={resetFilters}
              data-cursor="disable"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Projects Showcase Content: Carousel Mode or Grid Mode */}
        {displayedProjects.length === 0 ? (
          <div className="projects-empty-state">
            <p>
              No projects match the selected category and technology filter.
            </p>
            <button
              type="button"
              className="projects-tab-btn active"
              onClick={resetFilters}
              data-cursor="disable"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div
            ref={shellRef}
            className="projects-carousel-shell"
            data-testid="projects-carousel-shell"
          >
            {viewMode === "carousel" && (
              <div className="projects-carousel-toolbar">
                <div
                  className="projects-carousel-quicknav"
                  role="tablist"
                  aria-label="Jump to project slide"
                >
                  {displayedProjects.map((proj, idx) => (
                    <button
                      key={proj.id}
                      type="button"
                      role="tab"
                      aria-selected={activeIndex === idx}
                      className={`projects-slide-pill ${
                        activeIndex === idx ? "active" : ""
                      }`}
                      onClick={() => scrollToSlide(idx)}
                      data-testid={`carousel-pill-${proj.id}`}
                      data-cursor="disable"
                    >
                      <span className="projects-slide-pill-num">
                        0{idx + 1}
                      </span>
                      <span className="projects-slide-pill-name">
                        {proj.title}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="projects-carousel-nav-group">
                  <span
                    className="projects-wheel-hint"
                    data-testid="carousel-wheel-hint"
                  >
                    Wheel ↔ Scroll
                  </span>
                  <span
                    className="projects-carousel-counter"
                    data-testid="carousel-counter"
                  >
                    <strong>0{activeIndex + 1}</strong> / 0
                    {displayedProjects.length}
                  </span>
                  <button
                    type="button"
                    className="projects-carousel-arrow"
                    onClick={handlePrev}
                    aria-label="Previous project slide"
                    data-testid="carousel-prev-btn"
                    data-cursor="disable"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="projects-carousel-arrow"
                    onClick={handleNext}
                    aria-label="Next project slide"
                    data-testid="carousel-next-btn"
                    data-cursor="disable"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}

            <div
              ref={trackRef}
              className={
                viewMode === "carousel"
                  ? `projects-carousel-viewport ${
                      isDragging ? "is-dragging" : ""
                    }`
                  : "projects-grid"
              }
              onScroll={
                viewMode === "carousel"
                  ? syncCarouselStateFromTrack
                  : undefined
              }
              onMouseDown={viewMode === "carousel" ? handleMouseDown : undefined}
              onMouseMove={viewMode === "carousel" ? handleMouseMove : undefined}
              onMouseUp={viewMode === "carousel" ? endMouseDrag : undefined}
              onMouseLeave={viewMode === "carousel" ? endMouseDrag : undefined}
              data-testid="projects-grid"
              tabIndex={0}
              aria-label="Projects showcase track"
              onKeyDown={(e) => {
                if (viewMode !== "carousel") return;
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  handlePrev();
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  handleNext();
                }
              }}
            >
              {displayedProjects.map((project, index) => {
                const isPrimary = project.type === "primary";
                const isActiveSlide = index === activeIndex;
                return (
                  <article
                    key={project.id}
                    className={`project-card ${
                      viewMode === "carousel" ? "project-carousel-slide" : ""
                    } ${
                      isPrimary
                        ? "project-card-primary"
                        : "project-card-secondary"
                    } ${
                      viewMode === "carousel" && isActiveSlide
                        ? "project-slide-active"
                        : ""
                    }`}
                    data-project-id={project.id}
                    data-testid={`project-card-${project.id}`}
                    onClick={() => {
                      if (dragStateRef.current.hasMoved) return;
                      setActiveIndex(index);
                    }}
                  >
                    {/* Visual Diagram Header */}
                    <ProjectVisual
                      projectId={project.id}
                      title={project.title}
                      inView={true}
                      imageUrl={project.image}
                    />

                    <div className="project-card-body">
                      {/* Clean Metadata Row */}
                      <div className="project-card-meta">
                        <span className="project-badge-num">0{index + 1}</span>
                        <span
                          className="project-meta-divider"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        <span className="project-category-text">
                          {project.category}
                        </span>
                        <span
                          className="project-meta-divider"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        <span className="project-tier-label">
                          {isPrimary ? "Top AI/ML" : "Core CS"}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="project-card-title-group">
                        <h3>{project.title}</h3>
                        <p className="project-subtitle-text">
                          {project.subtitle}
                        </p>
                      </div>

                      {/* Disclaimer if present */}
                      {project.disclaimer && (
                        <div className="project-disclaimer-banner">
                          <FiAlertCircle className="project-disclaimer-icon" />
                          <span>{project.disclaimer}</span>
                        </div>
                      )}

                      {/* Description */}
                      <p
                        className="project-desc-para"
                        data-testid={`project-desc-${project.id}`}
                      >
                        {project.description}
                      </p>

                      {/* Key Capabilities */}
                      <div className="project-features-list">
                        <h4>Key Capabilities</h4>
                        <ul>
                          {project.features
                            .slice(0, isPrimary ? 4 : 3)
                            .map((feat, fIdx) => (
                              <li key={fIdx}>
                                <FiCheck className="project-feat-check" />
                                <span>{feat}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Technology Stack Used */}
                      <div
                        className="project-tech-section"
                        data-testid={`project-tech-stack-${project.id}`}
                      >
                        <h4>
                          Technology Stack Used ({project.technologies.length})
                        </h4>
                        <div className="project-tags-wrap">
                          {project.technologies.map((tech, tIdx) => {
                            const isHighlighted =
                              techFilter !== "All" &&
                              tech
                                .toLowerCase()
                                .includes(techFilter.toLowerCase());
                            return (
                              <button
                                type="button"
                                className={`project-tech-tag ${
                                  isHighlighted ? "highlighted" : ""
                                }`}
                                key={tIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTechClick(tech);
                                }}
                                title={`Filter projects using ${tech}`}
                                data-cursor="disable"
                              >
                                {tech}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer GitHub Link & Architecture Modal */}
                      <div className="project-card-footer">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-action-btn project-action-gh"
                          data-testid={`project-github-link-${project.id}`}
                          data-cursor="disable"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`View ${project.title} source code on GitHub`}
                        >
                          <FaGithub />
                          <span>GitHub Code</span>
                          <FiArrowUpRight />
                        </a>
                        <button
                          type="button"
                          className="project-action-btn project-action-details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          data-cursor="disable"
                        >
                          <FiLayers />
                          <span>Architecture &amp; Specs</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Carousel Scrubber & Slide Dots */}
            {viewMode === "carousel" && (
              <div className="projects-carousel-footer">
                <div
                  className="projects-carousel-progress-bar"
                  ref={progressBarRef}
                  role="slider"
                  aria-label="Scrub through project carousel"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progressPercent)}
                  tabIndex={0}
                  data-testid="carousel-progress-bar"
                  data-cursor="disable"
                  onClick={(e) => scrubProgressBar(e.clientX)}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      scrubProgressBar(e.clientX);
                    }
                  }}
                >
                  <div
                    className="projects-carousel-progress-fill"
                    ref={progressFillRef}
                    data-testid="carousel-progress-fill"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>

                <div className="projects-carousel-dots">
                  {displayedProjects.map((proj, idx) => (
                    <button
                      key={proj.id}
                      type="button"
                      className={`projects-carousel-dot ${
                        idx === activeIndex ? "active" : ""
                      }`}
                      onClick={() => scrollToSlide(idx)}
                      aria-label={`Go to project ${idx + 1}: ${proj.title}`}
                      data-cursor="disable"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Architecture & Details Modal */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="project-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-modal-header">
              <div>
                <span className="project-modal-category">
                  {selectedProject.category}
                </span>
                <h3 id="project-modal-title">{selectedProject.title}</h3>
                <p className="project-modal-subtitle">
                  {selectedProject.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="project-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                data-cursor="disable"
              >
                <FiX />
              </button>
            </div>

            <div className="project-modal-body">
              <ProjectVisual
                projectId={selectedProject.id}
                title={selectedProject.title}
              />

              {selectedProject.disclaimer && (
                <div className="project-disclaimer-banner">
                  <FiAlertCircle className="project-disclaimer-icon" />
                  <span>{selectedProject.disclaimer}</span>
                </div>
              )}

              <div className="project-modal-section">
                <h4>Project Overview</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="project-modal-section">
                <h4>
                  Complete Feature Breakdown ({selectedProject.features.length})
                </h4>
                <ul className="project-modal-features-grid">
                  {selectedProject.features.map((feature, idx) => (
                    <li key={idx}>
                      <FiCheck className="project-feat-check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-modal-section">
                <h4>Technology Stack &amp; Libraries</h4>
                <div className="project-tags-wrap">
                  {selectedProject.technologies.map((tech, idx) => (
                    <span className="project-tech-tag" key={idx}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="project-modal-footer">
              <button
                type="button"
                className="project-action-btn project-action-details"
                onClick={() => setSelectedProject(null)}
                data-cursor="disable"
              >
                Close
              </button>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn project-action-gh"
                data-cursor="disable"
              >
                <FaGithub />
                <span>GitHub Repo</span>
                <FiArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;

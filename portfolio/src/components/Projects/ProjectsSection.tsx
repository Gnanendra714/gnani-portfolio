import { useMemo, useRef, useState } from "react";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Eye,
} from "lucide-react";

import { Project } from "../../data/portfolioData";
import { usePortfolio } from "../../context/PortfolioContext";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function ProjectsSection() {
  const { data } = usePortfolio();
  const { projects, projectsSection } = data;

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filterTabs = ["All", "Embedded & IoT", "AI & Web", "Internships"];

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects || [];

    return (projects || []).filter(
      (project) => project.category === selectedFilter,
    );
  }, [projects, selectedFilter]);

  const goNext = () => {
    if (filteredProjects.length <= 1) return;

    setActiveIndex((current) => (current + 1) % filteredProjects.length);
  };

  const goPrevious = () => {
    if (filteredProjects.length <= 1) return;

    setActiveIndex(
      (current) =>
        (current - 1 + filteredProjects.length) % filteredProjects.length,
    );
  };

  const handleCarouselKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    // Don't interfere with interactive elements or text inputs.
    const target = event.target as HTMLElement;

    if (
      target.closest(
        'input, textarea, select, button, a, [contenteditable="true"]',
      )
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goPrevious();
        break;

      case "ArrowRight":
        event.preventDefault();
        goNext();
        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (filteredProjects[activeIndex]) {
          setActiveProject(filteredProjects[activeIndex]);
        }
        break;
    }
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    const threshold = 50;

    // Navigate only when the gesture is primarily horizontal.
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const changeFilter = (filter: string) => {
    setSelectedFilter(filter);
    setActiveIndex(0);
  };

  // Calculate each card's position relative to the featured card.
  const getCardOffset = (index: number) => {
    const total = filteredProjects.length;

    if (total <= 1) return 0;

    let offset = (index - activeIndex + total) % total;

    if (offset > total / 2) {
      offset -= total;
    }

    return offset;
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-[var(--theme-border)] bg-[var(--theme-bg-surface)]/70 py-12 sm:py-14 lg:py-16"
    >
      {/* Background effects */}
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full blur-[150px] opacity-15"
        style={{
          backgroundColor: "rgb(var(--theme-accent-rgb))",
        }}
      />

      <div
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full blur-[150px] opacity-10"
        style={{
          backgroundColor: "rgb(var(--theme-accent-light-rgb))",
        }}
      />

      {/* Circuit decorations */}
      <div className="pointer-events-none absolute left-0 top-1/3 h-px w-32 bg-gradient-to-r from-transparent to-[var(--theme-accent)] opacity-30" />
      <div className="pointer-events-none absolute right-0 bottom-1/3 h-px w-32 bg-gradient-to-l from-transparent to-[var(--theme-accent)] opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-8">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--theme-accent)] sm:text-xs">
            {projectsSection?.kicker || "PORTFOLIO OF WORK"}
          </span>

          <h2 className="mb-3 mt-2 font-serif-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            {projectsSection?.headline || "Signature Engineering Deliverables"}
          </h2>

          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {projectsSection?.description ||
              "Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications."}
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-7 flex justify-center sm:mb-8">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/80 p-1 shadow-lg">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => changeFilter(tab)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-[10px] font-medium transition-all sm:px-4 sm:text-xs ${
                    isActive
                      ? "bg-[var(--theme-accent)] text-slate-950 shadow-lg"
                      : "text-slate-400 hover:bg-[var(--theme-bg-card-hover)] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playing Card Carousel */}
        <div className="relative mx-auto max-w-6xl">
          {/* Deck */}
          {filteredProjects.length > 0 ? (
            <div
              className="relative mx-auto h-[540px] w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--theme-bg-surface)] sm:h-[570px] lg:h-[590px] lg:overflow-visible"
              tabIndex={0}
              role="region"
              aria-label="Projects carousel. Use left and right arrow keys to navigate, Enter or Space to open project details."
              onKeyDown={handleCarouselKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              {filteredProjects.map((project, index) => {
                const offset = getCardOffset(index);

                // Show only the featured card and two cards on either side.
                if (Math.abs(offset) > 2) return null;

                const distance = Math.abs(offset);
                const isActive = offset === 0;

                const cardStyle: React.CSSProperties = {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "min(82vw, 390px)",
                  transform: `
                    translate(-50%, -50%)
                    translateX(${offset * 195}px)
                    rotate(${offset * 8}deg)
                    scale(${1 - distance * 0.085})
                  `,
                  zIndex: isActive ? 100 : 50 - distance,
                  opacity: distance === 2 ? 0.68 : 1,
                  transition:
                    "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease, border-color 400ms ease",
                  cursor: isActive ? "default" : "pointer",
                };

                return (
                  <article
                    key={project.id}
                    style={cardStyle}
                    onClick={() => {
                      if (!isActive) setActiveIndex(index);
                    }}
                    onKeyDown={(event) => {
                      if (
                        !isActive &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    tabIndex={isActive ? -1 : 0}
                    aria-label={`Select project: ${project.title}`}
                    className={`
                      group flex h-[480px] flex-col overflow-hidden
                      rounded-2xl border bg-[var(--theme-bg-card)]
                      shadow-2xl backdrop-blur-xl
                      sm:h-[510px] sm:rounded-3xl
                      ${
                        isActive
                          ? "border-[var(--theme-accent)] shadow-[0_0_35px_rgb(var(--theme-accent-rgb)/0.18)]"
                          : "border-[var(--theme-border)]"
                      }
                    `}
                  >
                    {/* Card Header */}
                    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--theme-border)] px-3.5 py-2.5 sm:px-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--theme-accent)] sm:text-xs">
                        <span>
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(filteredProjects.length).padStart(2, "0")}
                        </span>

                        <div className="h-1 w-10 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-[var(--theme-accent)]"
                            style={{
                              width: `${
                                ((index + 1) / filteredProjects.length) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <span className="flex items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-surface)] px-2 py-1 text-[9px] font-mono text-[var(--theme-accent)] sm:text-[10px]">
                        <Cpu className="h-3 w-3" />
                        {project.category}
                      </span>
                    </div>

                    {/* Project Image */}
                    <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-[var(--theme-bg-base)]">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        draggable={false}
                        className={`h-full w-full object-cover transition-transform duration-700 ${
                          isActive ? "group-hover:scale-105" : ""
                        }`}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-card)] via-transparent to-transparent opacity-80" />

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => setActiveProject(project)}
                          aria-label={`Preview ${project.title}`}
                          title="Preview project"
                          className="absolute right-3 top-3 z-20 flex items-center justify-center rounded-lg border border-[var(--theme-accent)] bg-slate-950/80 p-2 text-[var(--theme-accent)] shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-[var(--theme-accent)] hover:text-slate-950"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Project Information */}
                    <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-5">
                      <h3 className="mb-2 line-clamp-2 font-serif-display text-lg font-bold leading-snug text-white sm:text-xl">
                        {project.title}
                      </h3>

                      {/* Technology Stack */}
                      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] text-[var(--theme-accent)] sm:text-[10px]">
                        {(project.tags || []).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="flex items-center gap-2"
                          >
                            {tag}
                            {tagIndex < project.tags.length - 1 && (
                              <span className="text-slate-600">·</span>
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Short Description */}
                      <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-slate-300">
                        {project.shortDescription}
                      </p>

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--theme-border)] pt-3">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveProject(project);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-[11px] font-semibold text-slate-950 transition-all hover:brightness-110 sm:text-xs"
                        >
                          View Case Study
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              aria-label="View GitHub source"
                              className="rounded-lg border border-[var(--theme-border)] p-2 text-slate-300 transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}

                          {project.liveUrl && project.liveUrl !== "#" && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              aria-label="Open live demo"
                              className="rounded-lg border border-[var(--theme-border)] p-2 text-slate-300 transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Empty state */}
              {filteredProjects.length === 0 && (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No projects found in this category.
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-slate-400">
              No projects available.
            </div>
          )}

          {/* Navigation Arrows */}
          {filteredProjects.length > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-1 sm:px-3 lg:-mx-8">
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous project"
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--theme-accent)] bg-[var(--theme-bg-surface)]/95 text-[var(--theme-accent)] shadow-lg shadow-black/30 backdrop-blur-md transition-all hover:scale-110 hover:bg-[var(--theme-accent)] hover:text-slate-950 sm:h-11 sm:w-11"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next project"
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--theme-accent)] bg-[var(--theme-bg-surface)]/95 text-[var(--theme-accent)] shadow-lg shadow-black/30 backdrop-blur-md transition-all hover:scale-110 hover:bg-[var(--theme-accent)] hover:text-slate-950 sm:h-11 sm:w-11"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation hint — no pagination dots */}
        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:mt-4 sm:text-[10px]">
          Select a project card or use the arrow controls to explore
        </p>
      </div>

      {/* Existing Project Detail Modal */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

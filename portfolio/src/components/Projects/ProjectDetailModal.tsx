import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Cpu,
  Award,
} from "lucide-react";
import { Project } from "../../data/portfolioData";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  // Lock background scrolling and support Escape key.
  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const accent = "text-[var(--theme-accent)]";
  const border = "border-[var(--theme-border)]";

  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/80 backdrop-blur-md
        p-3 sm:p-5
        animate-in fade-in duration-200
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal */}
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className={`
  relative flex w-full max-w-[850px]
  max-h-[min(650px,calc(100dvh-40px))]
  flex-col overflow-hidden
  rounded-2xl border ${border}
  bg-[var(--theme-bg-surface)]
  shadow-2xl shadow-black/60
  animate-in zoom-in-95 duration-200
`}
      >
        {/* Fixed Header */}
        <header
          className={`
            flex shrink-0 items-center justify-between
            gap-4 border-b ${border}
            bg-[var(--theme-bg-surface)]
            px-5 py-3.5 sm:px-6
          `}
        >
          <div
            className={`flex min-w-0 items-center gap-2 font-mono text-xs ${accent}`}
          >
            <Cpu className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {project.badge || project.category || "Project Showcase"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className={`
              shrink-0 rounded-full border ${border}
              p-2 text-slate-400
              transition-all duration-200
              hover:border-[var(--theme-accent)]
              hover:bg-[var(--theme-bg-card)]
              hover:text-[var(--theme-accent)]
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Independently Scrollable Content */}
        <div className="project-modal-scroll min-h-0 flex-1 overflow-y-auto">
          {/* Project Image */}
          {project.image && (
            <div
              className="
  relative h-[120px] w-full shrink-0
  overflow-hidden bg-[var(--theme-bg-base)]
  sm:h-[150px] md:h-[170px]
"
            >
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />

              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-t
                  from-[var(--theme-bg-surface)]/70
                  via-transparent to-transparent
                "
              />
            </div>
          )}

          {/* Project Information */}
          <div className="space-y-6 px-5 pb-8 pt-5 sm:px-7 sm:pb-9 sm:pt-6">
            {/* Title and Description */}
            <section>
              <h2
                id="project-modal-title"
                className="
                  mb-3 font-serif-display
                  text-2xl font-bold leading-tight
                  text-white sm:text-3xl
                "
              >
                {project.title}
              </h2>

              <p className="text-sm leading-7 text-slate-300 sm:text-[15px]">
                {project.fullDescription || project.shortDescription}
              </p>
            </section>

            {/* Technology Stack */}
            {(project.tags?.length ?? 0) > 0 && (
              <section>
                <h3
                  className={`
                    mb-3 font-mono text-[10px]
                    font-semibold uppercase tracking-[0.2em] ${accent}
                  `}
                >
                  Technology Stack
                </h3>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`
                        rounded-md border ${border}
                        bg-[var(--theme-bg-card)]
                        px-3 py-1.5
                        font-mono text-[11px] text-slate-300
                      `}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Project Metrics */}
            {(project.metrics?.length ?? 0) > 0 && (
              <section>
                <h3
                  className={`
                    mb-3 font-mono text-[10px]
                    font-semibold uppercase tracking-[0.2em] ${accent}
                  `}
                >
                  Project Metrics
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(project.metrics ?? []).map((metric, index) => (
                    <div
                      key={index}
                      className={`
                        rounded-xl border ${border}
                        bg-[var(--theme-bg-card)]
                        p-4 text-center
                      `}
                    >
                      <p className={`font-mono text-xl font-bold ${accent}`}>
                        {metric.value}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Engineering Highlights */}
            {(project.highlights?.length ?? 0) > 0 && (
              <section>
                <h3
                  className="
                    mb-3 flex items-center gap-2
                    font-serif-display text-base
                    font-bold text-white
                  "
                >
                  <Award className={`h-4 w-4 ${accent}`} />
                  Engineering Highlights
                </h3>

                <div className="space-y-3">
                  {project.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="
                        flex items-start gap-3
                        text-sm leading-relaxed text-slate-300
                      "
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`}
                      />

                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technical Architecture */}
            {(project.architecture?.length ?? 0) > 0 && (
              <section>
                <h3
                  className="
                    mb-3 flex items-center gap-2
                    font-serif-display text-base
                    font-bold text-white
                  "
                >
                  <Layers className={`h-4 w-4 ${accent}`} />
                  Technical Architecture
                </h3>

                <div className="grid gap-2 sm:grid-cols-2">
                  {(project.architecture ?? []).map((item, index) => (
                    <div
                      key={index}
                      className={`
                        rounded-lg border ${border}
                        bg-[var(--theme-bg-card)]
                        p-3 text-xs leading-relaxed text-slate-300
                      `}
                    >
                      <span className={`mr-2 font-mono ${accent}`}>
                        [{String(index + 1).padStart(2, "0")}]
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Links */}
            <section
              className={`
                flex flex-wrap items-center gap-3
                border-t ${border} pt-5
              `}
            >
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center gap-2
                    rounded-lg border ${border}
                    bg-[var(--theme-bg-card)]
                    px-4 py-2.5 text-xs font-medium
                    text-white transition-all
                    hover:border-[var(--theme-accent)]
                    hover:${accent}
                  `}
                >
                  <Github className="h-4 w-4" />
                  View Source Code
                </a>
              )}

              {project.liveUrl && project.liveUrl !== "#" && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    rounded-lg
                    bg-[var(--theme-accent)]
                    px-4 py-2.5 text-xs font-semibold
                    text-slate-950 transition-all
                    hover:brightness-110
                  "
                >
                  Launch Live Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </section>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}

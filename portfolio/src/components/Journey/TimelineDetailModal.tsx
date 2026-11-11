import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle2,
  Cpu,
  Sparkles,
  BookOpen,
  Calendar,
} from "lucide-react";
import { TimelineMilestone } from "../../data/portfolioData";

interface TimelineDetailModalProps {
  milestone: TimelineMilestone | null;
  onClose: () => void;
}

export function TimelineDetailModal({
  milestone,
  onClose,
}: TimelineDetailModalProps) {
  useEffect(() => {
    if (!milestone) return;

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
  }, [milestone, onClose]);

  if (!milestone) return null;

  const accent = "text-[var(--theme-accent)]";
  const accentBg = "bg-[var(--theme-accent)]/10";
  const border = "border-[var(--theme-border)]";
  const cardBg = "bg-[var(--theme-bg-card)]";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center
      bg-black/80 p-3 backdrop-blur-md animate-in fade-in duration-200
      sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeline-modal-title"
        className={`relative flex max-h-[82vh] w-full max-w-4xl
        flex-col overflow-hidden rounded-2xl border ${border}
        bg-[var(--theme-bg-surface)] shadow-2xl
        animate-in zoom-in-95 duration-200`}
      >
        {/* Fixed Header */}
        <header
          className={`flex shrink-0 items-center justify-between gap-4
          border-b ${border} bg-[var(--theme-bg-surface)]
          px-5 py-4 sm:px-7`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className={`rounded-lg ${accentBg} p-2`}>
              <Calendar className={`h-4 w-4 ${accent}`} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-mono text-xs font-bold ${accent}`}>
                  {milestone.year}
                </span>

                <span className="text-slate-600">/</span>

                <span className="truncate font-mono text-xs text-slate-400">
                  {milestone.subtitle}
                </span>
              </div>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Career & Learning Journey
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close timeline details"
            className={`shrink-0 rounded-full border ${border}
            p-2 text-slate-400 transition
            hover:border-[var(--theme-accent)]
            hover:text-[var(--theme-accent)]`}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="space-y-7 p-5 sm:p-8">
            {/* Timeline Title & Summary */}
            <section>
              <div
                className={`mb-3 inline-flex items-center gap-2
                font-mono text-[10px] font-semibold uppercase
                tracking-[0.2em] ${accent}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Milestone Overview
              </div>

              <h2
                id="timeline-modal-title"
                className="mb-3 font-serif-display text-2xl
                font-bold leading-tight text-white sm:text-4xl"
              >
                {milestone.title}
              </h2>

              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {milestone.summary}
              </p>
            </section>

            {/* The Story */}
            {milestone.story && (
              <section>
                <h3
                  className={`mb-3 flex items-center gap-2
                  font-serif-display text-base font-bold text-white`}
                >
                  <BookOpen className={`h-4 w-4 ${accent}`} />
                  The Story
                </h3>

                <div
                  className={`rounded-xl border ${border}
                  ${cardBg} p-5 sm:p-6`}
                >
                  <p className="text-sm leading-7 text-slate-300">
                    {milestone.story}
                  </p>
                </div>
              </section>
            )}

            {/* Technologies Acquired */}
            {(milestone.technologies?.length ?? 0) > 0 && (
              <section>
                <h3
                  className="mb-3 flex items-center gap-2
                  font-serif-display text-base font-bold text-white"
                >
                  <Cpu className={`h-4 w-4 ${accent}`} />
                  Technologies Acquired
                </h3>

                <div
                  className={`rounded-xl border ${border}
                  ${cardBg} p-4`}
                >
                  <div className="flex flex-wrap gap-2">
                    {milestone.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`rounded-md border ${border}
                        ${accentBg} px-3 py-2 font-mono
                        text-xs ${accent}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Key Achievements */}
            {(milestone.achievements?.length ?? 0) > 0 && (
              <section>
                <h3
                  className="mb-4 flex items-center gap-2
                  font-serif-display text-base font-bold text-white"
                >
                  <Sparkles className={`h-4 w-4 ${accent}`} />
                  Key Achievements
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {milestone.achievements.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3
                      rounded-xl border ${border} ${cardBg} p-4`}
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`}
                      />

                      <span className="text-sm leading-relaxed text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <footer
          className={`flex shrink-0 items-center justify-between
          gap-4 border-t ${border} bg-[var(--theme-bg-surface)]
          px-5 py-4 sm:px-7`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Gnani · Engineering Journey
          </span>

          <button
            onClick={onClose}
            className={`rounded-lg bg-[var(--theme-accent)]
            px-5 py-2.5 text-xs font-semibold text-slate-950
            transition hover:brightness-110`}
          >
            Close Story
          </button>
        </footer>
      </article>
    </div>,
    document.body,
  );
}

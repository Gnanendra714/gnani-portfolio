import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TimelineMilestone } from "../../data/portfolioData";
import { usePortfolio } from "../../context/PortfolioContext";
import { TimelineDetailModal } from "./TimelineDetailModal";

export function TimelineSection() {
  const { data } = usePortfolio();
  const { timeline, timelineSection } = data;

  const [activeMilestone, setActiveMilestone] =
    useState<TimelineMilestone | null>(null);

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-[var(--theme-bg-base)] py-12 sm:py-14 lg:py-16"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-15 transition-all duration-500 sm:h-[500px] sm:w-[500px]"
        style={{
          backgroundColor: "rgb(var(--theme-accent-rgb))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-9">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400 sm:text-xs">
            {timelineSection.kicker}
          </span>

          <h2 className="mb-3 mt-2 font-serif-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {timelineSection.headline}
          </h2>

          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            {timelineSection.description}
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Glowing Line */}
          <div className="absolute bottom-3 left-4 top-3 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-500/80 via-amber-400/40 to-slate-800 md:left-1/2" />

          {/* Timeline Nodes */}
          <div className="space-y-7 sm:space-y-8">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col items-start gap-4 md:flex-row md:gap-0 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Central Year Amber Node */}
                  <div className="absolute left-4 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-amber-400 bg-[var(--theme-bg-base)] shadow-lg shadow-amber-400/30 transition-transform group-hover:scale-125">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    </div>
                  </div>

                  {/* Content Card Side */}
                  <div
                    className={`w-full pl-10 md:w-1/2 md:pl-0 ${
                      isEven ? "md:pl-8" : "md:pr-8"
                    }`}
                  >
                    <div
                      onClick={() => setActiveMilestone(item)}
                      className="group cursor-pointer rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/80 p-4 shadow-lg shadow-black/30 transition-all duration-300 hover:border-amber-400/40 hover:shadow-amber-500/5 sm:rounded-2xl sm:p-5"
                    >
                      {/* Year & Subtitle */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-amber-400 sm:text-xs">
                          {item.year}
                        </span>

                        <span className="text-right font-mono text-[9px] text-slate-400 sm:text-[10px]">
                          {item.subtitle}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="mb-2 font-serif-display text-lg font-bold text-white transition-colors group-hover:text-amber-300 sm:text-xl">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="mb-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {item.summary}
                      </p>

                      {/* Technologies */}
                      <div className="mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[10px] text-amber-300/80 sm:text-xs">
                        {item.technologies.slice(0, 5).map((tech, tIdx) => (
                          <span key={tIdx} className="flex items-center">
                            <span>{tech}</span>

                            {tIdx <
                              Math.min(item.technologies.length, 5) - 1 && (
                              <span
                                aria-hidden="true"
                                className="mx-1 text-slate-600"
                              >
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Interactive trigger link */}
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 transition-all group-hover:translate-x-1 group-hover:text-amber-300 sm:text-xs">
                        <span>Click to explore</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer on Opposite Desktop Side */}
                  <div className="hidden w-1/2 md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Detailed View */}
      <TimelineDetailModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />
    </section>
  );
}

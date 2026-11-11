import { useState } from 'react';
import { ArrowRight, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { TimelineMilestone } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';
import { TimelineDetailModal } from './TimelineDetailModal';

export function TimelineSection() {
  const { data } = usePortfolio();
  const { timeline, timelineSection } = data;
  const [activeMilestone, setActiveMilestone] = useState<TimelineMilestone | null>(null);

  return (
    <section id="journey" className="py-24 relative overflow-hidden bg-[var(--theme-bg-base)]">
      {/* Background ambient lighting */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[160px] rounded-full pointer-events-none opacity-15 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-rgb))' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 font-mono">
            {timelineSection.kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-display text-white mt-3 mb-4">
            {timelineSection.headline}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {timelineSection.description}
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Glowing Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500/80 via-amber-400/40 to-slate-800 -translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-0`}
                >
                  
                  {/* Central Year Amber Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[var(--theme-bg-base)] border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30 group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Content Card Side */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                    <div
                      onClick={() => setActiveMilestone(item)}
                      className="group p-6 sm:p-7 rounded-2xl bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] hover:border-amber-400/40 transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-amber-500/5 cursor-pointer"
                    >
                      {/* Year & Subtitle */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                          {item.year}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.subtitle}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white group-hover:text-amber-300 transition-colors mb-2">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        {item.summary}
                      </p>

                      {/* Unboxed clean technologies list */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-300/80 font-mono mb-5">
                        {item.technologies.slice(0, 5).map((tech, tIdx) => (
                          <span key={tIdx} className="flex items-center">
                            <span>{tech}</span>
                            {tIdx < Math.min(item.technologies.length, 5) - 1 && (
                              <span aria-hidden="true" className="mx-1 text-slate-600">·</span>
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Interactive trigger link */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                        <span>Click to explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer on Opposite Desktop Side */}
                  <div className="hidden md:block w-1/2" />
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

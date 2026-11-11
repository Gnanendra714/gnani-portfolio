import { useEffect } from 'react';
import { X, Calendar, CheckCircle2, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { TimelineMilestone } from '../../data/portfolioData';

interface TimelineDetailModalProps {
  milestone: TimelineMilestone | null;
  onClose: () => void;
}

export function TimelineDetailModal({ milestone, onClose }: TimelineDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (milestone) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--theme-bg-surface)] border border-amber-500/35 rounded-2xl shadow-2xl shadow-black z-10 p-6 sm:p-8 scrollbar-none">
        
        {/* Header with Year badge & Close button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
              {milestone.year}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {milestone.subtitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close timeline modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Summary */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white mb-2">
            {milestone.title}
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            {milestone.summary}
          </p>
        </div>

        {/* The Story Section */}
        <div className="mb-8">
          <h3 className="text-sm font-bold font-serif-display text-amber-400 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>The Story</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            {milestone.story}
          </p>
        </div>

        {/* Technologies Acquired (Zero-Pill Compliant unboxed display) */}
        <div className="mb-8">
          <h3 className="text-sm font-bold font-serif-display text-amber-400 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Technologies Acquired</span>
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            {milestone.technologies.map((tech, idx) => (
              <span key={idx} className="flex items-center">
                <span className="text-amber-300">{tech}</span>
                {idx < milestone.technologies.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Key Achievements Checklist */}
        <div>
          <h3 className="text-sm font-bold font-serif-display text-amber-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Key Achievements</span>
          </h3>
          <div className="space-y-2.5">
            {milestone.achievements.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Close Story
          </button>
        </div>

      </div>
    </div>
  );
}

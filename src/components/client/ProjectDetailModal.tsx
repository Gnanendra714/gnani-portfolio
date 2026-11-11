import { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Award } from 'lucide-react';
import { Project } from '../../data/portfolioData';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--theme-bg-surface)] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black z-10 scrollbar-none">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[var(--theme-bg-surface)]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>{project.badge}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Image within Modal */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent opacity-90" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white mb-3">
              {project.title}
            </h2>

            {/* Unboxed clean metadata tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300/90 font-mono mb-4">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center">
                  <span>{tag}</span>
                  {idx < project.tags.length - 1 && (
                    <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
                  )}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Key Metrics Strip if available */}
          {project.metrics && (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 tabular-nums">
                    {metric.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Engineering Highlights */}
          <div>
            <h3 className="text-base font-bold font-serif-display text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Key Achievements & Capabilities</span>
            </h3>
            <div className="space-y-2.5">
              {project.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture & Flow */}
          {project.architecture && (
            <div>
              <h3 className="text-base font-bold font-serif-display text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Technical Architecture</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.architecture.map((arch, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300">
                    <span className="font-mono text-amber-400 font-semibold mr-1.5">
                      [{idx + 1}]
                    </span>
                    {arch}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 hover:border-amber-400/50 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold shadow-md shadow-amber-400/20 transition-all"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Close Preview
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

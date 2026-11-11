import { useState, useMemo } from 'react';
import { ExternalLink, Github, ArrowUpRight, Cpu, Eye, Sparkles } from 'lucide-react';
import { Project } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectDetailModal } from './ProjectDetailModal';

export function ProjectsSection() {
  const { data } = usePortfolio();
  const { projects, projectsSection } = data;
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filterTabs = ['All', 'Embedded & IoT', 'AI & Web', 'Internships'];

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') return projects;
    return projects.filter((p) => p.category === selectedFilter);
  }, [projects, selectedFilter]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[var(--theme-bg-surface)]/70 border-t border-[var(--theme-border)]">
      {/* Background ambient accents */}
      <div
        className="absolute top-1/4 right-10 w-96 h-96 blur-[140px] rounded-full pointer-events-none opacity-15 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-rgb))' }}
      />
      <div
        className="absolute bottom-10 left-10 w-96 h-96 blur-[140px] rounded-full pointer-events-none opacity-15 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-light-rgb))' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 font-mono">
            {projectsSection.kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-display text-white mt-3 mb-4">
            {projectsSection.headline}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {projectsSection.description}
          </p>
        </div>

        {/* Functional Segmented Filter Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-1.5 p-1 bg-[var(--theme-bg-surface)] rounded-xl border border-[var(--theme-border)] shadow-lg">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[var(--theme-bg-card)]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl overflow-hidden bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] hover:border-amber-400/40 transition-all duration-300 group flex flex-col justify-between shadow-xl shadow-black/40 hover:shadow-amber-500/5"
            >
              <div>
                {/* Visual Thumbnail with Hover Glow */}
                <div
                  onClick={() => setActiveProject(project)}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--theme-bg-base)] cursor-pointer"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-card)] via-transparent to-transparent opacity-90" />

                  {/* Category Indicator & Preview overlay */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[var(--theme-bg-base)]/85 border border-[var(--theme-border)] text-[11px] font-mono text-amber-300 backdrop-blur-md">
                    {project.category}
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-amber-400 text-slate-950 shadow-md">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-7">
                  
                  {/* Title & View More trigger */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3
                      onClick={() => setActiveProject(project)}
                      className="text-xl sm:text-2xl font-bold font-serif-display text-white group-hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* Unboxed Metadata (Zero-pill compliant) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-400/90 font-mono mb-4">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center">
                        <span>{tag}</span>
                        {idx < project.tags.length - 1 && (
                          <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>

                  <button
                    onClick={() => setActiveProject(project)}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 mb-6 transition-colors group/link"
                  >
                    <span>View Case Study & Metrics</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-4 bg-[var(--theme-bg-surface)] border-t border-[var(--theme-border)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--theme-bg-card)] hover:bg-[var(--theme-bg-card-hover)] text-slate-300 hover:text-white text-xs font-medium border border-[var(--theme-border)] transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-medium border border-amber-400/30 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActiveProject(project)}
                  className="text-[11px] font-mono text-slate-400 hover:text-amber-300"
                >
                  Explore Details
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

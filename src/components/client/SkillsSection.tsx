import { useState, useMemo } from 'react';
import { Search, Layout, Server, Cpu, Radio, Wrench, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function SkillsSection() {
  const { data } = usePortfolio();
  const { skills, skillsSection } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryIcons: Record<string, typeof Layout> = {
    embedded: Cpu,
    hardware: Zap,
    iot: Radio,
    fullstack: Layout,
    tools: Wrench,
    ai: Sparkles,
  };

  const categories = [
    { id: 'all', label: 'All Technologies' },
    ...skills.map((c) => ({ id: c.id, label: c.name })),
  ];

  const filteredCategories = useMemo(() => {
    return skills
      .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
      .map((cat) => {
        if (!searchQuery.trim()) return cat;
        const matchingSkills = cat.skills.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.desc && s.desc.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return {
          ...cat,
          skills: matchingSkills,
        };
      })
      .filter((cat) => cat.skills.length > 0);
  }, [skills, selectedCategory, searchQuery]);

  const totalSkillsCount = useMemo(() => {
    return skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  }, [skills]);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[var(--theme-bg-base)]">
      {/* Subtle background ambient pattern */}
      <div className="absolute inset-0 bg-circuit-grid opacity-35 pointer-events-none" />
      <div
        className="absolute left-1/4 top-1/3 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-15 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-rgb))' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 font-mono">
            {skillsSection.kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-display text-white mt-3 mb-4">
            {skillsSection.headline}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {skillsSection.description}
          </p>
        </div>

        {/* Interactive Filter Tabs and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-[var(--theme-border)]">
          
          {/* Functional segmented category tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--theme-bg-surface)] rounded-xl border border-[var(--theme-border)] overflow-x-auto max-w-full scrollbar-none shadow-md">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[var(--theme-bg-card)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick search filter */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill (e.g. ESP32, React)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-base font-medium">No technologies matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-amber-400 underline hover:text-amber-300"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const Icon = categoryIcons[category.id] || Layout;

              return (
                <div
                  key={category.id}
                  className="rounded-2xl p-6 bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Category Title with Icon */}
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--theme-border)]">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-serif-display text-white group-hover:text-amber-300 transition-colors">
                          {category.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {category.skills.length} competencies
                        </span>
                      </div>
                    </div>

                    {/* Unboxed Skill Items (Zero-Pill Discipline strictly enforced) */}
                    <div className="space-y-3.5">
                      {category.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-3 text-sm group/item py-1"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-200 group-hover/item:text-amber-300 transition-colors">
                                {skill.name}
                              </span>
                              {skill.highlight && (
                                <span className="text-[10px] text-amber-400/90 font-mono">
                                  ★ Core
                                </span>
                              )}
                            </div>
                            {skill.desc && (
                              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                                {skill.desc}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-[11px] font-mono text-slate-400 shrink-0 text-right pt-0.5">
                            {skill.level}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--theme-border)] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Hardware & Software Stack</span>
                    <span className="text-amber-400">Verified Skills</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

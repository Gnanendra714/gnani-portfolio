import { useState, useEffect, useRef } from 'react';
import { Crown, FileText, Menu, X, ArrowUpRight, Palette, Check } from 'lucide-react';
import { usePortfolio, THEME_PRESETS } from '../../context/PortfolioContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenConnect: () => void;
}

export function Navbar({
  activeSection,
  onNavigate,
  onOpenResume,
  onOpenConnect,
}: NavbarProps) {
  const { data, currentTheme, setTheme } = usePortfolio();
  const { personal } = data;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setThemeDropdownOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'workbench', label: 'Workbench' },
    { id: 'projects', label: 'Projects' },
    { id: 'journey', label: 'Journey' },
    { id: 'connect', label: 'Connect' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--theme-bg-base)]/92 backdrop-blur-md border-b border-[var(--theme-border)] shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark with Crown */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            aria-label="Gnani Portfolio Home"
            title="Return to Gnani Home Page"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:scale-105 transition-all">
              <Crown className="w-4 h-4 fill-amber-400/20 text-amber-400" />
            </div>
            <div>
              <span className="font-serif-display text-lg tracking-[0.18em] font-bold text-amber-400 group-hover:text-amber-300 transition-colors whitespace-nowrap block leading-tight">
                {(personal.name || 'GNANI').toUpperCase()}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase hidden sm:block">
                ECE · Embedded Architect
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Theme Selector */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--theme-bg-card)]/80 hover:bg-[var(--theme-bg-card)] text-slate-300 hover:text-white border border-[var(--theme-border)] text-xs font-mono transition-all cursor-pointer"
                title="Change Portfolio Color Theme"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      THEME_PRESETS.find((t) => t.id === currentTheme)?.accentColor || '#3b82f6',
                  }}
                />
                <Palette className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-[var(--theme-border)] mb-1">
                    Select UI Color Theme
                  </div>
                  <div className="space-y-1">
                    {THEME_PRESETS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          currentTheme === t.id
                            ? 'bg-amber-500/15 text-white border border-amber-500/30'
                            : 'text-slate-300 hover:bg-[var(--theme-bg-card)] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: t.accentColor }}
                          />
                          <span>{t.name}</span>
                        </div>
                        {currentTheme === t.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 rounded-md border border-slate-800 hover:border-amber-500/40 bg-slate-900/50 hover:bg-slate-900 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Resume</span>
            </button>
            <button
              onClick={onOpenConnect}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenResume}
              className="p-1.5 text-xs text-amber-400 border border-amber-500/30 rounded bg-slate-900/60"
              aria-label="View Resume"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-md border border-slate-800 bg-slate-900/80 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--theme-bg-surface)] border-b border-[var(--theme-border)] px-6 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-[var(--theme-bg-card)] hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Mobile Theme Selector */}
            <div className="pt-3 border-t border-[var(--theme-border)]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Palette className="w-3.5 h-3.5" />
                  <span>UI / UX Color Theme</span>
                </span>
                <span className="capitalize text-slate-300">{currentTheme}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {THEME_PRESETS.map((t) => {
                  const isSelected = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 text-white border border-amber-500/40 font-semibold'
                          : 'bg-[var(--theme-bg-card)]/80 text-slate-400 border border-[var(--theme-border)] hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      <span className="truncate">{t.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--theme-border)] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="flex-1 py-2 text-xs font-medium text-slate-300 border border-slate-800 rounded-md text-center hover:bg-slate-800"
              >
                View Resume
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConnect();
                }}
                className="flex-1 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-md text-center"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

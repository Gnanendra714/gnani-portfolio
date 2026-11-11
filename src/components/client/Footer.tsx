import { Crown, ArrowUp, Heart } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface FooterProps {
  onNavigate?: (pageId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { data } = usePortfolio();
  const { personal } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'workbench', label: 'Workbench' },
    { id: 'projects', label: 'Projects' },
    { id: 'journey', label: 'Journey' },
    { id: 'connect', label: 'Connect' },
  ];

  const handleNav = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      if (id === 'home') {
        scrollToTop();
      } else {
        const el = document.getElementById(id);
        if (el) {
          const navOffset = 72;
          const top = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="py-12 bg-[var(--theme-bg-base)] border-t border-[var(--theme-border)] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand mark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-6 h-6 rounded bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif-display font-bold tracking-widest text-white text-sm group-hover:text-amber-300 transition-colors">
              {(personal.name || 'GNANI').toUpperCase()}
            </span>
          </button>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Back to top */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-slate-500">
              © {new Date().getFullYear()} Gnani · ECE
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-amber-400/40 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>Engineered with React 19, TypeScript, Tailwind CSS, ESP32, and MongoDB Atlas.</span>
          <span className="flex items-center gap-1 font-mono">
            Designed for Reliability <Heart className="w-3 h-3 text-amber-400 fill-amber-400/20 inline" />
          </span>
        </div>
      </div>
    </footer>
  );
}

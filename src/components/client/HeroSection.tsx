import { useState, useEffect } from 'react';
import { Crown, ArrowRight, Download, Zap, Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { InteractiveChipCanvas } from './InteractiveChipCanvas';
import { sound } from '../../utils/soundEffects';

interface HeroSectionProps {
  onOpenResume: () => void;
  onExploreProjects: () => void;
  onExploreWorkbench?: () => void;
  onOpenConnect?: () => void;
}

export function HeroSection({
  onOpenResume,
  onExploreProjects,
  onExploreWorkbench,
  onOpenConnect,
}: HeroSectionProps) {
  const { data } = usePortfolio();
  const { personal } = data;

  const defaultRoles = [
    'Arduino & ESP32 Developer',
    'Full Stack Web Engineer',
    'IoT Solutions Creator',
    'AI Integration Enthusiast'
  ];
  const rolesToCycle = personal.roles && personal.roles.length > 0 ? personal.roles : defaultRoles;

  // Typewriter effect state
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(90);

  // Switch between Interactive 3D Chip vs Workbench Bench View
  const [rightView, setRightView] = useState<'chip' | 'workbench'>('chip');

  // Simulated hardware interactive demo state
  const [ledActive, setLedActive] = useState(false);
  const [telemetryVoltage, setTelemetryVoltage] = useState(3.31);
  const [telemetryPackets, setTelemetryPackets] = useState(482);

  useEffect(() => {
    const currentRole = rolesToCycle[currentRoleIndex] || rolesToCycle[0];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setTypingSpeed(75);

        if (displayText.length + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setTypingSpeed(35);

        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % rolesToCycle.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, rolesToCycle, typingSpeed]);

  const toggleLed = () => {
    sound.playClick();
    setLedActive(!ledActive);
    setTelemetryPackets((p) => p + 1);
    setTelemetryVoltage(Number((3.28 + Math.random() * 0.08).toFixed(2)));
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] blur-[140px] rounded-full pointer-events-none opacity-20 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-rgb))' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Crown Emblem & Kicker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-6 backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
                {personal.roleTag || 'B.TECH ELECTRONICS & COMMUNICATION ENGINEER'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif-display leading-[1.08] mb-4 text-balance">
              I'm <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">{personal.name || 'Gnani'}</span>
            </h1>

            {/* Dynamic Typewriter Subtitle */}
            <div className="h-10 sm:h-12 flex items-center mb-6">
              <span className="text-xl sm:text-2xl font-mono text-amber-400 font-medium">
                {displayText}
              </span>
              <span className="inline-block w-0.5 h-6 sm:h-7 bg-amber-400 ml-1.5 animate-pulse" />
            </div>

            {/* Descriptive Body Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              {personal.shortBio}
            </p>

            {/* Action Buttons (Voice Intro Button Completely Removed) */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  if (onExploreWorkbench) {
                    onExploreWorkbench();
                  } else {
                    const el = document.getElementById('workbench');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Explore IoT Workbench</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenResume();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-card)] text-slate-200 hover:text-white border border-[var(--theme-border)] hover:border-amber-400/40 text-xs sm:text-sm font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreProjects();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>View Projects</span>
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-8 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className={`w-2 h-2 rounded-full ${personal.availableForHire ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {personal.availableForHire ? 'Available for Roles & Internships' : 'Currently Engaged'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Based in {personal.location || 'India'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>ECE Hardware Firmware & Full-Stack</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Chip / Physical Computing Workbench Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Interactive Engineering Model
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
                <button
                  onClick={() => setRightView('chip')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    rightView === 'chip' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Chip
                </button>
                <button
                  onClick={() => setRightView('workbench')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    rightView === 'workbench' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mini Lab
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl bg-[var(--theme-bg-surface)]/80 border border-[var(--theme-border)] shadow-2xl p-6 backdrop-blur-xl overflow-hidden group">
              {rightView === 'chip' ? (
                <div className="h-80 sm:h-96 flex flex-col items-center justify-center relative">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-400/80 bg-slate-950/70 border border-amber-500/20 px-2 py-0.5 rounded">
                    ESP32-WROOM-32D · Dual Xtensa LX6
                  </div>
                  <InteractiveChipCanvas />
                  <span className="text-[10px] font-mono text-slate-400 mt-2">
                    Rotate with mouse · Live 3D Canvas
                  </span>
                </div>
              ) : (
                <div className="h-80 sm:h-96 flex flex-col justify-between py-2">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-semibold text-white">ESP32 Edge Node #01</span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-400">UART 115200</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400">Rail Voltage:</span>
                      <span className="text-amber-400 font-bold">{telemetryVoltage}V</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400">Telemetry Packets:</span>
                      <span className="text-cyan-400 font-bold">{telemetryPackets} pkts</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400">Relay / GPIO 2 State:</span>
                      <span className={`font-bold ${ledActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {ledActive ? 'HIGH (ENGAGED)' : 'LOW (IDLE)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleLed}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      ledActive
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{ledActive ? 'Deactivate Relay GPIO 2' : 'Toggle Relay GPIO 2 (Active)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

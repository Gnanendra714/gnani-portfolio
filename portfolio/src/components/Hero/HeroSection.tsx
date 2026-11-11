import { useState, useEffect, useMemo } from "react";
import { Crown, ArrowRight, Download, Zap, Cpu } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { sound } from "../../utils/soundEffects";
import { CircuitVerse } from "../Arcade/CircuitVerse";

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

  const rolesToCycle = useMemo(
    () =>
      (personal.roles || []).filter(
        (role: string) => typeof role === "string" && role.trim().length > 0,
      ),
    [personal.roles],
  );

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(90);

  useEffect(() => {
    if (rolesToCycle.length === 0) {
      setDisplayText("");
      setCurrentRoleIndex(0);
      setIsDeleting(false);
      return;
    }

    const safeIndex = currentRoleIndex % rolesToCycle.length;
    const currentRole = rolesToCycle[safeIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentRole.substring(0, displayText.length + 1);
        setDisplayText(nextText);
        setTypingSpeed(75);

        if (nextText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        const nextText = currentRole.substring(0, displayText.length - 1);
        setDisplayText(nextText);
        setTypingSpeed(35);

        if (nextText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % rolesToCycle.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, rolesToCycle, typingSpeed]);

  return (
    <section
      id="home"
      className="
        relative isolate w-full
        min-h-0 lg:min-h-[100svh]
        flex items-center
        overflow-x-clip
        pt-24 pb-10
        sm:pt-24 sm:pb-12
        lg:pt-16 lg:pb-8
      "
    >
      {/* Ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[340px] blur-[130px] rounded-full pointer-events-none opacity-20 transition-all duration-500"
        style={{ backgroundColor: "rgb(var(--theme-accent-rgb))" }}
      />

      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left min-w-0">
            {/* Optional Identity Badge */}
            {personal.roleTag?.trim() && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-border)] text-[var(--theme-accent)] mb-3 backdrop-blur-sm">
                <Crown className="w-3 h-3" />
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase">
                  {personal.roleTag}
                </span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif-display leading-[1.05] mb-2 text-balance">
              I'm{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {personal.name || "Gnani"}
              </span>
            </h1>

            {/* Dynamic Typewriter Subtitle */}
            {rolesToCycle.length > 0 && (
              <div className="min-h-[28px] sm:min-h-[34px] flex items-center mb-3 max-w-full">
                <span className="text-sm sm:text-lg lg:text-xl font-mono text-[var(--theme-accent)] font-medium break-words">
                  {displayText}
                </span>

                <span className="inline-block w-0.5 h-5 sm:h-6 bg-amber-400 ml-1.5 animate-pulse" />
              </div>
            )}

            {/* Descriptive Body Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-5 font-normal">
              {personal.shortBio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full">
              <button
                onClick={() => {
                  sound.playClick();
                  if (onExploreWorkbench) {
                    onExploreWorkbench();
                  } else {
                    const el = document.getElementById("workbench");
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top +
                        window.pageYOffset -
                        72;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950" />
                <span>Explore IoT Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenResume();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-card)] text-slate-200 hover:text-white border border-[var(--theme-border)] hover:border-amber-400/40 text-[11px] sm:text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreProjects();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-[11px] sm:text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>View Projects</span>
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] sm:text-[11px] text-slate-400 font-mono">
              {personal.availableForHire === true && (
                <span className="flex items-center gap-1.5 text-[var(--theme-accent)]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      personal.availableForHire
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    }`}
                  />
                  {personal.availableForHire
                    ? "Available for Roles & Internships"
                    : "Currently Engaged"}
                </span>
              )}

              {personal.location?.trim() && (
                <>
                  {personal.availableForHire !== null &&
                    personal.availableForHire !== undefined && (
                      <span className="text-slate-600">·</span>
                    )}
                  <span>Based in {personal.location}</span>
                </>
              )}

              <span className="text-slate-600">·</span>
              <span>ECE · Embedded Systems · IoT</span>
            </div>
          </div>

          {/* Right Column: Interactive Software Engineering Lab */}
          <div className="lg:col-span-5 relative w-full min-w-0 max-w-[560px] mx-auto lg:ml-auto">
            <CircuitVerse />
          </div>
        </div>
      </div>
    </section>
  );
}

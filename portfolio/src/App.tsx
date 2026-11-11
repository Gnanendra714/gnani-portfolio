/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PortfolioProvider,
  usePortfolio,
  THEME_PRESETS,
  PortfolioTheme,
} from "./context/PortfolioContext";
import CircuitTraceCursor from "./components/CircuitTraceCursor";

// Client Components (Clean Single-Page Architecture)
import { Navbar } from "./components/Navbar/Navbar";
import { HeroSection } from "./components/Hero/HeroSection";
import { AboutSection } from "./components/About/AboutSection";
import { SkillsSection } from "./components/Skills/SkillsSection";
import { HardwareWorkbench } from "./components/Workbench/HardwareWorkbench";
import { ProjectsSection } from "./components/Projects/ProjectsSection";
import { TimelineSection } from "./components/Journey/TimelineSection";
import { ConnectSection } from "./components/Contact/ConnectSection";
import { Footer } from "./components/Footer/Footer";
import { VisitorWelcomeModal } from "./components/VisitorModal/VisitorWelcomeModal";

// Interactive Modals & Overlays
import { ResumeModal } from "./components/Modals/ResumeModal";
import { CopilotChatDrawer } from "./components/Modals/CopilotChatDrawer";
import { TerminalModal } from "./components/Modals/TerminalModal";
import { JobMatchModal } from "./components/Modals/JobMatchModal";
import { MatrixRain } from "./components/Canvas/MatrixRain";
import { CircuitBackgroundCanvas } from "./components/Canvas/CircuitBackgroundCanvas";

import { sound } from "./utils/soundEffects";
import {
  CheckCircle2,
  Palette,
  Bot,
  Terminal,
  Briefcase,
  Code2,
} from "lucide-react";

const SECTIONS = [
  "home",
  "about",
  "skills",
  "workbench",
  "projects",
  "journey",
  "connect",
];
const NAVBAR_OFFSET = 72; // Height of fixed top navbar in pixels

function PortfolioApp() {
  const { currentTheme, setTheme } = usePortfolio();

  const [activeSection, setActiveSection] = useState<string>("home");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [jobMatchOpen, setJobMatchOpen] = useState(false);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock scroll spy updates during programmatic smooth scrolls to avoid jitter/flicker
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  /**
   * Smoothly navigates to a section with accurate navbar offset compensation.
   */
  const scrollToSection = useCallback((sectionId: string) => {
    sound.playClick();
    setActiveSection(sectionId);

    if (programmaticTimeoutRef.current) {
      clearTimeout(programmaticTimeoutRef.current);
    }
    isProgrammaticScrollRef.current = true;

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const targetTop = Math.max(
          0,
          el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET,
        );
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
      window.history.replaceState(null, "", `#${sectionId}`);
    }

    programmaticTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 850);
  }, []);

  /**
   * Initial page load:
   * 1. Disable browser auto scroll restoration so refreshed pages don't jump.
   * 2. If valid hash is in URL (e.g., #projects), scroll to it once mounted.
   * 3. If no hash or invalid hash, strictly start at (0, 0) on the Home section.
   */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const rawHash = window.location.hash.replace("#", "").trim().toLowerCase();
    const deepLinkTarget = SECTIONS.filter((s) => s !== "home").includes(
      rawHash,
    )
      ? rawHash
      : null;

    if (deepLinkTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(deepLinkTarget);
        if (el) {
          const targetTop = Math.max(
            0,
            el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET,
          );
          window.scrollTo({ top: targetTop, behavior: "smooth" });
          setActiveSection(deepLinkTarget);
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
      setActiveSection("home");
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  /**
   * Authoritative Scroll Spy
   */
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY < 120) {
        setActiveSection("home");
        return;
      }

      if (windowHeight + scrollY >= documentHeight - 80) {
        setActiveSection("connect");
        return;
      }

      const scrollPivot = scrollY + NAVBAR_OFFSET + 60;
      let currentSection = "home";

      for (const sectionId of SECTIONS) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPivot >= top && scrollPivot < top + height) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cycleTheme = () => {
    const order: PortfolioTheme[] = ["emerald", "sapphire", "amethyst"];
    const currIdx = order.indexOf(currentTheme);
    const nextTheme = order[(currIdx + 1) % order.length];
    setTheme(nextTheme);
    const themeName =
      THEME_PRESETS.find((t) => t.id === nextTheme)?.name || nextTheme;
    showToast(`Switched theme to ${themeName}!`);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-base)] text-slate-200 selection:bg-amber-400/20 selection:text-amber-200 transition-colors duration-500 relative">
      {/* First-time visitor welcome modal */}
      <VisitorWelcomeModal
        onWelcomeComplete={(name) =>
          showToast(`Welcome to Gnani's Portfolio, ${name}!`)
        }
      />

      {/* Dynamic Animated Cyber-Circuit Network Canvas with live current pulses */}
      <CircuitBackgroundCanvas />

      {/* Dynamic Theme Ambient Glows */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[160px] opacity-25 transition-all duration-700"
          style={{ backgroundColor: "rgb(var(--theme-accent-rgb))" }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full blur-[180px] opacity-15 transition-all duration-700"
          style={{ backgroundColor: "rgb(var(--theme-accent-light-rgb))" }}
        />
        <div
          className="absolute bottom-1/4 -left-48 w-[650px] h-[650px] rounded-full blur-[180px] opacity-15 transition-all duration-700"
          style={{ backgroundColor: "rgb(var(--theme-accent-dark-rgb))" }}
        />
      </div>

      {/* Fixed Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenResume={() => setResumeOpen(true)}
        onOpenConnect={() => scrollToSection("connect")}
      />

      {/* Seamless Single-Page Continuous Main Content (All 7 Sections) */}
      <main className="relative z-10">
        {/* 1. Hero Section (Home) */}
        <HeroSection
          onOpenResume={() => setResumeOpen(true)}
          onExploreProjects={() => scrollToSection("projects")}
          onOpenConnect={() => scrollToSection("connect")}
          onExploreWorkbench={() => scrollToSection("workbench")}
        />

        {/* 2. About & ECE Credentials Section */}
        <AboutSection />

        {/* 3. Technical Skills & Protocols Section */}
        <SkillsSection />

        {/* 4. Interactive IoT Hardware Workbench (ESP32 Simulator, Oscilloscope, Firmware) */}
        <HardwareWorkbench />

        {/* 5. Featured Projects & Architecture Section */}
        <ProjectsSection />

        {/* 6. Career Timeline & Milestones Section */}
        <TimelineSection />

        {/* 7. Connect & Contact Section */}
        <ConnectSection onShowToast={showToast} />
      </main>

      {/* Single-Page Global Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Engineering Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Recruiter & AI Copilot Drawer */}
      <CopilotChatDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      {/* Developer CLI Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onToggleMatrix={() => setMatrixOpen(!matrixOpen)}
        onNavigateSection={scrollToSection}
      />

      {/* AI Job Description Compatibility Matcher Modal */}
      <JobMatchModal
        isOpen={jobMatchOpen}
        onClose={() => setJobMatchOpen(false)}
      />

      {/* Matrix Green Digital Rain Overlay */}
      <MatrixRain isOpen={matrixOpen} onClose={() => setMatrixOpen(false)} />

      {/* Floating Left Controls (Quick Theme Cycle only - NO admin button in public app) */}
      <aside
        aria-label="Quick theme control"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2"
      >
        <button
          onClick={() => {
            sound.playKey();
            cycleTheme();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-card)] text-slate-200 border border-[var(--theme-border)] hover:border-amber-400/50 text-xs font-medium shadow-2xl backdrop-blur-md transition-all group active:scale-95 cursor-pointer"
          title="Click to cycle theme (changes entire background, colors & UI styling)"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
            style={{ backgroundColor: "rgb(var(--theme-accent-rgb))" }}
          />
          <Palette className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline capitalize font-mono text-[11px] text-amber-300">
            {currentTheme}
          </span>
        </button>
      </aside>

      {/* Floating Right Controls (AI Copilot, Terminal CLI, Job Matcher, Matrix Rain) */}
      <aside
        aria-label="Interactive AI and developer tools"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
      >
        {/* Matrix Rain Button */}
        <button
          onClick={() => {
            sound.playKey();
            setMatrixOpen(!matrixOpen);
          }}
          className={`hidden sm:flex items-center justify-center p-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            matrixOpen
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/60"
              : "bg-[var(--theme-bg-surface)] text-slate-400 hover:text-emerald-400 border-[var(--theme-border)]"
          }`}
          title="Toggle Hacker Matrix Rain"
          aria-label="Toggle Matrix Rain"
        >
          <Code2 className="w-4 h-4" />
        </button>

        {/* Terminal CLI Button */}
        <button
          onClick={() => {
            sound.playKey();
            setTerminalOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-card)] text-slate-300 hover:text-cyan-400 border border-[var(--theme-border)] hover:border-cyan-500/40 text-xs font-mono shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Open Gnani Developer CLI Terminal"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">CLI</span>
        </button>

        {/* Job Matcher Modal Button */}
        <button
          onClick={() => {
            sound.playClick();
            setJobMatchOpen(true);
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-card)] text-slate-300 hover:text-amber-400 border border-[var(--theme-border)] hover:border-amber-400/40 text-xs font-medium shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Evaluate Job Description Match"
        >
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">Match JD</span>
        </button>

        {/* AI Copilot Drawer Trigger */}
        <button
          onClick={() => {
            sound.playChirp();
            setCopilotOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          title="Chat with Gnani's AI Copilot"
        >
          <Bot className="w-4 h-4 text-slate-950" />
          <span>AI Copilot</span>
        </button>
      </aside>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--theme-bg-surface)] border border-amber-500/40 text-slate-100 shadow-2xl shadow-black animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <>
        <CircuitBackgroundCanvas />
        <CircuitTraceCursor />
        <PortfolioApp />
      </>
    </PortfolioProvider>
  );
}

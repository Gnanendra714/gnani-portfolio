import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  PORTFOLIO_DATA,
  Project,
  TimelineMilestone,
  SkillCategory,
} from '../data/portfolioData';

export interface StatItem {
  label: string;
  value: string;
  note: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}

export interface AboutPillarItem {
  id: string;
  title: string;
  icon: string;
  summary: string;
  details: string[];
  footerTag?: string;
}

export interface ConnectChannelItem {
  id: string;
  name: string;
  handle: string;
  description: string;
  url: string;
  icon?: string;
  actionLabel?: string;
}

export type PortfolioTheme = 'emerald' | 'sapphire' | 'amethyst' | 'cyan' | 'crimson' | 'amber';

export interface ThemeConfig {
  id: PortfolioTheme;
  name: string;
  tagline: string;
  accentColor: string;
  accentSecondary: string;
  bgColor: string;
  previewClass: string;
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'sapphire',
    name: 'Electric Sapphire (Default)',
    tagline: 'Deep Silicon Blue & Cosmic Indigo',
    accentColor: '#3b82f6',
    accentSecondary: '#60a5fa',
    bgColor: '#040d21',
    previewClass: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    tagline: 'Embedded IoT & High-Tech PCB Neon',
    accentColor: '#10b981',
    accentSecondary: '#34d399',
    bgColor: '#03140e',
    previewClass: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'amethyst',
    name: 'Neon Amethyst',
    tagline: 'Futuristic AI & Quantum Violet',
    accentColor: '#a855f7',
    accentSecondary: '#c084fc',
    bgColor: '#110621',
    previewClass: 'from-purple-500 to-fuchsia-400',
  },
  {
    id: 'cyan',
    name: 'Quantum Cyan',
    tagline: 'Laser Optics & Abyssal Tech',
    accentColor: '#06b6d4',
    accentSecondary: '#22d3ee',
    bgColor: '#02141f',
    previewClass: 'from-cyan-500 to-sky-400',
  },
  {
    id: 'crimson',
    name: 'Crimson Core',
    tagline: 'Robotics Ruby & Titanium Graphite',
    accentColor: '#f43f5e',
    accentSecondary: '#fb7185',
    bgColor: '#18040a',
    previewClass: 'from-rose-500 to-red-400',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    tagline: 'Warm Brass & Royal Obsidian',
    accentColor: '#f59e0b',
    accentSecondary: '#fbbf24',
    bgColor: '#150d03',
    previewClass: 'from-amber-500 to-yellow-400',
  },
];

export interface PublicPortfolioData {
  personal: typeof PORTFOLIO_DATA.personal;
  stats: StatItem[];
  aboutSection: {
    kicker: string;
    headline: string;
    workflowTitle: string;
    workflowSubtitle: string;
    workflowSteps: WorkflowStep[];
  };
  aboutPillars: AboutPillarItem[];
  skillsSection: {
    kicker: string;
    headline: string;
    description: string;
  };
  skills: SkillCategory[];
  projectsSection: {
    kicker: string;
    headline: string;
    description: string;
  };
  projects: Project[];
  timelineSection: {
    kicker: string;
    headline: string;
    description: string;
  };
  timeline: TimelineMilestone[];
  connectSection: {
    kicker: string;
    headline: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
  };
  connectChannels: ConnectChannelItem[];
  resume: {
    fullName: string;
    title: string;
    email: string;
    location: string;
    summary: string;
    degrees: {
      degree: string;
      institution: string;
      year: string;
      status: string;
    }[];
  };
}

interface PortfolioContextType {
  data: PublicPortfolioData;
  isLoading: boolean;
  isBackendConnected: boolean;
  currentTheme: PortfolioTheme;
  setTheme: (theme: PortfolioTheme) => void;
  refetchData: () => Promise<void>;
}

const fallbackState: PublicPortfolioData = {
  personal: PORTFOLIO_DATA.personal,
  stats: PORTFOLIO_DATA.stats,
  aboutSection: {
    kicker: 'ABOUT ME',
    headline: 'The Mind Behind the Machine',
    workflowTitle: 'The Cyber-Physical Workflow',
    workflowSubtitle: 'How Gnani bridges the gap between raw hardware signals and cloud software',
    workflowSteps: [
      { step: '01. Physical Layer', title: 'Sensors & Microcontrollers', desc: 'Analog/digital reading from sensors into ESP32 ADC & GPIOs.' },
      { step: '02. Firmware & Processing', title: 'Deterministic C++ Architecture', desc: 'Non-blocking loop architectures and ADC calibration.' },
      { step: '03. Connectivity & Edge', title: 'Protocols & Wireless Pipelines', desc: 'Publishing sensor payloads over Wi-Fi, MQTT, or serial UART.' },
      { step: '04. Cloud & Interface', title: 'Full-Stack Web Dashboards', desc: 'React 19 interfaces displaying real-time telemetry.' },
    ],
  },
  aboutPillars: PORTFOLIO_DATA.aboutPillars as AboutPillarItem[],
  skillsSection: {
    kicker: 'TECHNICAL ARSENAL',
    headline: 'Engineering Competencies & Protocols',
    description: 'Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.',
  },
  skills: PORTFOLIO_DATA.skills as SkillCategory[],
  projectsSection: {
    kicker: 'PORTFOLIO OF WORK',
    headline: 'Signature Engineering Deliverables',
    description: 'Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications.',
  },
  projects: PORTFOLIO_DATA.projects as Project[],
  timelineSection: {
    kicker: 'CAREER & EDUCATION',
    headline: 'Engineering Journey & Milestones',
    description: 'The progressive path from first circuit prototypes to enterprise web platforms and IoT systems.',
  },
  timeline: PORTFOLIO_DATA.timeline as TimelineMilestone[],
  connectSection: {
    kicker: 'GET IN TOUCH',
    headline: "Let's Connect and Build Together",
    description: 'Always open to discussing embedded systems, IoT architecture, or full-stack opportunities.',
    formTitle: 'Send a Direct Message',
    formSubtitle: 'Reach out directly for internships, collaborations, or hardware discussions.',
  },
  connectChannels: PORTFOLIO_DATA.connectChannels as ConnectChannelItem[],
  resume: {
    fullName: 'Gnanendra (Gnani)',
    title: 'Embedded Systems Engineer & Full-Stack Developer',
    email: 'gnanendra714@gmail.com',
    location: 'India',
    summary: 'B.Tech Electronics & Communication Engineering student with proven proficiency in ESP32, microcontrollers, embedded C++, circuit design, and full-stack software development.',
    degrees: [
      {
        degree: 'Bachelor of Technology (B.Tech) in Electronics & Communication Engineering',
        institution: 'NxtWave Intensive Engineering Academy & University',
        year: '2023 - 2026',
        status: 'Final Year Active',
      },
    ],
  },
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PublicPortfolioData>(fallbackState);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [currentTheme, setCurrentThemeState] = useState<PortfolioTheme>('sapphire');

  const refetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            personal: { ...prev.personal, ...json.data.personal },
            stats: json.data.stats || prev.stats,
            skills: json.data.skills || prev.skills,
            projects: json.data.projects || prev.projects,
            timeline: json.data.timeline || prev.timeline,
            connectChannels: json.data.connectChannels || prev.connectChannels,
          }));
          setIsBackendConnected(true);
        }
      }
    } catch (err) {
      console.warn('API /api/portfolio offline, using verified fallback data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchData();

    // Refetch when window regains focus (so changes saved in Admin dashboard immediately appear)
    const onFocus = () => {
      refetchData();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetchData]);

  // Theme application
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gnani_portfolio_theme') as PortfolioTheme;
      if (saved && THEME_PRESETS.some((t) => t.id === saved)) {
        setCurrentThemeState(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'sapphire');
      }
    } catch {
      // Ignored
    }
  }, []);

  const setTheme = (theme: PortfolioTheme) => {
    setCurrentThemeState(theme);
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('gnani_portfolio_theme', theme);
    } catch {
      // Ignored
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isBackendConnected,
        currentTheme,
        setTheme,
        refetchData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

import {
  PORTFOLIO_DATA,
  Project,
  TimelineMilestone,
  SkillCategory,
} from "../data/portfolioData";

// ============================================================
// INTERFACES
// ============================================================

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

export type PortfolioTheme = "sapphire" | "emerald" | "amethyst";

export interface ThemeConfig {
  id: PortfolioTheme;
  name: string;
  tagline: string;
  accentColor: string;
  accentSecondary: string;
  bgColor: string;
  previewClass: string;
}

// ============================================================
// THEME PRESETS
// ============================================================

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: "sapphire",
    name: "Electric Sapphire (Default)",
    tagline: "Deep Silicon Blue & Cosmic Indigo",
    accentColor: "#3b82f6",
    accentSecondary: "#60a5fa",
    bgColor: "#040d21",
    previewClass: "from-blue-500 to-cyan-400",
  },
  {
    id: "emerald",
    name: "Cyber Emerald",
    tagline: "Embedded IoT & High-Tech PCB Neon",
    accentColor: "#10b981",
    accentSecondary: "#34d399",
    bgColor: "#03140e",
    previewClass: "from-emerald-500 to-teal-400",
  },
  {
    id: "amethyst",
    name: "Neon Amethyst",
    tagline: "Futuristic AI & Quantum Violet",
    accentColor: "#a855f7",
    accentSecondary: "#c084fc",
    bgColor: "#110621",
    previewClass: "from-purple-500 to-fuchsia-400",
  },
];

// ============================================================
// PUBLIC PORTFOLIO DATA INTERFACE
// ============================================================

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

// ============================================================
// CONTEXT INTERFACE
// ============================================================

interface PortfolioContextType {
  data: PublicPortfolioData;
  isLoading: boolean;
  isBackendConnected: boolean;
  currentTheme: PortfolioTheme;
  setTheme: (theme: PortfolioTheme) => void;
  refetchData: () => Promise<void>;
}

// ============================================================
// STATIC FALLBACK DATA
// Used only when no MongoDB snapshot has ever been cached.
// ============================================================

const fallbackState: PublicPortfolioData = {
  personal: PORTFOLIO_DATA.personal,
  stats: PORTFOLIO_DATA.stats,

  aboutSection: {
    kicker: "ABOUT ME",
    headline: "The Mind Behind the Machine",
    workflowTitle: "The Cyber-Physical Workflow",
    workflowSubtitle:
      "How Gnani bridges the gap between raw hardware signals and cloud software",

    workflowSteps: [
      {
        step: "01. Physical Layer",
        title: "Sensors & Microcontrollers",
        desc: "Analog/digital reading from sensors into ESP32 ADC & GPIOs.",
      },
      {
        step: "02. Firmware & Processing",
        title: "Deterministic C++ Architecture",
        desc: "Non-blocking loop architectures and ADC calibration.",
      },
      {
        step: "03. Connectivity & Edge",
        title: "Protocols & Wireless Pipelines",
        desc: "Publishing sensor payloads over Wi-Fi, MQTT, or serial UART.",
      },
      {
        step: "04. Cloud & Interface",
        title: "Full-Stack Web Dashboards",
        desc: "React 19 interfaces displaying real-time telemetry.",
      },
    ],
  },

  aboutPillars: PORTFOLIO_DATA.aboutPillars as AboutPillarItem[],

  skillsSection: {
    kicker: "TECHNICAL ARSENAL",
    headline: "Engineering Competencies & Protocols",
    description:
      "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
  },

  skills: PORTFOLIO_DATA.skills as SkillCategory[],

  projectsSection: {
    kicker: "PORTFOLIO OF WORK",
    headline: "Signature Engineering Deliverables",
    description:
      "Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications.",
  },

  projects: PORTFOLIO_DATA.projects as Project[],

  timelineSection: {
    kicker: "CAREER & EDUCATION",
    headline: "Engineering Journey & Milestones",
    description:
      "The progressive path from first circuit prototypes to enterprise web platforms and IoT systems.",
  },

  timeline: PORTFOLIO_DATA.timeline as TimelineMilestone[],

  connectSection: {
    kicker: "GET IN TOUCH",
    headline: "Let's Connect and Build Together",
    description:
      "Always open to discussing embedded systems, IoT architecture, or full-stack opportunities.",
    formTitle: "Send a Direct Message",
    formSubtitle:
      "Reach out directly for internships, collaborations, or hardware discussions.",
  },

  connectChannels: PORTFOLIO_DATA.connectChannels as ConnectChannelItem[],

  resume: {
    fullName: "Gnanendra (Gnani)",
    title: "Embedded Systems Engineer & Full-Stack Developer",
    email: "gnanendra714@gmail.com",
    location: "India",
    summary:
      "B.Tech Electronics & Communication Engineering student with proven proficiency in ESP32, microcontrollers, embedded C++, circuit design, and full-stack software development.",

    degrees: [
      {
        degree:
          "Bachelor of Technology (B.Tech) in Electronics & Communication Engineering",
        institution: "NxtWave Intensive Engineering Academy & University",
        year: "2023 - 2026",
        status: "Final Year Active",
      },
    ],
  },
};

// ============================================================
// INDEXEDDB - LAST KNOWN GOOD MONGODB SNAPSHOT
// ============================================================

const PORTFOLIO_CACHE_DB = "gnani-portfolio-cache";
const PORTFOLIO_CACHE_STORE = "portfolio";
const PORTFOLIO_CACHE_KEY = "last-known-good";

function openPortfolioCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable in this browser."));
      return;
    }

    const request = indexedDB.open(PORTFOLIO_CACHE_DB, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PORTFOLIO_CACHE_STORE)) {
        db.createObjectStore(PORTFOLIO_CACHE_STORE);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      reject(new Error("Portfolio cache database opening was blocked."));
    };
  });
}

// Load the previously saved MongoDB snapshot.

async function loadCachedPortfolio(): Promise<PublicPortfolioData | null> {
  let db: IDBDatabase | null = null;

  try {
    db = await openPortfolioCache();

    return await new Promise((resolve, reject) => {
      const transaction = db!.transaction(PORTFOLIO_CACHE_STORE, "readonly");

      const request = transaction
        .objectStore(PORTFOLIO_CACHE_STORE)
        .get(PORTFOLIO_CACHE_KEY);

      request.onsuccess = () => {
        const result = request.result;

        if (
          result &&
          typeof result === "object" &&
          result.personal &&
          typeof result.personal === "object"
        ) {
          resolve(result as PublicPortfolioData);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db?.close();
        db = null;
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.warn("Unable to load portfolio cache:", error);
    return null;
  } finally {
    db?.close();
  }
}

// Save a complete, successfully retrieved MongoDB snapshot.

async function saveCachedPortfolio(
  portfolio: PublicPortfolioData,
): Promise<void> {
  const db = await openPortfolioCache();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(PORTFOLIO_CACHE_STORE, "readwrite");

      transaction
        .objectStore(PORTFOLIO_CACHE_STORE)
        .put(portfolio, PORTFOLIO_CACHE_KEY);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };

      transaction.onabort = () => {
        reject(transaction.error);
      };
    });
  } finally {
    db.close();
  }
}

// ============================================================
// REACT CONTEXT
// ============================================================

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

// ============================================================
// THEME APPLICATION
// ============================================================

function applyPortfolioTheme(theme: PortfolioTheme) {
  const selectedTheme = THEME_PRESETS.find((preset) => preset.id === theme);

  if (!selectedTheme) return;

  const root = document.documentElement;

  root.setAttribute("data-theme", theme);

  root.style.setProperty("--cursor-primary", selectedTheme.accentColor);

  root.style.setProperty("--cursor-secondary", selectedTheme.accentSecondary);

  root.style.setProperty("--cursor-glow", `${selectedTheme.accentColor}59`);
}

// ============================================================
// PORTFOLIO PROVIDER
// ============================================================

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PublicPortfolioData>(fallbackState);

  const [isLoading, setIsLoading] = useState(true);

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [currentTheme, setCurrentThemeState] =
    useState<PortfolioTheme>("sapphire");

  // ----------------------------------------------------------
  // FETCH LATEST MONGODB DATA
  // ----------------------------------------------------------

  const refetchData = useCallback(async () => {
    try {
      const res = await fetch(
        "https://gnani-portfolio-server.onrender.com/api/portfolio",
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(`Portfolio API returned HTTP ${res.status}`);
      }

      const json = await res.json();

      // Accept only a successful MongoDB response.
      if (
        json.success !== true ||
        json.source !== "mongodb" ||
        !json.data ||
        typeof json.data !== "object" ||
        !json.data.personal ||
        typeof json.data.personal !== "object"
      ) {
        throw new Error(
          "Invalid portfolio response or MongoDB data source unavailable.",
        );
      }

      const latestData = json.data as PublicPortfolioData;

      // Replace the complete state.
      // This preserves intentionally empty MongoDB values.
      setData(latestData);

      setIsBackendConnected(true);

      // Persist the new snapshot for offline access.
      try {
        await saveCachedPortfolio(latestData);
      } catch (cacheError) {
        console.error(
          "MongoDB data loaded, but IndexedDB cache could not be updated:",
          cacheError,
        );
      }
    } catch (error) {
      console.warn(
        "Portfolio backend unavailable. Retaining last-known-good data.",
        error,
      );

      setIsBackendConnected(false);

      // Do not overwrite the existing data.
      // The cached MongoDB snapshot remains available.
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ----------------------------------------------------------
  // INITIALIZE FROM CACHE, THEN FETCH FRESH DATA
  // ----------------------------------------------------------

  useEffect(() => {
    let active = true;

    const initializePortfolio = async () => {
      // First restore the previously saved MongoDB snapshot.
      const cachedData = await loadCachedPortfolio();

      if (!active) return;

      if (cachedData) {
        setData(cachedData);
      }

      // Then attempt to retrieve fresh MongoDB data.
      if (active) {
        await refetchData();
      }
    };

    void initializePortfolio();

    // Refresh when the browser tab becomes active again.
    const onFocus = () => {
      void refetchData();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      active = false;

      window.removeEventListener("focus", onFocus);
    };
  }, [refetchData]);

  // ----------------------------------------------------------
  // THEME INITIALIZATION
  // ----------------------------------------------------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "gnani_portfolio_theme",
      ) as PortfolioTheme | null;

      const validTheme = THEME_PRESETS.some((theme) => theme.id === saved);

      const initialTheme: PortfolioTheme = validTheme ? saved! : "sapphire";

      setCurrentThemeState(initialTheme);

      applyPortfolioTheme(initialTheme);

      if (!validTheme) {
        localStorage.setItem("gnani_portfolio_theme", "sapphire");
      }
    } catch {
      setCurrentThemeState("sapphire");

      applyPortfolioTheme("sapphire");
    }
  }, []);

  // ----------------------------------------------------------
  // CHANGE THEME
  // ----------------------------------------------------------

  const setTheme = (theme: PortfolioTheme) => {
    setCurrentThemeState(theme);

    applyPortfolioTheme(theme);

    try {
      localStorage.setItem("gnani_portfolio_theme", theme);
    } catch {
      // Ignore unavailable local storage.
    }
  };

  // ----------------------------------------------------------
  // CONTEXT PROVIDER
  // ----------------------------------------------------------

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

// ============================================================
// CUSTOM HOOK
// ============================================================

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }

  return context;
}

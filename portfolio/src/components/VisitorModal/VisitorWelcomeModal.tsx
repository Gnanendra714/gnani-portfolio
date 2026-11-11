import React, { useState, useEffect } from "react";
import { User, Sparkles, ArrowRight, ShieldCheck, X } from "lucide-react";
import { apiUrl } from "../../utils/api";

interface VisitorWelcomeModalProps {
  onWelcomeComplete?: (name: string) => void;
}

const STORAGE_KEY = "gnani_portfolio_visitor_id";
const NAME_STORAGE_KEY = "gnani_portfolio_visitor_name";

export function VisitorWelcomeModal({
  onWelcomeComplete,
}: VisitorWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const existingId = localStorage.getItem(STORAGE_KEY);
      const existingName = localStorage.getItem(NAME_STORAGE_KEY);

      if (existingId) {
        // Returning visitor: track visit asynchronously without showing modal
        fetch(apiUrl("/visitors"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: existingId,
            name: existingName || "Anonymous Visitor",
            referrer: document.referrer || "",
          }),
        }).catch((err) =>
          console.warn("Failed to update returning visitor:", err),
        );
      } else {
        // First-time visitor: Show modal after brief 600ms entrance
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is blocked in some environments, do not block the page
    }
  }, []);

  const handleRegister = async (guestMode = false) => {
    setSubmitting(true);
    setError(null);

    const chosenName =
      guestMode || !name.trim() ? "Guest Visitor" : name.trim();
    const visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      localStorage.setItem(STORAGE_KEY, visitorId);
      localStorage.setItem(NAME_STORAGE_KEY, chosenName);
    } catch {
      // Ignored
    }

    // Report to backend
    try {
      await fetch(apiUrl("/visitors"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          name: chosenName,
          referrer: document.referrer || "",
        }),
      });
    } catch (err) {
      console.warn("Visitor API recording offline or unavailable:", err);
    }

    setSubmitting(false);
    setIsOpen(false);
    if (onWelcomeComplete) {
      onWelcomeComplete(chosenName);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-welcome-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close / Skip button */}
        <button
          onClick={() => handleRegister(true)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          title="Skip and continue as guest"
          aria-label="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Emblem */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
              GNANI PORTFOLIO Â· WELCOME
            </span>
            <h2
              id="visitor-welcome-title"
              className="text-xl sm:text-2xl font-bold font-serif-display text-white"
            >
              Welcome! What should we call you?
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Glad to have you here! Enter your name or company so Gnani can
          personalize your experience across the IoT workbench and projects
          showcase.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister(false);
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="visitor-name-input"
              className="block text-xs font-mono text-slate-400 mb-1.5"
            >
              YOUR NAME OR COMPANY (OPTIONAL)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="visitor-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sarah (Tesla Recruiter) or Alex"
                maxLength={60}
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-500 outline-none transition-all font-sans"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{submitting ? "Entering..." : "Enter Portfolio"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleRegister(true)}
              className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Continue as Guest
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Zero cookies Â· No tracking beyond visit counts Â· Private
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}


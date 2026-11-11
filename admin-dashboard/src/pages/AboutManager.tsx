import React, { useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  CheckCircle2,
  GraduationCap,
  Cpu,
  Code2,
  Layers,
} from "lucide-react";
import { api } from "../services/api";

const initialData = {
  kicker: "ABOUT ME",
  headline: "Bridging Low-Level Silicon & High-Level Cloud",
  intro:
    "I'm Gnani, a B.Tech Electronics and Communication Engineering student interested in Embedded Systems, IoT, Artificial Intelligence and Full-Stack Development. I enjoy combining hardware and software to build practical engineering solutions.",
  pillars: [
    {
      title: "Academic Foundation",
      subtitle: "B.Tech in Electronics & Communication Engineering",
      description:
        "Building a foundation in electronics, circuit design, microprocessors and communication systems.",
    },
    {
      title: "Hardware Focus",
      subtitle: "ESP32 & Microcontroller Prototyping",
      description:
        "Developing embedded applications using microcontrollers, Embedded C, sensor interfacing, communication protocols and hardware-software integration.",
    },
    {
      title: "Software Focus",
      subtitle: "Full-Stack Development",
      description:
        "Building responsive web applications, backend services, REST APIs and database-driven applications.",
    },
  ],
};

const cardConfig = [
  {
    title: "Academic Foundation",
    icon: GraduationCap,
    border: "border-purple-500/30 hover:border-purple-400/60",
    iconStyle: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    badge: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    accent: "text-purple-400",
  },
  {
    title: "Hardware Focus",
    icon: Cpu,
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    iconStyle: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    accent: "text-cyan-400",
  },
  {
    title: "Software Focus",
    icon: Code2,
    border: "border-purple-500/30 hover:border-purple-400/60",
    iconStyle: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    badge: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    accent: "text-purple-400",
  },
];

export function AboutManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aboutData, setAboutData] = useState<any>(initialData);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getPortfolioData();

        if (res.success && res.data?.about) {
          const saved = res.data.about;

          setAboutData({
            ...initialData,
            ...saved,

            // Keep exactly three fixed cards.
            // Ignore any old items fields stored in MongoDB.
            pillars: initialData.pillars.map((defaultPillar, index) => {
              const savedPillar = saved.pillars?.[index] || {};

              return {
                ...defaultPillar,
                subtitle: savedPillar.subtitle || defaultPillar.subtitle,
                description:
                  savedPillar.description || defaultPillar.description,
                title: defaultPillar.title,
              };
            }),
          });
        }
      } catch (err) {
        console.warn("Failed to load About data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateField = (field: string, value: string) => {
    setAboutData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePillar = (
    index: number,
    field: "subtitle" | "description",
    value: string,
  ) => {
    setAboutData((prev: any) => {
      const pillars = [...prev.pillars];

      pillars[index] = {
        ...pillars[index],
        [field]: value,
      };

      return {
        ...prev,
        pillars,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setSavedSuccess(false);

    try {
      // Send only the fields used by the About portfolio section.
      const payload = {
        kicker: aboutData.kicker,
        headline: aboutData.headline,
        intro: aboutData.intro,
        pillars: aboutData.pillars.map((pillar: any, index: number) => ({
          title: cardConfig[index].title,
          subtitle: pillar.subtitle,
          description: pillar.description,
        })),
      };

      await api.updateAbout(payload);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="h-5 w-5 animate-spin text-purple-400" />
        <span className="font-mono text-xs">
          Loading About data from MongoDB...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">About Section CMS</h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your introduction and three engineering focus cards.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-400 sm:self-center">
            <CheckCircle2 className="h-4 w-4" />
            Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-7">
        {/* Introduction Editor */}
        <section className="overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/80 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <Layers className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Section Introduction</h2>
              <p className="text-xs text-slate-400">
                Main heading and introductory content
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
                Section Label
              </label>
              <input
                value={aboutData.kicker || ""}
                onChange={(e) => updateField("kicker", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
                Main Heading
              </label>
              <input
                value={aboutData.headline || ""}
                onChange={(e) => updateField("headline", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
                Introduction
              </label>
              <textarea
                rows={4}
                value={aboutData.intro || ""}
                onChange={(e) => updateField("intro", e.target.value)}
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>
        </section>

        {/* Three Engineering Focus Cards */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              Engineering Focus Cards
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Edit the heading and description displayed on your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {initialData.pillars.map((defaultPillar, index) => {
              const pillar = aboutData.pillars?.[index] || defaultPillar;
              const config = cardConfig[index];
              const Icon = config.icon;

              return (
                <section
                  key={config.title}
                  className={`
                    group flex min-w-0 flex-col overflow-hidden
                    rounded-3xl border bg-slate-900/80
                    shadow-xl backdrop-blur-md
                    transition-all duration-300
                    hover:-translate-y-1
                    ${config.border}
                  `}
                >
                  {/* Card Preview */}
                  <div className="flex flex-col items-center border-b border-slate-800/80 bg-slate-950/30 px-5 py-6 text-center">
                    <div
                      className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border ${config.iconStyle}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Card {index + 1} of 3
                    </span>
                  </div>

                  {/* Card Editor */}
                  <div className="flex flex-1 flex-col space-y-5 p-5">
                    <div>
                      <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
                        Card Heading
                      </label>
                      <input
                        value={pillar.subtitle || ""}
                        onChange={(e) =>
                          updatePillar(index, "subtitle", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={pillar.description || ""}
                        onChange={(e) =>
                          updatePillar(index, "description", e.target.value)
                        }
                        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                      />
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto border-t border-slate-800 pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-mono text-[10px] ${config.accent}`}
                        >
                          {config.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Portfolio Card
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col justify-end gap-3 border-t border-slate-800 pt-5 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="
              flex items-center justify-center gap-2
              rounded-xl border border-purple-400/30
              bg-gradient-to-r from-purple-500 to-violet-600
              px-7 py-3.5 text-xs font-bold uppercase tracking-wider
              text-white shadow-lg shadow-purple-500/20
              transition hover:from-purple-400 hover:to-violet-500
              active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save About Section"}
          </button>
        </div>
      </form>
    </div>
  );
}

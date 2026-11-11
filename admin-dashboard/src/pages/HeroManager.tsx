import React, { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  CheckCircle2,
  User,
  Zap,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";

export function HeroManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "Gnani",
    fullName: "Gnanendra",
    roleTag: "ELECTRONICS & EMBEDDED SYSTEMS ENGINEER",
    roles: [],
    shortBio: "",
    extendedBio: "",
    email: "",
    location: "",
    github: "",
    linkedin: "",
    youtube: "",
    availableForHire: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getPortfolioData();
      if (res.success && res.data?.personal) {
        setFormData({
          ...res.data.personal,
          roles: res.data.personal.roles || [],
        });
      }
    } catch (err) {
      console.warn("Failed to load hero data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateHero(formData);
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
      <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
        <span>Loading Hero data from MongoDB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-display text-white">
            Hero & Identity CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure primary headlines, typewriter roles, and availability
            status rendered on the public landing page.
          </p>
        </div>
        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved to MongoDB Atlas</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Full Legal / Formal Name
              </label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Header Role Tagline
            </label>
            <input
              type="text"
              value={formData.roleTag || ""}
              onChange={(e) =>
                setFormData({ ...formData, roleTag: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none font-mono"
            />
          </div>

          {/* Animated Hero Roles */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Animated Hero Roles
            </label>

            <textarea
              rows={3}
              value={(formData.roles || []).join("\n")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roles: e.target.value
                    .split("\n")
                    .map((role: string) => role.trim())
                    .filter(Boolean),
                })
              }
              placeholder={`Embedded Systems Developer
                            Arduino & ESP32 Developer
                            IoT Solutions Creator
                            AI Integration Enthusiast`}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none resize-y leading-relaxed font-mono"
            />

            <p className="text-xs text-slate-500 mt-1.5">
              Enter one role per line. Leave empty to hide the animated text.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Short Hero Summary
            </label>
            <textarea
              rows={3}
              value={formData.shortBio || ""}
              onChange={(e) =>
                setFormData({ ...formData, shortBio: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Available for Hire?
              </label>
              <select
                value={formData.availableForHire ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableForHire: e.target.value === "true",
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-sm text-white outline-none"
              >
                <option value="true">Available for Roles & Internships</option>
                <option value="false">Currently Engaged</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving to MongoDB..." : "Save Hero Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

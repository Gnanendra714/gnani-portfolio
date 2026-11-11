import React, { useState, useEffect } from 'react';
import { Mail, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export function ConnectManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [connectData, setConnectData] = useState<any>({
    kicker: 'GET IN TOUCH',
    headline: "Let's Connect and Build Together",
    description: '',
    formTitle: 'Send a Direct Message',
    formSubtitle: '',
    email: 'gnanendra714@gmail.com',
    location: 'India',
    channels: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getPortfolioData();
      if (res.success && res.data?.connect) {
        setConnectData(res.data.connect);
      }
    } catch (err) {
      console.warn('Failed to load connect data:', err);
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
    try {
      await api.updateConnect(connectData);
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
        <span>Loading Connect data from MongoDB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-display text-white">Connect & Contact Channels CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Update primary contact email, form titles, and social channels (GitHub, LinkedIn, YouTube).
          </p>
        </div>
        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved to MongoDB Atlas</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Headline</label>
              <input
                type="text"
                value={connectData.headline || ''}
                onChange={(e) => setConnectData({ ...connectData, headline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Primary Email Address</label>
              <input
                type="email"
                value={connectData.email || ''}
                onChange={(e) => setConnectData({ ...connectData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Contact Description</label>
            <textarea
              rows={2}
              value={connectData.description || ''}
              onChange={(e) => setConnectData({ ...connectData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Connect Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

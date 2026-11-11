import React, { useState, useEffect } from 'react';
import { Milestone, Plus, Trash2, Edit2, Check, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export function JourneyManager() {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadJourney = async () => {
    setLoading(true);
    try {
      const res = await api.getJourney();
      if (res.success) {
        setTimeline(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load journey:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete milestone "${title}"?`)) return;
    try {
      await api.deleteJourney(id);
      setTimeline((prev) => prev.filter((m) => (m._id || m.id) !== id));
      showToast('Milestone deleted');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMilestone.isNew) {
        const res = await api.createJourney(editingMilestone);
        if (res.success && res.data) {
          setTimeline((prev) => [...prev, res.data]);
          showToast('Milestone added!');
        }
      } else {
        const id = editingMilestone._id || editingMilestone.id;
        const res = await api.updateJourney(id, editingMilestone);
        if (res.success && res.data) {
          setTimeline((prev) => prev.map((m) => ((m._id || m.id) === id ? res.data : m)));
          showToast('Milestone updated!');
        }
      }
      setEditingMilestone(null);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-display text-white">Journey & Career Milestones CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage academic degrees, internships, and engineering breakthroughs rendered on the timeline.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingMilestone({
              isNew: true,
              year: `${new Date().getFullYear()}`,
              title: '',
              subtitle: '',
              summary: '',
              story: '',
              technologies: [],
              achievements: [],
              published: true,
            })
          }
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-4">
        {timeline.map((m) => (
          <div
            key={m._id || m.id || m.year}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-bold text-xs">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-white font-serif-display">{m.title}</h3>
                <span className="text-xs text-slate-400">· {m.subtitle}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">{m.summary}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditingMilestone({ ...m, isNew: false })}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(m._id || m.id, m.title)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingMilestone && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="journey-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
            <button
              onClick={() => setEditingMilestone(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 id="journey-modal-title" className="text-xl font-bold font-serif-display text-white">
              {editingMilestone.isNew ? 'Add Milestone' : `Edit: ${editingMilestone.title}`}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.year || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingMilestone.subtitle || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingMilestone.summary || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Detailed Story</label>
                <textarea
                  rows={4}
                  value={editingMilestone.story || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, story: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

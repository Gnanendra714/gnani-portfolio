import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Calendar, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck, Eye } from 'lucide-react';
import { api } from '../services/api';

export function VisitorsManager() {
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalVisitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    totalVisits: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchVisitors = async (targetPage = page, searchTerm = search) => {
    setLoading(true);
    try {
      const res = await api.getVisitors({ page: targetPage, limit: 15, search: searchTerm });
      if (res.success) {
        setVisitors(res.visitors || []);
        if (res.stats) setStats(res.stats);
        if (res.pagination) setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.warn('Failed to fetch visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors(1, search);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVisitors(1, search);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-display text-white">Visitor Analytics & Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of unique visitors, returning sessions, and first-time visitor names stored in MongoDB.
          </p>
        </div>
        <button
          onClick={() => fetchVisitors(page, search)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Visitors</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.totalVisitors}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">New Visitors</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.newVisitors}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Returning</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{stats.returningVisitors}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Sessions</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{stats.totalVisits}</div>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search visitor name or ID..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white placeholder-slate-500 outline-none"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Visitor Name</th>
                <th className="py-3.5 px-4">Visitor ID</th>
                <th className="py-3.5 px-4 text-center">Visits</th>
                <th className="py-3.5 px-4">First Seen</th>
                <th className="py-3.5 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                    {loading ? 'Loading visitor logs from MongoDB Atlas...' : 'No visitor records found.'}
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v._id || v.visitorId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                          {v.name?.charAt(0)?.toUpperCase() || 'V'}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{v.name || 'Anonymous Visitor'}</span>
                          {v.visitCount > 1 && (
                            <span className="text-[10px] text-emerald-400 font-mono">Returning Guest</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {v.visitorId}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                      {v.visitCount || 1}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {v.firstVisit ? new Date(v.firstVisit).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {v.lastVisit ? new Date(v.lastVisit).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prev = Math.max(1, page - 1);
                setPage(prev);
                fetchVisitors(prev);
              }}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                setPage(next);
                fetchVisitors(next);
              }}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

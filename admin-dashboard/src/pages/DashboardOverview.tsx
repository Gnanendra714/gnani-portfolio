import { useState, useEffect } from "react";
import {
  Users,
  FolderGit2,
  Bell,
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  RefreshCw,
  ExternalLink,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import { AdminSection } from "../layouts/AdminLayout";

interface DashboardOverviewProps {
  onNavigate: (section: AdminSection) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>({
    totalVisitors: 0,
    returningVisitors: 0,
    newVisitors: 0,
    totalProjects: 0,
    publishedProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setSummary(res.summary);
        setRecentVisitors(res.recentVisitors || []);
        setRecentMessages(res.recentMessages || []);
      }
    } catch (err) {
      console.warn("Dashboard summary load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-cyan-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE ADMIN SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
            Welcome, Gnani
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            All changes saved here synchronize directly to your MongoDB Atlas
            cluster and immediately update the public portfolio website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Refresh Metrics"
            aria-label="Refresh metrics"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`}
            />
          </button>
          <a
            href="https://gnanendraganne.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Visitors */}
        <div
          onClick={() => onNavigate("visitors")}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Total Visitors
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {summary.totalVisitors}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">
              {summary.newVisitors} new
            </span>
            <span>·</span>
            <span>{summary.returningVisitors} returning</span>
          </div>
        </div>

        {/* Card 2: Projects */}
        <div
          onClick={() => onNavigate("projects")}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Projects & Demos
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {summary.totalProjects}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-amber-400 font-semibold">
              {summary.publishedProjects} published
            </span>
            <span>·</span>
            <span>{summary.draftProjects || 0} drafts</span>
          </div>
        </div>

        {/* Card 3: Messages */}
        <div
          onClick={() => onNavigate("messages")}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Inquiries & Contact
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {summary.totalMessages}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            {summary.unreadMessages > 0 ? (
              <span className="text-rose-400 font-semibold">
                {summary.unreadMessages} unread messages
              </span>
            ) : (
              <span className="text-emerald-400">All caught up</span>
            )}
          </div>
        </div>

        {/* Card 4: Quick Launch Workbench */}
        <div
          onClick={() => onNavigate("hero")}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Content CMS
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white mb-1">
            Edit Hero & Biography
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Update role headlines, location, and social links instantly.
          </p>
        </div>
      </div>

      {/* 2-Column Feeds: Recent Visitors & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visitors */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-serif-display">
                Recent Visitors
              </h2>
            </div>
            <button
              onClick={() => onNavigate("visitors")}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentVisitors.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center font-mono">
              No visitor activity recorded yet. First-time visitors will appear
              here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentVisitors.map((v, i) => (
                <div
                  key={v._id || v.visitorId || i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">
                      {v.name || "Anonymous Visitor"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {v.visitorId?.slice(0, 14)}... · {v.visitCount} visits
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {v.lastVisit
                      ? new Date(v.lastVisit).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-serif-display">
                Recent Messages
              </h2>
            </div>
            <button
              onClick={() => onNavigate("messages")}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center font-mono">
              No inquiries submitted yet. Contact form submissions will appear
              here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m, i) => (
                <div
                  key={m._id || m.id || i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{m.name}</span>
                      {m.status === "unread" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {m.subject}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleDateString()
                      : "Just now"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

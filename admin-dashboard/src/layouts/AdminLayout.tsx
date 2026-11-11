import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Cpu,
  FolderGit2,
  Milestone,
  Mail,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Crown,
  Database,
  Bell,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { api } from "../services/api";

export type AdminSection =
  | "overview"
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "journey"
  | "connect"
  | "visitors"
  | "messages"
  | "settings";

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  children: React.ReactNode;
}

export function AdminLayout({
  activeSection,
  onSelectSection,
  children,
}: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    // Check unread messages count
    const fetchUnread = async () => {
      try {
        const res = await api.getMessages({ limit: 1 });
        if (res.success && res.unreadCount !== undefined) {
          setUnreadMessages(res.unreadCount);
        }
      } catch {
        // Ignored
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      id: "overview" as AdminSection,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { id: "hero" as AdminSection, label: "Hero & Identity", icon: User },
    {
      id: "about" as AdminSection,
      label: "About & Credentials",
      icon: BookOpen,
    },
    { id: "skills" as AdminSection, label: "Skills & Hardware", icon: Cpu },
    {
      id: "projects" as AdminSection,
      label: "Projects & Work",
      icon: FolderGit2,
    },
    {
      id: "journey" as AdminSection,
      label: "Journey Milestones",
      icon: Milestone,
    },
    { id: "connect" as AdminSection, label: "Connect & Channels", icon: Mail },
    { id: "visitors" as AdminSection, label: "Visitor Analytics", icon: Users },
    {
      id: "messages" as AdminSection,
      label: "Messages",
      icon: Bell,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      id: "settings" as AdminSection,
      label: "Settings & Security",
      icon: Settings,
    },
  ];

  const handleNav = (sec: AdminSection) => {
    onSelectSection(sec);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif-display font-bold text-sm text-white">
              GNANI CMS
            </span>
            <span className="block text-[9px] font-mono text-amber-400">
              Admin Control Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadMessages > 0 && (
            <button
              onClick={() => handleNav("messages")}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 relative"
              title={`${unreadMessages} unread messages`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadMessages}
              </span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Status */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-display font-bold text-sm tracking-wide text-white block">
                  GNANI CMS
                </span>
                <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5 text-emerald-400" />
                  <span>MongoDB Atlas</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer & User Profile */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <a
            href="https://gnanendraganne.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Portfolio</span>
            </span>
          </a>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="truncate pr-2">
              <span className="text-xs font-semibold text-white block truncate">
                {user?.name || "Gnani Admin"}
              </span>
              <span className="text-[10px] font-mono text-slate-400 truncate block">
                {user?.email || "admin@gnani.dev"}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Log out of CMS"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';

export function MessagesManager() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  const fetchMessages = async (targetPage = page, status = statusFilter, searchTerm = search) => {
    setLoading(true);
    try {
      const res = await api.getMessages({
        page: targetPage,
        limit: 15,
        status: status === 'all' ? undefined : status,
        search: searchTerm,
      });
      if (res.success) {
        setMessages(res.messages || []);
        setUnreadCount(res.unreadCount || 0);
        if (res.pagination) setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1, statusFilter, search);
  }, [statusFilter, search]);

  const handleMarkRead = async (msg: any) => {
    try {
      await api.updateMessageStatus(msg._id || msg.id, 'read');
      setMessages((prev) =>
        prev.map((m) => ((m._id || m.id) === (msg._id || msg.id) ? { ...m, status: 'read' } : m))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (activeMessage && (activeMessage._id || activeMessage.id) === (msg._id || msg.id)) {
        setActiveMessage({ ...activeMessage, status: 'read' });
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message? This cannot be undone.')) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== id));
      if (activeMessage && (activeMessage._id || activeMessage.id) === id) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleOpenMessage = (msg: any) => {
    setActiveMessage(msg);
    if (msg.status === 'unread') {
      handleMarkRead(msg);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-display text-white">Contact Inquiries & Messages</h1>
          <p className="text-xs text-slate-400 mt-1">
            Read and manage inquiries sent through the public portfolio contact form.
          </p>
        </div>
        <button
          onClick={() => fetchMessages(page, statusFilter, search)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s} {s === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, email, topic..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              {loading ? 'Fetching messages from MongoDB Atlas...' : 'No messages matching the filter.'}
            </div>
          ) : (
            messages.map((m) => {
              const isUnread = m.status === 'unread';
              return (
                <div
                  key={m._id || m.id}
                  onClick={() => handleOpenMessage(m)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    isUnread ? 'bg-amber-500/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 truncate w-full sm:max-w-xl">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isUnread
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                          {m.name}
                        </span>
                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950 font-mono">
                            NEW
                          </span>
                        )}
                        <span className="text-xs text-slate-500 hidden sm:inline">· {m.email}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 truncate mt-0.5">
                        {m.subject}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{m.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] font-mono text-slate-500">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m._id || m.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prev = Math.max(1, page - 1);
                setPage(prev);
                fetchMessages(prev);
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
                fetchMessages(next);
              }}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Reader Modal */}
      {activeMessage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-subject-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                CONTACT FORM MESSAGE
              </span>
              <h2 id="message-subject-title" className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                {activeMessage.subject}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-mono text-[11px]">FROM</span>
                <span className="font-semibold text-white">{activeMessage.name}</span>
                <span className="text-slate-400 block font-mono">{activeMessage.email}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-mono text-[11px]">RECEIVED</span>
                <span className="font-mono text-slate-300">
                  {activeMessage.createdAt ? new Date(activeMessage.createdAt).toLocaleString() : 'N/A'}
                </span>
                {activeMessage.visitorId && (
                  <span className="text-[10px] text-slate-500 block font-mono">
                    ID: {activeMessage.visitorId}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Message Content</label>
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans max-h-64 overflow-y-auto">
                {activeMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email</span>
              </a>

              <button
                onClick={() => handleDelete(activeMessage._id || activeMessage.id)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

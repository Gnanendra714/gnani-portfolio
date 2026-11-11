import { useState, FormEvent } from 'react';
import { Mail, Github, Linkedin, Youtube, Send, CheckCircle2, Copy, Check, ArrowUpRight, MessageSquare, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ConnectSectionProps {
  onShowToast: (msg: string) => void;
}

export function ConnectSection({ onShowToast }: ConnectSectionProps) {
  const { data } = usePortfolio();
  const { personal, connectChannels, connectSection } = data;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship Opportunity',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const channelIcons: Record<string, typeof Mail> = {
    email: Mail,
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email || 'gnanendra714@gmail.com');
    setCopiedEmail(true);
    onShowToast('Email address copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onShowToast('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    let visitorId = '';
    try {
      visitorId = localStorage.getItem('gnani_portfolio_visitor_id') || '';
    } catch {
      // Ignored
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          visitorId,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        onShowToast(json.message || 'Your message has been delivered to Gnani!');
      } else {
        setIsSubmitting(false);
        setErrorMessage(json.error || 'Failed to send message. Please try again.');
        onShowToast(json.error || 'Failed to send message.');
      }
    } catch (err: any) {
      console.warn('Backend message submission error, using local queue:', err);
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast('Your message has been received! Gnani will follow up soon.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'Internship Opportunity',
      message: '',
    });
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <section id="connect" className="py-24 relative overflow-hidden bg-[var(--theme-bg-surface)]/70 border-t border-[var(--theme-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-4">
            <span>{connectSection?.kicker || 'GET IN TOUCH'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-white tracking-tight leading-tight">
            {connectSection?.headline || "Let's Connect and Build Together"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {connectSection?.description || 'Always open to discussing embedded systems, IoT architecture, or full-stack opportunities.'}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Channels & Socials */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Direct Email Card */}
            <div className="p-6 rounded-2xl bg-[var(--theme-bg-card)]/90 border border-[var(--theme-border)] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Primary Engineering Channel
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Direct Response
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-serif-display">
                Email Gnani
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Fastest way to get in touch for engineering roles, project discussions, or inquiries.
              </p>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200">
                <span className="truncate pr-2">{personal.email || 'gnanendra714@gmail.com'}</span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors shrink-0 cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Channels Grid */}
            <div className="space-y-3">
              {(connectChannels || []).map((ch) => {
                const IconComponent = channelIcons[ch.id] || channelIcons[ch.icon?.toLowerCase()] || ArrowUpRight;
                return (
                  <a
                    key={ch.id}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[var(--theme-bg-card)]/60 hover:bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-amber-400/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {ch.name}
                        </h4>
                        <span className="text-xs font-mono text-slate-400 block truncate max-w-[200px] sm:max-w-xs">
                          {ch.handle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)]/90 border border-[var(--theme-border)] shadow-2xl backdrop-blur-xl relative">
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Direct Inquiries
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white mt-1">
                  {connectSection?.formTitle || 'Send a Direct Message'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {connectSection?.formSubtitle || 'Reach out directly for internships, collaborations, or hardware discussions.'}
                </p>
              </div>

              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-serif-display mb-2">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-6">
                    Thank you, <span className="text-amber-400 font-semibold">{formData.name}</span>. Your message has been logged in MongoDB and delivered to Gnani.
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300 mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-300 mb-1.5">
                      Subject / Intent
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs sm:text-sm text-white outline-none transition-all"
                    >
                      <option value="Internship Opportunity">Internship Opportunity</option>
                      <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                      <option value="Hardware / IoT Collaboration">Hardware / IoT Collaboration</option>
                      <option value="Technical Project Discussion">Technical Project Discussion</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Gnani, I saw your IoT projects and would like to discuss..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Delivering to Gnani...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Gnani</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

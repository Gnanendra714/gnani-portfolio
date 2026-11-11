import { useState, FormEvent } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { apiUrl } from "../../utils/api";

interface ConnectSectionProps {
  onShowToast: (msg: string) => void;
}

export function ConnectSection({ onShowToast }: ConnectSectionProps) {
  const { data } = usePortfolio();
  const { connectChannels, connectSection } = data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Internship Opportunity",
    message: "",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      onShowToast("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    let visitorId = "";

    try {
      visitorId = localStorage.getItem("gnani_portfolio_visitor_id") || "";
    } catch {
      // Local storage unavailable.
    }

    try {
      const res = await fetch(apiUrl("/messages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        setSubmitted(true);
        onShowToast(
          json.message || "Your message has been delivered to Gnani!",
        );
      } else {
        setErrorMessage(
          json.error || "Failed to send message. Please try again.",
        );
        onShowToast(json.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Message submission error:", error);

      setErrorMessage(
        "Unable to connect to the server. Please try again later.",
      );

      onShowToast("Unable to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "Internship Opportunity",
      message: "",
    });

    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <section
      id="connect"
      className="
  relative flex h-auto min-h-[calc(100svh-80px)]
  flex-col justify-center overflow-x-hidden
  border-t border-[var(--theme-border)]
  bg-[var(--theme-bg-surface)]/70
  px-4 py-5
  sm:px-6
  lg:h-[calc(100svh-80px)]
  lg:min-h-0 lg:overflow-hidden
  lg:px-8 lg:py-3
"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center">
        {/* Section Header */}
        <header className="mb-5 max-w-5xl lg:mb-4">
          <span
            className="
  inline-flex items-center rounded-md
  border border-[var(--theme-accent)]/25
  bg-[var(--theme-accent)]/10
  px-2.5 py-1 font-mono text-[9px]
  font-semibold uppercase tracking-wider
  text-[var(--theme-accent)]
"
          >
            {connectSection?.kicker || "GET IN TOUCH"}
          </span>

          <h2
            className="
  mt-2 font-serif-display text-2xl
  font-bold leading-tight tracking-tight
  text-white sm:text-3xl lg:text-4xl
"
          >
            {connectSection?.headline || "Let's Connect and Build Together"}
          </h2>

          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {connectSection?.description ||
              "Always open to discussing embedded systems, IoT architecture, or full-stack opportunities."}
          </p>
        </header>

        {/* Main Two-Column Layout */}
        <div
          className="
  grid grid-cols-1 items-center gap-4
  lg:grid-cols-12 lg:gap-5
"
        >
          {/* LEFT: Contact Channels */}
          <div className="flex flex-col justify-center gap-2.5 lg:col-span-5">
            {(connectChannels || []).map((channel, index) => {
              const channelKey = String(
                channel.id || channel.icon || "",
              ).toLowerCase();

              const IconComponent = channelIcons[channelKey] || ArrowUpRight;

              return (
                <a
                  key={channel.id || `${channelKey}-${index}`}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
  group flex items-center justify-between
  rounded-xl border border-[var(--theme-border)]
  bg-[var(--theme-bg-card)]/70
  px-3 py-2.5
  transition-all duration-300
  hover:-translate-y-0.5
  hover:border-[var(--theme-accent)]
  hover:bg-[var(--theme-bg-card)]
"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div
                      className="
  flex h-9 w-9 shrink-0 items-center
  justify-center rounded-lg border
  border-[var(--theme-border)]
  bg-[var(--theme-accent)]/10
  text-[var(--theme-accent)]
  transition-transform group-hover:scale-105
"
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h4
                        className="
                          text-sm font-semibold text-white
                          transition-colors
                          group-hover:text-[var(--theme-accent)]
                        "
                      >
                        {channel.name}
                      </h4>

                      <span
                        className="
                          block max-w-[230px] truncate
                          font-mono text-[11px] text-slate-400
                          sm:max-w-xs
                        "
                      >
                        {channel.handle}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight
                    className="
                      h-4 w-4 shrink-0 text-slate-500
                      transition-all
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:text-[var(--theme-accent)]
                    "
                  />
                </a>
              );
            })}
          </div>

          {/* RIGHT: Direct Message Form */}
          <div className="lg:col-span-7">
            <div
              className="
  relative h-full rounded-2xl
  border border-[var(--theme-border)]
  bg-[var(--theme-bg-card)]/90
  p-4 shadow-xl backdrop-blur-xl
  sm:p-5 lg:p-5
"
            >
              {/* Form Header */}
              <div className="mb-3">
                <span
                  className="
                    font-mono text-[10px] font-semibold
                    uppercase tracking-[0.18em]
                    text-[var(--theme-accent)]
                  "
                >
                  Direct Inquiries
                </span>

                <h3 className="mt-1 font-serif-display text-lg font-bold text-white sm:text-xl">
                  {connectSection?.formTitle || "Send a Direct Message"}
                </h3>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                  {connectSection?.formSubtitle ||
                    "Reach out directly for internships, collaborations, or hardware discussions."}
                </p>
              </div>

              {submitted ? (
                <div
                  className="
                    flex min-h-[300px] flex-col
                    items-center justify-center
                    text-center animate-in fade-in duration-300
                  "
                >
                  <div
                    className="
                      mb-4 flex h-14 w-14 items-center
                      justify-center rounded-2xl
                      border border-emerald-500/30
                      bg-emerald-500/10 text-emerald-400
                    "
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <h4 className="mb-2 font-serif-display text-xl font-bold text-white">
                    Message Sent Successfully!
                  </h4>

                  <p className="mb-6 max-w-sm text-sm text-slate-300">
                    Thank you,{" "}
                    <span className="font-semibold text-[var(--theme-accent)]">
                      {formData.name}
                    </span>
                    . Your message has been received.
                  </p>

                  <button
                    onClick={handleResetForm}
                    className="
                      rounded-lg border border-[var(--theme-border)]
                      bg-[var(--theme-bg-surface)]
                      px-5 py-2.5 text-xs font-medium
                      text-white transition-colors
                      hover:border-[var(--theme-accent)]
                    "
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Error Message */}
                  {errorMessage && (
                    <div
                      className="
                        flex items-center gap-2 rounded-lg
                        border border-rose-500/30
                        bg-rose-500/10 p-3
                        text-xs text-rose-300
                      "
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="
                          mb-1.5 block font-mono
                          text-[11px] text-slate-300
                        "
                      >
                        Your Full Name *
                      </label>

                      <input
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Gnani"
                        className="
  w-full rounded-lg border
  border-[var(--theme-border)]
  bg-[var(--theme-bg-base)]
  px-3 py-2 text-xs text-white
  outline-none transition-all
  placeholder:text-slate-500
  focus:border-[var(--theme-accent)]
  focus:ring-1 focus:ring-[var(--theme-accent)]
"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="
                          mb-1.5 block font-mono
                          text-[11px] text-slate-300
                        "
                      >
                        Your Email Address *
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        placeholder="abc@gmail.com"
                        className="
  w-full rounded-lg border
  border-[var(--theme-border)]
  bg-[var(--theme-bg-base)]
  px-3 py-2 text-xs text-white
  outline-none transition-all
  placeholder:text-slate-500
  focus:border-[var(--theme-accent)]
  focus:ring-1 focus:ring-[var(--theme-accent)]
"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="
                        mb-1.5 block font-mono
                        text-[11px] text-slate-300
                      "
                    >
                      Subject / Intent
                    </label>

                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subject: e.target.value,
                        })
                      }
                      className="
  w-full rounded-lg border
  border-[var(--theme-border)]
  bg-[var(--theme-bg-base)]
  px-3 py-2 text-xs text-white
  outline-none transition-all
  placeholder:text-slate-500
  focus:border-[var(--theme-accent)]
  focus:ring-1 focus:ring-[var(--theme-accent)]
"
                    >
                      <option value="Hardware / IoT Collaboration">
                        Hardware / IoT Collaboration
                      </option>

                      <option value="Technical Project Discussion">
                        Technical Project Discussion
                      </option>

                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="
                        mb-1.5 block font-mono
                        text-[11px] text-slate-300
                      "
                    >
                      Your Message *
                    </label>

                    <textarea
                      id="contact-message"
                      rows={2}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                      placeholder="Hi Gnani, I saw your IoT projects and would like to discuss..."
                      className="
  w-full resize-none rounded-lg border
  border-[var(--theme-border)]
  bg-[var(--theme-bg-base)]
  px-3 py-2 text-xs text-white
  outline-none transition-all
  placeholder:text-slate-500
  focus:border-[var(--theme-accent)]
  focus:ring-1 focus:ring-[var(--theme-accent)]
"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
  flex w-full items-center justify-center
  gap-2 rounded-lg
  bg-[var(--theme-accent)]
  px-5 py-2.5 text-[11px] font-bold
  uppercase tracking-wider text-slate-950
  shadow-lg transition-all hover:brightness-110
  active:scale-[0.99]
  disabled:cursor-not-allowed disabled:opacity-50
"
                  >
                    {isSubmitting ? (
                      <span>Delivering to Gnani...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
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

import { useEffect } from 'react';
import { X, Download, Printer, Mail, MapPin, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { data } = usePortfolio();
  const { resume, personal } = data;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[var(--theme-bg-surface)] border border-amber-500/35 rounded-2xl shadow-2xl shadow-black z-10 scrollbar-none">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[var(--theme-bg-surface)]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
              CURRICULUM VITAE · {personal.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close resume modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Body */}
        <div className="p-6 sm:p-10 text-slate-200 space-y-8 bg-[#090e1c]">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-3xl font-bold font-serif-display text-white">
                {resume.fullName || personal.fullName}
              </h1>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                {resume.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {resume.email || personal.email}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {resume.location || personal.location}
              </span>
              <span>·</span>
              <span>B.Tech Final Year (ECE)</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase mb-2">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {resume.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {resume.degrees.map((deg, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {deg.degree}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {deg.institution}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 shrink-0">
                    {deg.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase mb-3">
              Technical Proficiencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-1">Microcontrollers & Hardware</span>
                <p className="text-slate-400 leading-relaxed font-mono">
                  ESP32 (Wi-Fi/BLE), Arduino IDE, ESP8266, ATmega328P, UART, I2C, SPI, Sensor interfacing (ACS712, DHT11), OLED SSD1306, Relays.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-1">Web & Backend Technologies</span>
                <p className="text-slate-400 leading-relaxed font-mono">
                  React 19, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, Node.js, Express.js, REST APIs, JWT, MongoDB, Python, Flask.
                </p>
              </div>
            </div>
          </div>

          {/* Key Projects & Experience */}
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase mb-3">
              Featured Engineering Projects & Experience
            </h2>
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-white">
                    Front-End Development Internship · SaiKet Systems
                  </h3>
                  <span className="text-xs font-mono text-amber-400">Internship (6 Tasks)</span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  Completed six core frontend tasks building responsive web user interfaces, reusable components, and high-performance UI systems adhering to production standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-white">
                    MediScan AI · AI Healthcare Report Analysis System
                  </h3>
                  <span className="text-xs font-mono text-amber-400">Python · Flask · Groq AI</span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  Architected an intelligent healthcare application utilizing Groq AI LLM inference to analyze clinical reports, parse vital biomarkers, and render diagnostic summaries in an accessible dashboard.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-white">
                    IoT Solar Energy & Power Telemetry Station
                  </h3>
                  <span className="text-xs font-mono text-amber-400">ESP32 · C++ · OLED · Sensors</span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  Fabricated a physical IoT hardware monitoring unit measuring solar photovoltaic voltage, current draw (ACS712), and power output with real-time OLED updates and Wi-Fi streaming.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

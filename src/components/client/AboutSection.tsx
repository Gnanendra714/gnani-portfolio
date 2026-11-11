import { GraduationCap, Cpu, Code2, Sprout, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function AboutSection() {
  const { data } = usePortfolio();
  const { personal, aboutSection } = data;

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[var(--theme-bg-surface)]/70 border-t border-[var(--theme-border)]">
      {/* Subtle ambient lighting */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 blur-[130px] rounded-full pointer-events-none opacity-15 transition-all duration-500"
        style={{ backgroundColor: 'rgb(var(--theme-accent-rgb))' }}
      />
      <div className="absolute left-10 bottom-10 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 font-mono">
            {aboutSection.kicker || 'THE ENGINEER BEHIND THE MACHINE'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-display text-white mt-3 mb-5">
            Bridging Low-Level Silicon & High-Level Cloud
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {personal.extendedBio ||
              'A multidisciplinary engineer who writes bare-metal C++ firmware for microcontrollers and scales web architectures with React, Node.js, and cloud databases.'}
          </p>
        </div>

        {/* Bento Box Grid Layout (Recruiter-Ready Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
          
          {/* Bento Card 1: Degree & Academic Foundation (Span 7) */}
          <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] hover:border-amber-400/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  Academic Foundation
                </span>
              </div>

              <h3 className="text-2xl font-bold font-serif-display text-white mb-2 group-hover:text-amber-300 transition-colors">
                B.Tech in Electronics & Communication Engineering
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Trained in core electronic fundamentals, signal theory, circuit design, and microcontroller architecture. This degree empowers me to evaluate hardware schematics down to the transistor, trace impedance, and ADC noise floor level.
              </p>

              {/* Coursework Pills */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Microprocessors & Microcontrollers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Digital Signal Processing (DSP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Linear Integrated Circuits & VLSI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Digital Communication Systems</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--theme-border)] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400">Core Engineering Rigor</span>
              <span>Graduation Ready</span>
            </div>
          </div>

          {/* Bento Card 2: Hardware Focus & Microcontrollers (Span 5) */}
          <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)]/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
                  Hardware Focus
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
                ESP32 & Microcontroller Prototyping
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Bare-metal and RTOS firmware programming in C/C++. Interfacing environmental sensors, optocoupler-isolated relays, and I2C OLED displays with low-power deep sleep cycles.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Hardware Targets:</span>
                  <span className="text-white">ESP32, ESP8266, Arduino Uno/Nano</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Protocols:</span>
                  <span className="text-cyan-400">I2C · SPI · UART · BLE · MQTT</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--theme-border)] text-xs font-mono text-cyan-400">
              PlatformIO · Arduino IDE · C++
            </div>
          </div>

          {/* Bento Card 3: Software & Full Stack Focus (Span 5) */}
          <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] hover:border-amber-400/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  Software Focus
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif-display text-white mb-2 group-hover:text-amber-300 transition-colors">
                Full-Stack Cloud & Dashboard Stack
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Modern responsive single-page web applications with real-time WebSockets and REST APIs that receive sensor telemetry and display live charts and control relays.
              </p>

              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind v4'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--theme-border)] text-xs font-mono text-amber-400">
              End-to-End Scalable Systems
            </div>
          </div>

          {/* Bento Card 4: Domain - AgriTech & Smart Automation (Span 7) */}
          <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[var(--theme-bg-card)]/80 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/25">
                  Domain Expertise
                </span>
              </div>

              <h3 className="text-2xl font-bold font-serif-display text-white mb-2 group-hover:text-emerald-300 transition-colors">
                AgriTech & Real-Time Sensor Telemetry
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Specialized in building mission-critical agricultural monitoring solutions. Designed threshold-triggered irrigation automation that resulted in a verified 34% reduction in water waste across test soil beds.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-lg">34%</div>
                  <div className="text-slate-400 mt-0.5">Water Conserved</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-cyan-400 font-bold text-lg">&lt; 150ms</div>
                  <div className="text-slate-400 mt-0.5">Telemetry Latency</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-amber-400 font-bold text-lg">24 / 7</div>
                  <div className="text-slate-400 mt-0.5">Edge Reliability</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--theme-border)] text-xs font-mono text-emerald-400">
              Tested on Real Soil & Microclimate Beds
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

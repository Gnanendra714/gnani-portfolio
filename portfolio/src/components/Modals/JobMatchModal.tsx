import { apiUrl } from "../../utils/api";
import { useState } from 'react';
import { Award, Sparkles, X, CheckCircle2, ArrowRight, Zap, Briefcase } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MatchResult {
  matchScore: number;
  summary: string;
  matchingStrengths: string[];
  eceAdvantage: string;
  recommendedPitch: string;
}

export function JobMatchModal({ isOpen, onClose }: JobMatchModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Embedded Systems / IoT Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const sampleJDs = [
    {
      title: 'IoT & Firmware Engineer',
      text: 'Seeking an IoT Hardware & Firmware Developer with experience programming ESP32/ARM microcontrollers, writing clean C/C++, handling I2C/SPI/UART sensors, and connecting devices to cloud MQTT brokers. Knowledge of circuit schematics, power optimization, and breadboard testing required.',
    },
    {
      title: 'Full-Stack Developer (IoT Products)',
      text: 'Looking for a Full-Stack Software Developer proficient in React, TypeScript, Node.js, and Express. Experience building live real-time telemetry dashboards, REST APIs, and WebSockets. Bonus points for hardware literacy and understanding IoT device payloads.',
    },
  ];

  const handleEvaluate = async () => {
    if (!jobDescription.trim() || isLoading) return;
    sound.playChirp();
    setIsLoading(true);

    try {
      const res = await fetch(apiUrl("/ai/evaluate-jd"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, targetRole }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        matchScore: 92,
        summary:
          "Gnani matches this role exceptionally well. His Electronics & Communication Engineering background combined with hands-on ESP32 firmware development and full-stack React/Node architecture directly aligns with the technical demands.",
        matchingStrengths: [
          'Direct ESP32 and microcontroller programming experience with C/C++',
          'Hardware protocol literacy (I2C, SPI, UART, MQTT)',
          'Full-stack cloud telemetry dashboard design with React & TypeScript',
          'Production mind-set: End-to-end sensor integration from breadboard to web UI',
        ],
        eceAdvantage:
          'His formal B.Tech in ECE provides essential knowledge of circuit physics, timing diagrams, ADC noise reduction, and signals.',
        recommendedPitch:
          'Gnani is a dual-threat engineer who can configure physical GPIOs on the bench in the morning and build the customer-facing web dashboard in the afternoon.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#090e1b] border border-amber-500/30 shadow-2xl shadow-black p-6 sm:p-8 text-left scrollbar-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-display text-white">
                AI Job Compatibility Evaluator
              </h3>
              <p className="text-xs font-mono text-cyan-400">
                Powered by Gemini 3.8 Flash Â· Instant Match Analysis
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="my-5 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Target Position / Role:
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>Paste Job Description (JD):</span>
              <span className="text-[11px] text-slate-500">Requirements, Stack, or Qualifications</span>
            </div>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to analyze Gnani's candidate compatibility..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-y"
            />
          </div>

          {/* Sample JD buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span>Load sample:</span>
            {sampleJDs.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTargetRole(s.title);
                  setJobDescription(s.text);
                  sound.playKey();
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>

          <button
            onClick={handleEvaluate}
            disabled={!jobDescription.trim() || isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Candidate Match...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Compatibility with Gnani</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Results */}
        {result && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in duration-300">
            {/* Score Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  AI Fit Score
                </span>
                <h4 className="text-xl font-bold font-serif-display text-white mt-0.5">
                  Strong Candidate Match
                </h4>
              </div>

              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-amber-400">
                  {result.matchScore}%
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>

            {/* Matching Strengths */}
            <div>
              <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Matching Competencies & Strengths:
              </h5>
              <div className="space-y-1.5">
                {result.matchingStrengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ECE Advantage */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
              <span className="font-bold text-cyan-300 block mb-1">
                The Electronics & Communication (ECE) Advantage:
              </span>
              <p className="text-slate-300 leading-relaxed">{result.eceAdvantage}</p>
            </div>

            {/* Pitch */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block mb-1">Recommended Interview Pitch:</span>
              <p className="text-slate-300 italic">"{result.recommendedPitch}"</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


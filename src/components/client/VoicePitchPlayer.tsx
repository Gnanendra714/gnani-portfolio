import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Sparkles, Award, Cpu, CheckCircle } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface VoicePitchPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoicePitchPlayer({ isOpen, onClose }: VoicePitchPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pitchText =
    "Hello and welcome! I am Gnani, a B.Tech Electronics and Communication Engineer specializing in Embedded Systems, IoT Architecture, and Full-Stack development. From writing bare-metal firmware on ESP32 and Arduino microcontrollers to deploying responsive React and Node.js cloud applications, I build complete, real-world systems. Feel free to explore my interactive workbench, inspect my code, or reach out to build something amazing together.";

  // Handle speech synthesis
  const handleTogglePlay = () => {
    sound.playClick();
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(pitchText);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;

        // Try to pick a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
      }
    }
  };

  // Cleanup on close or unmount
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isOpen]);

  // Audio waveform canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const bars = 36;
      const barWidth = w / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 8;
        if (isPlaying) {
          barHeight = 10 + Math.sin(t * 0.15 + i * 0.35) * 22 + Math.cos(t * 0.2 + i * 0.15) * 12;
          barHeight = Math.max(6, Math.min(h - 10, barHeight));
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, '#06b6d4');

        ctx.fillStyle = isPlaying ? grad : 'rgba(148, 163, 184, 0.25)';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      t++;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090e1a] border border-amber-500/30 shadow-2xl shadow-black p-6 sm:p-8 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-display text-white">
                Audio Pitch & Voice Intro
              </h3>
              <p className="text-xs font-mono text-amber-300/80">
                Gnani · 45-Second Engineering Overview
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

        {/* Dynamic Waveform Visualizer */}
        <div className="my-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <canvas ref={canvasRef} width={460} height={70} className="w-full h-16 block" />
          
          <div className="flex items-center justify-between mt-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              <span>{isPlaying ? 'Synthesizing voice stream...' : 'Ready to stream'}</span>
            </span>
            <span className="text-amber-400">Voice Synthesis Engine</span>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto mb-6">
          <p className="italic font-normal">"{pitchText}"</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={handleTogglePlay}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play Elevator Pitch</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

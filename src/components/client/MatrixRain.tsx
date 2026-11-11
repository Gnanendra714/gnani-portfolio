import { useEffect, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';

interface MatrixRainProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MatrixRain({ isOpen, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = '01ESP32ARDUINOI2CSPIUARTGPIO0123456789ABCDEFµΩλπ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 24, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#34d399';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Occasional highlight character
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#fef08a';
        } else {
          ctx.fillStyle = '#10b981';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Control overlay header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/30 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-widest uppercase">ESP32 DIGITAL MATRIX OVERLAY // HACKER MODE</span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit Matrix (Esc)</span>
        </button>
      </div>

      <div className="relative z-10 p-4 text-center text-[11px] font-mono text-emerald-400/80 bg-slate-950/70 border-t border-emerald-500/20 backdrop-blur-md">
        <span>Press ESC to return to executive portfolio view</span>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

interface MatrixRainProps {
  isOpen: boolean;
  onClose: () => void;
}

const MATRIX_THEMES = {
  sapphire: {
    name: "ELECTRIC SAPPHIRE",
    background: "#050B1B",
    fade: "rgba(5, 11, 27, 0.10)",
    primary: "#00A8FF",
    secondary: "#8B5CF6",
    highlight: "#A5E6FF",
    header: "rgba(5, 11, 27, 0.92)",
    border: "rgba(0, 168, 255, 0.35)",
    text: "#38BDF8",
  },
  emerald: {
    name: "CYBER EMERALD",
    background: "#04130D",
    fade: "rgba(4, 19, 13, 0.10)",
    primary: "#10B981",
    secondary: "#34D399",
    highlight: "#A7F3D0",
    header: "rgba(4, 19, 13, 0.92)",
    border: "rgba(16, 185, 129, 0.35)",
    text: "#34D399",
  },
  amethyst: {
    name: "NEON AMETHYST",
    background: "#10071D",
    fade: "rgba(16, 7, 29, 0.10)",
    primary: "#A855F7",
    secondary: "#C084FC",
    highlight: "#E9D5FF",
    header: "rgba(16, 7, 29, 0.92)",
    border: "rgba(168, 85, 247, 0.35)",
    text: "#C084FC",
  },
} as const;

export function MatrixRain({ isOpen, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTheme } = usePortfolio();

  const theme = MATRIX_THEMES[currentTheme];

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animFrameId = 0;

    const fontSize = 14;
    const chars = "01ESP32ARDUINOI2CSPIUARTGPIO0123456789ABCDEFµΩλπ";

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drops.length = Math.floor(width / fontSize);

      for (let i = 0; i < drops.length; i++) {
        drops[i] = Math.floor(Math.random() * -50);
      }

      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);
    };

    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(0);

    resizeCanvas();

    const handleResize = () => resizeCanvas();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const render = () => {
      // Fade previous frames to create the falling-rain effect.
      ctx.fillStyle = theme.fade;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const random = Math.random();

        if (random > 0.985) {
          ctx.fillStyle = theme.highlight;
          ctx.shadowColor = theme.secondary;
          ctx.shadowBlur = 12;
        } else if (random > 0.88) {
          ctx.fillStyle = theme.secondary;
          ctx.shadowBlur = 3;
        } else {
          ctx.fillStyle = theme.primary;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20);
        }

        drops[i]++;
      }

      animFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentTheme, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden="true"
      />

      {/* Matrix header */}
      <header
        className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
        style={{
          background: theme.header,
          borderBottom: `1px solid ${theme.border}`,
          color: theme.text,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2 w-2 shrink-0 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primary }}
          />

          <span className="truncate text-[10px] sm:text-xs font-bold tracking-widest uppercase font-mono">
            ESP32 DIGITAL MATRIX // {theme.name}
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono transition-all hover:brightness-125"
          style={{
            color: theme.text,
            background: `${theme.primary}18`,
            border: `1px solid ${theme.border}`,
          }}
        >
          <X className="h-4 w-4" />
          <span>Exit Matrix (Esc)</span>
        </button>
      </header>

      {/* Matrix footer */}
      <footer
        className="relative z-10 px-3 py-4 text-center text-[10px] sm:text-xs font-mono"
        style={{
          color: theme.text,
          background: theme.header,
          borderTop: `1px solid ${theme.border}`,
          backdropFilter: "blur(12px)",
        }}
      >
        Press ESC to return to executive portfolio view
      </footer>
    </div>
  );
}

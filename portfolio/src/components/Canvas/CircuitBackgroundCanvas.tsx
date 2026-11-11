import { useEffect, useRef } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

interface CircuitNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface CircuitPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

const BACKGROUND_THEMES = {
  sapphire: {
    primary: "#00A8FF",
    secondary: "#8B5CF6",
    highlight: "#A5E6FF",
  },
  emerald: {
    primary: "#10B981",
    secondary: "#34D399",
    highlight: "#A7F3D0",
  },
  amethyst: {
    primary: "#A855F7",
    secondary: "#C084FC",
    highlight: "#E9D5FF",
  },
} as const;

export function CircuitBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTheme } = usePortfolio();

  const palette = BACKGROUND_THEMES[currentTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let pulseTimer = 0;
    let isRunning = false;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const nodes: CircuitNode[] = [];
    const pulses: CircuitPulse[] = [];

    const maxConnectionDistance = 165;
    const mouseConnectionDistance = 150;
    const maxPulses = 9;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep the node count moderate on smaller screens.
      const desiredCount = Math.floor((width * height) / 32000);

      const nodeCount = Math.max(20, Math.min(desiredCount, 48));

      nodes.length = 0;
      pulses.length = 0;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          radius: Math.random() * 1.2 + 1.1,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const spawnPulse = () => {
      if (nodes.length < 2 || pulses.length >= maxPulses) {
        return;
      }

      const fromIndex = Math.floor(Math.random() * nodes.length);

      let closestIndex = -1;
      let closestDistance = maxConnectionDistance;

      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIndex) continue;

        const dx = nodes[fromIndex].x - nodes[i].x;
        const dy = nodes[fromIndex].y - nodes[i].y;
        const distance = Math.hypot(dx, dy);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      if (closestIndex !== -1) {
        pulses.push({
          fromIndex,
          toIndex: closestIndex,
          progress: 0,
          speed: 0.012 + Math.random() * 0.012,
        });
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance >= maxConnectionDistance) continue;

          const opacity = (1 - distance / maxConnectionDistance) * 0.38;

          const middleX = (a.x + b.x) / 2;

          // First pass: subtle circuit glow.
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(middleX, a.y);
          ctx.lineTo(middleX, b.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle = palette.secondary;
          ctx.globalAlpha = opacity * 0.35;
          ctx.lineWidth = 3;
          ctx.shadowColor = palette.secondary;
          ctx.shadowBlur = 7;
          ctx.stroke();

          // Second pass: crisp PCB trace.
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(middleX, a.y);
          ctx.lineTo(middleX, b.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle = palette.primary;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.stroke();

          // Small connection terminal.
          ctx.beginPath();
          ctx.arc(b.x, b.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = palette.highlight;
          ctx.globalAlpha = opacity * 0.8;
          ctx.fill();

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }
    };

    const drawMouseConnections = () => {
      if (!mouse.active) return;

      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.hypot(dx, dy);

        if (distance >= mouseConnectionDistance) continue;

        const opacity = (1 - distance / mouseConnectionDistance) * 0.22;

        ctx.strokeStyle = palette.secondary;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 0.9;

        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();

        ctx.globalAlpha = 1;

        // Very gentle magnetic influence.
        node.vx += dx * 0.000025;
        node.vy += dy * 0.000025;
      }
    };

    const updateAndDrawNodes = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at canvas boundaries.
        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }

        // Prevent the nodes from accelerating indefinitely.
        node.vx *= 0.998;
        node.vy *= 0.998;

        node.vx = Math.max(-0.42, Math.min(0.42, node.vx));
        node.vy = Math.max(-0.42, Math.min(0.42, node.vy));

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawPulses = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const from = nodes[pulse.fromIndex];
        const to = nodes[pulse.toIndex];

        if (!from || !to) {
          pulses.splice(i, 1);
          continue;
        }

        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const x = from.x + (to.x - from.x) * pulse.progress;
        const y = from.y + (to.y - from.y) * pulse.progress;

        // Outer electrical glow.
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.secondary;
        ctx.shadowColor = palette.secondary;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.8;
        ctx.fill();

        // Bright pulse core.
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = palette.highlight;
        ctx.shadowBlur = 5;
        ctx.globalAlpha = 1;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    };

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      pulseTimer++;

      if (pulseTimer % 38 === 0) {
        spawnPulse();
      }

      drawConnections();
      drawMouseConnections();
      drawPulses();
      updateAndDrawNodes();

      animationId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      if (isRunning || document.hidden) return;

      isRunning = true;
      animationId = requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    startAnimation();

    return () => {
      stopAnimation();

      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentTheme, palette.primary, palette.secondary, palette.highlight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        opacity: 0.32,
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  );
}

import { useEffect, useRef } from 'react';

export function CircuitBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for magnetic connection
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Circuit Nodes
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      type: 'gold' | 'cyan' | 'emerald';
    }

    const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 28000), 55);
    const nodes: Node[] = [];
    const types: ('gold' | 'cyan' | 'emerald')[] = ['cyan', 'gold', 'emerald', 'cyan'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        type: types[i % types.length],
      });
    }

    // High-speed electrical pulse signals running along traces
    interface Pulse {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }
    const pulses: Pulse[] = [];

    const spawnPulse = () => {
      if (nodes.length < 2) return;
      const from = Math.floor(Math.random() * nodes.length);
      // find close node
      let closeIndex = -1;
      let minDist = 180;
      for (let j = 0; j < nodes.length; j++) {
        if (j === from) continue;
        const dx = nodes[from].x - nodes[j].x;
        const dy = nodes[from].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) {
          minDist = d;
          closeIndex = j;
        }
      }
      if (closeIndex !== -1 && pulses.length < 14) {
        pulses.push({
          fromIndex: from,
          toIndex: closeIndex,
          progress: 0,
          speed: 0.015 + Math.random() * 0.025,
        });
      }
    };

    let pulseTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      pulseTimer++;
      if (pulseTimer % 18 === 0) {
        spawnPulse();
      }

      // 1. Draw circuit traces between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.22;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            // Right-angle circuit line styling
            if (i % 2 === 0) {
              const midX = (nodes[i].x + nodes[j].x) / 2;
              ctx.lineTo(midX, nodes[i].y);
              ctx.lineTo(midX, nodes[j].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
            } else {
              ctx.lineTo(nodes[j].x, nodes[j].y);
            }
            ctx.stroke();
          }
        }

        // Connection to cursor if nearby
        if (mouse.active) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            const malpha = (1 - mdist / 180) * 0.45;
            ctx.strokeStyle = `rgba(245, 158, 11, ${malpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Magnetic pull towards mouse
            nodes[i].vx += (mouse.x - nodes[i].x) * 0.00015;
            nodes[i].vy += (mouse.y - nodes[i].y) * 0.00015;
          }
        }
      }

      // 2. Draw Traveling Current Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        const n1 = nodes[pulse.fromIndex];
        const n2 = nodes[pulse.toIndex];
        if (!n1 || !n2) {
          pulses.splice(p, 1);
          continue;
        }

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = n1.x + (n2.x - n1.x) * pulse.progress;
        const py = n1.y + (n2.y - n1.y) * pulse.progress;

        ctx.fillStyle = '#fde68a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce on boundaries
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > width) { n.x = width; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > height) { n.y = height; n.vy *= -1; }

        // Slight speed dampening
        n.vx *= 0.995;
        n.vy *= 0.995;

        // Draw node dot
        ctx.fillStyle = n.type === 'gold' ? '#f59e0b' : n.type === 'cyan' ? '#06b6d4' : '#10b981';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-45 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}

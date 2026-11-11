import { useEffect, useRef, useState } from "react";
import { Cpu, Zap, Radio, Activity } from "lucide-react";
import { sound } from "../../utils/soundEffects";

export function InteractiveChipCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [activePin, setActivePin] = useState<string | null>(null);
  const [clockSpeed] = useState("240 MHz Dual-Core");
  const [coreTemp, setCoreTemp] = useState(38.4);
  const [wifiSignal, setWifiSignal] = useState(-58);

  const isHoveredRef = useRef(false);

  // Continuous 3D idle floating oscillation so the chip always moves
  useEffect(() => {
    let animId: number;
    let t = 0;
    const animateIdle = () => {
      t += 0.025;
      if (!isHoveredRef.current) {
        setTilt({
          rx: Math.sin(t * 0.9) * 5.5,
          ry: Math.cos(t * 0.7) * 7.5,
        });
      }
      animId = requestAnimationFrame(animateIdle);
    };
    animateIdle();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    isHoveredRef.current = true;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rx = -(y / (rect.height / 2)) * 14;
    const ry = (x / (rect.width / 2)) * 14;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setActivePin(null);
  };

  // Canvas trace pulse animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.03;

      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle circuit trace lines
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";

      // Trace 1
      ctx.beginPath();
      ctx.moveTo(30, h * 0.2);
      ctx.lineTo(w * 0.35, h * 0.2);
      ctx.lineTo(w * 0.45, h * 0.35);
      ctx.stroke();

      // Pulse traveling on trace 1
      const p1 = (Math.sin(t) + 1) / 2;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(
        30 + p1 * (w * 0.45 - 30),
        h * 0.2 + (p1 > 0.6 ? (p1 - 0.6) * (h * 0.35 - h * 0.2) : 0),
        2.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Trace 2 (SPI bus)
      ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
      ctx.beginPath();
      ctx.moveTo(w - 30, h * 0.3);
      ctx.lineTo(w * 0.65, h * 0.3);
      ctx.lineTo(w * 0.55, h * 0.45);
      ctx.stroke();

      const p2 = (Math.cos(t * 1.3) + 1) / 2;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(
        w - 30 - p2 * (w - 30 - w * 0.55),
        h * 0.3 + (p2 > 0.5 ? (p2 - 0.5) * (h * 0.45 - h * 0.3) : 0),
        2.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Jitter simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setCoreTemp(Number((38.2 + Math.random() * 0.6).toFixed(1)));
      setWifiSignal(Math.floor(-58 + (Math.random() * 4 - 2)));
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const pins = [
    { label: "3V3", desc: "Regulated 3.3V Power", type: "pwr" },
    { label: "GND", desc: "Digital System Ground", type: "gnd" },
    { label: "D21 (SDA)", desc: "I2C Serial Data Bus", type: "i2c" },
    { label: "D22 (SCL)", desc: "I2C Serial Clock Bus", type: "i2c" },
    { label: "D19 (MISO)", desc: "SPI Master-In Slave-Out", type: "spi" },
    { label: "D23 (MOSI)", desc: "SPI Master-Out Slave-In", type: "spi" },
    {
      label: "TXD0",
      desc: "UART0 Serial Transmit (115200 baud)",
      type: "uart",
    },
    { label: "RXD0", desc: "UART0 Serial Receive", type: "uart" },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto aspect-[16/11] rounded-3xl p-6 sm:p-7 perspective-1000 select-none cursor-crosshair group"
      style={{
        perspective: "1200px",
      }}
    >
      {/* 3D Board Surface with dynamic tilt */}
      <div
        className="relative w-full h-full rounded-2xl bg-[#070d18] border border-amber-500/30 shadow-2xl shadow-black/80 transition-transform duration-200 ease-out flex flex-col justify-between p-5 overflow-hidden backdrop-blur-xl"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(245, 158, 11, 0.2)",
        }}
      >
        {/* Silicon PCB Traces canvas */}
        <canvas
          ref={canvasRef}
          width={450}
          height={320}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />

        {/* Ambient Silicon Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar on Board */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              ESP32-WROOM-32D
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3" />
              <span>{wifiSignal} dBm</span>
            </span>
            <span>·</span>
            <span className="text-amber-400">{coreTemp}°C</span>
          </div>
        </div>

        {/* Center Metal Shield / SoC Die */}
        <div className="relative z-10 my-auto py-2 flex items-center justify-center">
          <div className="relative p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 shadow-inner group/chip">
            {/* Wi-Fi Antenna trace lines etched on top */}
            <div className="flex items-center justify-between mb-3 text-[9px] font-mono text-slate-400 border-b border-slate-800 pb-1">
              <span>2.4 GHz Wi-Fi + BLE 4.2</span>
              <span className="text-emerald-400">TX/RX READY</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-mono text-white tracking-wide">
                  Xtensa® 32-bit LX6
                </h4>
                <p className="text-[11px] font-mono text-amber-300/90">
                  {clockSpeed}
                </p>
              </div>
            </div>

            {/* Microcontroller Specs Strip */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-400">
              <div>
                SRAM: <span className="text-white">520 KB</span>
              </div>
              <div>
                FLASH: <span className="text-white">4 MB SPI</span>
              </div>
              <div>
                ADC: <span className="text-emerald-400">12-bit (18ch)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Pinout Quick Header */}
        <div className="relative z-10 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
            <span>GPIO PIN BUS MATRIX</span>
            <span className="text-amber-400">
              {activePin || "Hover any pin"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {pins.map((pin) => (
              <button
                key={pin.label}
                onMouseEnter={() => {
                  setActivePin(`${pin.label}: ${pin.desc}`);
                  sound.playKey();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                  activePin?.startsWith(pin.label)
                    ? "bg-amber-400 text-slate-950 font-bold scale-105 shadow-md shadow-amber-400/40"
                    : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-400/40"
                }`}
              >
                {pin.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

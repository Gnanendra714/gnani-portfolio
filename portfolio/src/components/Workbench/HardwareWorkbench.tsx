import { useState, useEffect, useRef } from "react";
import { MicrocontrollerExplorer } from "./MicrocontrollerExplorer";
import {
  Cpu,
  Zap,
  Activity,
  Sliders,
  Terminal,
  Radio,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Wrench,
  Send,
} from "lucide-react";
import { sound } from "../../utils/soundEffects";

export function HardwareWorkbench() {
  const [activeTab, setActiveTab] = useState<
    "simulator" | "architect" | "explorer"
  >("simulator");

  // Simulator telemetry state
  const [voltage, setVoltage] = useState(3.3);
  const [temperature, setTemperature] = useState(28.4);
  const [wifiRssi, setWifiRssi] = useState(-62);
  const [adcRaw, setAdcRaw] = useState(2450);

  // Relay states
  const [relay1, setRelay1] = useState(false);
  const [relay2, setRelay2] = useState(true);
  const [txBlinking, setTxBlinking] = useState(false);

  // Oscilloscope state
  const [waveType, setWaveType] = useState<"sine" | "pwm" | "analog">("sine");
  const oscCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Frequency Spectrum Analyzer state
  const [spectrumBars, setSpectrumBars] = useState<number[]>([
    45, 62, 78, 54, 88, 70, 92, 60, 75, 82, 48, 66, 73, 58, 80, 50,
  ]);

  useEffect(() => {
    let animId: number;
    let t = 0;

    const loop = () => {
      t += 0.08;
      setSpectrumBars((prev) =>
        prev.map((_, i) => {
          const val =
            Math.sin(t * 1.6 + i * 0.48) * 36 + Math.cos(t * 0.9 + i) * 22 + 48;

          return Math.max(14, Math.min(96, Math.floor(val)));
        }),
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Serial Monitor state
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "[INIT] ESP32-WROOM-32D Bootloader v4.4.2 OK",
    "[WIFI] Connected to SSID: IoT-AgriMesh (192.168.1.142)",
    "[MQTT] Broker connected: mqtt://broker.hivemq.com:1883",
    "[ADC] 12-bit ADC initialized on GPIO 34 (Attenuation 11dB)",
    "[RELAY] GPIO 18 configured as OUTPUT (Active LOW)",
  ]);

  const [isStreaming, setIsStreaming] = useState(true);
  const [serialInput, setSerialInput] = useState("");
  const serialContainerRef = useRef<HTMLDivElement | null>(null);

  // AI Firmware Architect state
  const [architectPrompt, setArchitectPrompt] = useState(
    "ESP32 Smart Agricultural Irrigation Controller with I2C OLED and MQTT Telemetry",
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Relay Toggle Handlers
  const toggleRelay1 = () => {
    const next = !relay1;
    setRelay1(next);
    sound.playRelaySnap(next);

    setSerialLogs((prev) => [
      ...prev.slice(-30),
      `[RELAY_1] GPIO 18 (Irrigation Solenoid) -> ${
        next ? "ENGAGED (HIGH)" : "DISENGAGED (LOW)"
      }`,
    ]);
  };

  const toggleRelay2 = () => {
    const next = !relay2;
    setRelay2(next);
    sound.playRelaySnap(next);

    setSerialLogs((prev) => [
      ...prev.slice(-30),
      `[RELAY_2] GPIO 19 (Cooling Fan) -> ${
        next ? "ENGAGED (HIGH)" : "DISENGAGED (LOW)"
      }`,
    ]);
  };

  // Oscilloscope Canvas Rendering Loop
  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth || 500;
      canvas.height = canvas.offsetHeight || 200;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width || 500;
      const h = canvas.height || 200;

      ctx.fillStyle = "#030811";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";

      const step = 25;

      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshair axis
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Waveform trace
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#22d3ee";
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const freqMultiplier = (voltage / 3.3) * 0.05 + 0.02;
      const amplitude = Math.min((voltage / 5.0) * (h * 0.38), h * 0.42);

      for (let x = 0; x < w; x++) {
        let y = h / 2;

        if (waveType === "sine") {
          y = h / 2 - Math.sin(x * freqMultiplier + phase) * amplitude;
        } else if (waveType === "pwm") {
          const cycle = (x * freqMultiplier + phase) % (Math.PI * 2);
          y = cycle < Math.PI ? h / 2 - amplitude : h / 2 + amplitude;
        } else if (waveType === "analog") {
          const noise = Math.sin(x * 0.3) * 3 + Math.cos(x * 0.7) * 2;
          const rawNorm = (adcRaw / 4095) * (h * 0.4);

          y =
            h / 2 -
            Math.sin(x * freqMultiplier * 0.5 + phase) * rawNorm +
            noise;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [voltage, adcRaw, waveType]);

  // Serial Monitor Streaming Loop
  useEffect(() => {
    if (!isStreaming) return;

    let blinkTimer: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setTxBlinking(true);

      blinkTimer = setTimeout(() => setTxBlinking(false), 180);

      const packet = JSON.stringify({
        node: "ESP32_AGRI_01",
        vcc: voltage.toFixed(2),
        temp: temperature.toFixed(1),
        raw_adc: adcRaw,
        rssi: wifiRssi,
        relays: {
          r1: relay1 ? 1 : 0,
          r2: relay2 ? 1 : 0,
        },
        uptime_sec: Math.floor(performance.now() / 1000),
      });

      setSerialLogs((prev) => [...prev.slice(-40), `[MQTT_TX] ${packet}`]);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(blinkTimer);
    };
  }, [isStreaming, voltage, temperature, adcRaw, wifiRssi, relay1, relay2]);

  // Auto-scroll serial logs
  useEffect(() => {
    const container = serialContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      60;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [serialLogs]);

  // Handle custom serial command
  const handleSendSerial = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serialInput.trim()) return;

    sound.playKey();

    const cmd = serialInput.trim();

    setSerialLogs((prev) => [
      ...prev,
      `gnani@esp32-workbench:~$ ${cmd}`,
      `[ACK] Command accepted: ${cmd}`,
    ]);

    if (cmd.toLowerCase() === "relay1 on") setRelay1(true);
    if (cmd.toLowerCase() === "relay1 off") setRelay1(false);
    if (cmd.toLowerCase() === "relay2 on") setRelay2(true);
    if (cmd.toLowerCase() === "relay2 off") setRelay2(false);

    setSerialInput("");
  };

  // Trigger AI Firmware Architect API
  const handleGenerateArchitecture = async () => {
    if (!architectPrompt.trim()) return;

    sound.playChirp();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/architect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirement: architectPrompt,
        }),
      });

      const data = await res.json();

      setGeneratedSpec(data.architecture || "No architecture generated.");
    } catch {
      setGeneratedSpec(
        "Error connecting to AI architect service. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySpec = () => {
    if (!generatedSpec) return;

    navigator.clipboard.writeText(generatedSpec);
    setCopiedCode(true);
    sound.playClick();

    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="workbench"
      className="relative overflow-hidden border-t border-[var(--theme-border)] bg-[#070c17] py-10 sm:py-12 lg:py-16"
    >
      {/* Subtle high-tech background aura */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[400px] w-[600px] rounded-full bg-cyan-500/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[400px] w-[500px] rounded-full bg-amber-500/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-7 max-w-7xl text-center sm:mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Interactive IoT Hardware Workbench</span>
          </div>

          {/* Single-line responsive heading */}
          <h2 className="mb-3 whitespace-nowrap font-serif-display text-[clamp(0.9rem,3.2vw,3.25rem)] font-bold leading-tight text-white sm:mb-4">
            Physical Computing &amp; Microcontroller Lab
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Test live simulated sensors, monitor waveforms on the real-time
            oscilloscope, trigger physical relays, and generate production C++
            firmware specs powered by Gemini AI.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 flex w-full justify-start sm:mt-6 sm:justify-center">
            <div className="flex w-full min-w-0 gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:inline-flex sm:w-auto sm:overflow-visible">
              <button
                onClick={() => {
                  setActiveTab("simulator");
                  sound.playClick();
                }}
                className={`flex min-w-[116px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center text-[11px] font-semibold leading-tight transition-all sm:min-w-0 sm:flex-row sm:gap-2 sm:px-5 sm:py-2 sm:text-xs ${
                  activeTab === "simulator"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Live Hardware Simulator</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("architect");
                  sound.playClick();
                }}
                className={`flex min-w-[116px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center text-[11px] font-semibold leading-tight transition-all sm:min-w-0 sm:flex-row sm:gap-2 sm:px-5 sm:py-2 sm:text-xs ${
                  activeTab === "architect"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Circuit &amp; Firmware Architect</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("explorer");
                  sound.playClick();
                }}
                className={`flex min-w-[116px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center text-[11px] font-semibold leading-tight transition-all sm:min-w-0 sm:flex-row sm:gap-2 sm:px-5 sm:py-2 sm:text-xs ${
                  activeTab === "explorer"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Microcontroller Explorer</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: LIVE HARDWARE SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left 5 Cols: Sliders & Controls */}
            <div className="space-y-4 lg:col-span-5">
              {/* Telemetry Input Control Panel */}
              <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/80 p-4 shadow-xl backdrop-blur-md sm:p-6">
                <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-amber-400" />
                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                      Sensor &amp; Signal Inputs
                    </h3>
                  </div>

                  <span className="font-mono text-[11px] text-cyan-400">
                    12-bit ADC
                  </span>
                </div>

                <div className="space-y-5 text-left">
                  {/* Slider 1: Voltage */}
                  <div>
                    <div className="mb-1.5 flex justify-between font-mono text-xs">
                      <span className="text-slate-400">Bus Supply Voltage</span>
                      <span className="font-bold text-amber-400">
                        {voltage.toFixed(2)} V
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5.0"
                      step="0.05"
                      value={voltage}
                      onChange={(e) => setVoltage(parseFloat(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
                    />

                    <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                      <span>0.0V (LOW)</span>
                      <span>3.3V (VCC)</span>
                      <span>5.0V (VIN)</span>
                    </div>
                  </div>

                  {/* Slider 2: Temperature */}
                  <div>
                    <div className="mb-1.5 flex justify-between font-mono text-xs">
                      <span className="text-slate-400">
                        Ambient Temperature (DHT22)
                      </span>
                      <span className="font-bold text-cyan-400">
                        {temperature.toFixed(1)} °C
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-10"
                      max="65"
                      step="0.5"
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value))
                      }
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
                    />

                    <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                      <span>-10°C</span>
                      <span>25°C (Room)</span>
                      <span>65°C (Alert)</span>
                    </div>
                  </div>

                  {/* Slider 3: Wi-Fi RSSI */}
                  <div>
                    <div className="mb-1.5 flex justify-between font-mono text-xs">
                      <span className="text-slate-400">
                        Wi-Fi RSSI Signal Strength
                      </span>
                      <span className="font-bold text-emerald-400">
                        {wifiRssi} dBm
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-95"
                      max="-30"
                      step="1"
                      value={wifiRssi}
                      onChange={(e) => setWifiRssi(parseInt(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
                    />

                    <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                      <span>-95 dBm (Weak)</span>
                      <span>-65 dBm (Good)</span>
                      <span>-30 dBm (Strong)</span>
                    </div>
                  </div>

                  {/* Slider 4: Potentiometer ADC */}
                  <div>
                    <div className="mb-1.5 flex justify-between font-mono text-xs">
                      <span className="text-slate-400">
                        Soil Moisture / Analog ADC
                      </span>
                      <span className="font-bold text-purple-400">
                        {adcRaw} / 4095
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="4095"
                      step="25"
                      value={adcRaw}
                      onChange={(e) => setAdcRaw(parseInt(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware Relays & Actuators Panel */}
              <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/80 p-4 shadow-xl backdrop-blur-md sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                      Virtual Actuators &amp; Relays
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        txBlinking ? "bg-amber-400" : "bg-slate-700"
                      }`}
                    />
                    <span className="text-slate-400">TX LED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Relay 1 */}
                  <div
                    className={`rounded-xl border p-4 transition-all ${
                      relay1
                        ? "border-emerald-500/40 bg-emerald-950/30"
                        : "border-slate-800 bg-slate-900/60"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        Relay 1 (Solenoid)
                      </span>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          relay1
                            ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                            : "bg-slate-700"
                        }`}
                      />
                    </div>

                    <p className="mb-3 text-[11px] text-slate-400">
                      GPIO 18 · Irrigation Valve
                    </p>

                    <button
                      onClick={toggleRelay1}
                      className={`w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        relay1
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {relay1 ? "RELAY ACTIVE" : "ENGAGE RELAY"}
                    </button>
                  </div>

                  {/* Relay 2 */}
                  <div
                    className={`rounded-xl border p-4 transition-all ${
                      relay2
                        ? "border-cyan-500/40 bg-cyan-950/30"
                        : "border-slate-800 bg-slate-900/60"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        Relay 2 (Fan)
                      </span>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          relay2
                            ? "bg-cyan-400 shadow-sm shadow-cyan-400"
                            : "bg-slate-700"
                        }`}
                      />
                    </div>

                    <p className="mb-3 text-[11px] text-slate-400">
                      GPIO 19 · Exhaust Fan
                    </p>

                    <button
                      onClick={toggleRelay2}
                      className={`w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        relay2
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {relay2 ? "RELAY ACTIVE" : "ENGAGE RELAY"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Oscilloscope + Serial Monitor */}
            <div className="space-y-4 lg:col-span-7">
              {/* Real-time Canvas Oscilloscope */}
              <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/90 p-4 shadow-xl backdrop-blur-md sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />

                    <div>
                      <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                        Real-Time Digital Oscilloscope (60 FPS)
                      </h3>

                      <p className="font-mono text-[10px] text-slate-400">
                        CH1: GPIO 34 Probe · 500 MSa/s
                      </p>
                    </div>
                  </div>

                  {/* Waveform Selector */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
                    <button
                      onClick={() => setWaveType("sine")}
                      className={`rounded px-2.5 py-1 font-mono text-[11px] transition-all ${
                        waveType === "sine"
                          ? "bg-cyan-500 font-bold text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Sine
                    </button>

                    <button
                      onClick={() => setWaveType("pwm")}
                      className={`rounded px-2.5 py-1 font-mono text-[11px] transition-all ${
                        waveType === "pwm"
                          ? "bg-cyan-500 font-bold text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      PWM
                    </button>

                    <button
                      onClick={() => setWaveType("analog")}
                      className={`rounded px-2.5 py-1 font-mono text-[11px] transition-all ${
                        waveType === "analog"
                          ? "bg-cyan-500 font-bold text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Analog Sensor
                    </button>
                  </div>
                </div>

                {/* Oscilloscope Screen */}
                <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 shadow-inner">
                  <canvas ref={oscCanvasRef} className="block h-48 w-full" />

                  {/* Floating Measurement HUD */}
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/85 px-2.5 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
                    <div>
                      Vpp:{" "}
                      <span className="text-cyan-400">
                        {(voltage * 2).toFixed(2)}V
                      </span>
                    </div>

                    <div>
                      Freq: <span className="text-amber-400">1.25 kHz</span>
                    </div>

                    <div>
                      Duty: <span className="text-emerald-400">50%</span>
                    </div>
                  </div>
                </div>

                {/* Frequency Spectrum Visualizer */}
                <div className="mt-4 border-t border-slate-800/80 pt-3">
                  <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
                      <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
                      16-Channel Telemetry Frequency Spectrum
                    </span>

                    <span className="font-bold text-amber-400">
                      Live FFT Analyzer (60 FPS)
                    </span>
                  </div>

                  <div className="flex h-16 items-end justify-between gap-1 rounded-xl border border-cyan-500/20 bg-slate-950/90 p-2.5 shadow-inner">
                    {spectrumBars.map((height, idx) => (
                      <div
                        key={idx}
                        className="group flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-cyan-500 via-emerald-400 to-amber-400 shadow-sm shadow-cyan-400/30 transition-all duration-75"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-1 flex justify-between px-1 font-mono text-[9px] text-slate-500">
                    <span>63Hz</span>
                    <span>250Hz</span>
                    <span>1kHz</span>
                    <span>4kHz</span>
                    <span>16kHz</span>
                  </div>
                </div>
              </div>

              {/* Live Serial Monitor Terminal */}
              <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/90 p-4 shadow-xl backdrop-blur-md sm:p-6">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-amber-400" />

                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                      Live Serial Monitor (115200 Baud)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsStreaming(!isStreaming)}
                      className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 font-mono text-[10px] text-slate-300 transition-colors hover:bg-slate-700"
                    >
                      {isStreaming ? (
                        <Pause className="h-3 w-3 text-amber-400" />
                      ) : (
                        <Play className="h-3 w-3 text-emerald-400" />
                      )}

                      <span>{isStreaming ? "Pause" : "Resume"}</span>
                    </button>

                    <button
                      onClick={() => setSerialLogs([])}
                      className="rounded bg-slate-800 px-2.5 py-1 font-mono text-[10px] text-slate-300 transition-colors hover:bg-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Log stream view */}
                <div
                  ref={serialContainerRef}
                  className="scrollbar-none h-44 space-y-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-left font-mono text-[11px] text-slate-300"
                >
                  {serialLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith("[RELAY")
                          ? "font-semibold text-emerald-400"
                          : log.startsWith("[MQTT")
                            ? "text-cyan-300"
                            : log.startsWith("gnani@")
                              ? "font-bold text-amber-300"
                              : "text-slate-400"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>

                {/* Serial input form */}
                <form onSubmit={handleSendSerial} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="Send command (e.g., 'relay1 on', 'AT+STATUS', 'reboot')..."
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg bg-amber-400 px-4 py-1.5 font-mono text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-300"
                  >
                    <Send className="h-3 w-3" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI CIRCUIT & FIRMWARE ARCHITECT */}
        {activeTab === "architect" && (
          <div className="mx-auto max-w-4xl space-y-4 text-left">
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/90 p-4 shadow-xl backdrop-blur-md sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/15 text-amber-400">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <h3 className="font-serif-display text-lg font-bold leading-tight text-white sm:text-xl">
                    AI Circuit &amp; Firmware Code Architect
                  </h3>

                  <p className="text-xs text-slate-400">
                    Describe any IoT hardware requirement. Gemini will
                    synthesize pinout wiring tables, C++ firmware, and component
                    BOM.
                  </p>
                </div>
              </div>

              {/* Requirement prompt input */}
              <div className="mb-5 space-y-3">
                <label className="block font-mono text-xs text-slate-300">
                  Hardware Specifications &amp; Target System:
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={architectPrompt}
                    onChange={(e) => setArchitectPrompt(e.target.value)}
                    placeholder="e.g. ESP32 LoRa Soil Moisture Sensor Node with Deep Sleep..."
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />

                  <button
                    onClick={handleGenerateArchitecture}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-all hover:from-amber-300 hover:to-amber-400 active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-slate-950" />
                        <span>Generate Architecture</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-slate-400">
                  <span>Quick Presets:</span>

                  {[
                    "ESP32 MQTT Solar Energy Monitor",
                    "Smart Irrigation Threshold Relay",
                    "BLE Temperature Beacon with Deep Sleep",
                    "I2C OLED Environmental Telemetry Station",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setArchitectPrompt(preset)}
                      className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:bg-slate-800"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Output */}
              {generatedSpec && (
                <div className="mt-6 animate-in border-t border-slate-800 pt-6 fade-in duration-300">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                      Generated Firmware Specification
                    </span>

                    <button
                      onClick={handleCopySpec}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-200 transition-colors hover:bg-slate-700"
                    >
                      {copiedCode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}

                      <span>{copiedCode ? "Copied" : "Copy All"}</span>
                    </button>
                  </div>

                  <div className="max-h-[480px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-200">
                    {generatedSpec}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MULTI-MICROCONTROLLER EXPLORER */}
        {activeTab === "explorer" && <MicrocontrollerExplorer />}
      </div>
    </section>
  );
}

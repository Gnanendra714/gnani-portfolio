import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export function HardwareWorkbench() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'architect'>('simulator');

  // Simulator telemetry state
  const [voltage, setVoltage] = useState(3.3);
  const [temperature, setTemperature] = useState(28.4);
  const [wifiRssi, setWifiRssi] = useState(-62);
  const [adcRaw, setAdcRaw] = useState(2450);

  // Relay states
  const [relay1, setRelay1] = useState(false); // Solenoid valve
  const [relay2, setRelay2] = useState(true); // Cooling fan
  const [txBlinking, setTxBlinking] = useState(false);

  // Oscilloscope state
  const [waveType, setWaveType] = useState<'sine' | 'pwm' | 'analog'>('sine');
  const oscCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 16-Bar Audio & Telemetry Frequency Spectrum Analyzer state
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
          const val = Math.sin(t * 1.6 + i * 0.48) * 36 + Math.cos(t * 0.9 + i) * 22 + 48;
          return Math.max(14, Math.min(96, Math.floor(val)));
        })
      );
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Serial Monitor state
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[INIT] ESP32-WROOM-32D Bootloader v4.4.2 OK',
    '[WIFI] Connected to SSID: IoT-AgriMesh (192.168.1.142)',
    '[MQTT] Broker connected: mqtt://broker.hivemq.com:1883',
    '[ADC] 12-bit ADC initialized on GPIO 34 (Attenuation 11dB)',
    '[RELAY] GPIO 18 configured as OUTPUT (Active LOW)',
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [serialInput, setSerialInput] = useState('');
  const serialContainerRef = useRef<HTMLDivElement | null>(null);

  // AI Firmware Architect state
  const [architectPrompt, setArchitectPrompt] = useState('ESP32 Smart Agricultural Irrigation Controller with I2C OLED and MQTT Telemetry');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Relay Toggle Handlers with mechanical audio snap
  const toggleRelay1 = () => {
    const next = !relay1;
    setRelay1(next);
    sound.playRelaySnap(next);
    setSerialLogs((prev) => [
      ...prev.slice(-30),
      `[RELAY_1] GPIO 18 (Irrigation Solenoid) -> ${next ? 'ENGAGED (HIGH)' : 'DISENGAGED (LOW)'}`,
    ]);
  };

  const toggleRelay2 = () => {
    const next = !relay2;
    setRelay2(next);
    sound.playRelaySnap(next);
    setSerialLogs((prev) => [
      ...prev.slice(-30),
      `[RELAY_2] GPIO 19 (Cooling Fan) -> ${next ? 'ENGAGED (HIGH)' : 'DISENGAGED (LOW)'}`,
    ]);
  };

  // Oscilloscope Canvas Rendering Loop
  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth || 500;
      canvas.height = canvas.offsetHeight || 200;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width || 500;
      const h = canvas.height || 200;

      // Dark oscilloscope canvas grid
      ctx.fillStyle = '#030811';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
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
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Waveform trace
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#22d3ee';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const freqMultiplier = (voltage / 3.3) * 0.05 + 0.02;
      const amplitude = Math.min((voltage / 5.0) * (h * 0.38), h * 0.42);

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (waveType === 'sine') {
          y = h / 2 - Math.sin(x * freqMultiplier + phase) * amplitude;
        } else if (waveType === 'pwm') {
          const cycle = (x * freqMultiplier + phase) % (Math.PI * 2);
          y = cycle < Math.PI ? h / 2 - amplitude : h / 2 + amplitude;
        } else if (waveType === 'analog') {
          const noise = (Math.sin(x * 0.3) * 3) + (Math.cos(x * 0.7) * 2);
          const rawNorm = (adcRaw / 4095) * (h * 0.4);
          y = h / 2 - Math.sin(x * freqMultiplier * 0.5 + phase) * rawNorm + noise;
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
      window.removeEventListener('resize', resize);
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
        node: 'ESP32_AGRI_01',
        vcc: voltage.toFixed(2),
        temp: temperature.toFixed(1),
        raw_adc: adcRaw,
        rssi: wifiRssi,
        relays: { r1: relay1 ? 1 : 0, r2: relay2 ? 1 : 0 },
        uptime_sec: Math.floor(performance.now() / 1000),
      });

      setSerialLogs((prev) => [...prev.slice(-40), `[MQTT_TX] ${packet}`]);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(blinkTimer);
    };
  }, [isStreaming, voltage, temperature, adcRaw, wifiRssi, relay1, relay2]);

  // Auto-scroll serial logs strictly within the monitor container only
  useEffect(() => {
    const container = serialContainerRef.current;
    if (!container) return;

    // Only auto-scroll if user is already near bottom (within 60px)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <= 60;

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

    if (cmd.toLowerCase() === 'relay1 on') setRelay1(true);
    if (cmd.toLowerCase() === 'relay1 off') setRelay1(false);
    if (cmd.toLowerCase() === 'relay2 on') setRelay2(true);
    if (cmd.toLowerCase() === 'relay2 off') setRelay2(false);

    setSerialInput('');
  };

  // Trigger AI Firmware Architect API
  const handleGenerateArchitecture = async () => {
    if (!architectPrompt.trim()) return;
    sound.playChirp();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: architectPrompt }),
      });
      const data = await res.json();
      setGeneratedSpec(data.architecture || 'No architecture generated.');
    } catch {
      setGeneratedSpec('Error connecting to AI architect service. Please try again.');
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
    <section id="workbench" className="py-24 relative overflow-hidden bg-[#070c17] border-t border-[var(--theme-border)]">
      {/* Subtle high-tech background aura */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive IoT Hardware Workbench</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-display text-white mb-4">
            Physical Computing & Microcontroller Lab
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Test live simulated sensors, monitor waveforms on the real-time oscilloscope, trigger physical relays, and generate production C++ firmware specs powered by Gemini AI.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center mt-8">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <button
                onClick={() => {
                  setActiveTab('simulator');
                  sound.playClick();
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Live Hardware Simulator</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('architect');
                  sound.playClick();
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'architect'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Circuit & Firmware Architect</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: LIVE HARDWARE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Sliders & Controls */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Telemetry Input Control Panel */}
              <div className="p-6 rounded-2xl bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                      Sensor & Signal Inputs
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">12-bit ADC</span>
                </div>

                <div className="space-y-5 text-left">
                  {/* Slider 1: Voltage */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Bus Supply Voltage</span>
                      <span className="text-amber-400 font-bold">{voltage.toFixed(2)} V</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5.0"
                      step="0.05"
                      value={voltage}
                      onChange={(e) => setVoltage(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>0.0V (LOW)</span>
                      <span>3.3V (VCC)</span>
                      <span>5.0V (VIN)</span>
                    </div>
                  </div>

                  {/* Slider 2: Temperature */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Ambient Temperature (DHT22)</span>
                      <span className="text-cyan-400 font-bold">{temperature.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="65"
                      step="0.5"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>-10°C</span>
                      <span>25°C (Room)</span>
                      <span>65°C (Alert)</span>
                    </div>
                  </div>

                  {/* Slider 3: Wi-Fi RSSI */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Wi-Fi RSSI Signal Strength</span>
                      <span className="text-emerald-400 font-bold">{wifiRssi} dBm</span>
                    </div>
                    <input
                      type="range"
                      min="-95"
                      max="-30"
                      step="1"
                      value={wifiRssi}
                      onChange={(e) => setWifiRssi(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>-95 dBm (Weak)</span>
                      <span>-65 dBm (Good)</span>
                      <span>-30 dBm (Strong)</span>
                    </div>
                  </div>

                  {/* Slider 4: Potentiometer ADC */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Soil Moisture / Analog ADC</span>
                      <span className="text-purple-400 font-bold">{adcRaw} / 4095</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4095"
                      step="25"
                      value={adcRaw}
                      onChange={(e) => setAdcRaw(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware Relays & Actuators Panel */}
              <div className="p-6 rounded-2xl bg-[var(--theme-bg-card)]/80 border border-[var(--theme-border)] shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                      Virtual Actuators & Relays
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className={`w-2 h-2 rounded-full ${txBlinking ? 'bg-amber-400' : 'bg-slate-700'}`} />
                    <span className="text-slate-400">TX LED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Relay 1 */}
                  <div className={`p-4 rounded-xl border transition-all ${relay1 ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-slate-300">Relay 1 (Solenoid)</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${relay1 ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-700'}`} />
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">GPIO 18 · Irrigation Valve</p>
                    <button
                      onClick={toggleRelay1}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        relay1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {relay1 ? 'RELAY ACTIVE' : 'ENGAGE RELAY'}
                    </button>
                  </div>

                  {/* Relay 2 */}
                  <div className={`p-4 rounded-xl border transition-all ${relay2 ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-slate-300">Relay 2 (Fan)</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${relay2 ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-700'}`} />
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">GPIO 19 · Exhaust Fan</p>
                    <button
                      onClick={toggleRelay2}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        relay2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {relay2 ? 'RELAY ACTIVE' : 'ENGAGE RELAY'}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 7 Cols: Real-time Oscilloscope + Live Serial Monitor */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Real-time Canvas Oscilloscope */}
              <div className="p-6 rounded-2xl bg-[var(--theme-bg-card)]/90 border border-[var(--theme-border)] shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                        Real-Time Digital Oscilloscope (60 FPS)
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">CH1: GPIO 34 Probe · 500 MSa/s</p>
                    </div>
                  </div>

                  {/* Waveform Selector buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setWaveType('sine')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all ${
                        waveType === 'sine' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sine
                    </button>
                    <button
                      onClick={() => setWaveType('pwm')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all ${
                        waveType === 'pwm' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      PWM
                    </button>
                    <button
                      onClick={() => setWaveType('analog')}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all ${
                        waveType === 'analog' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Analog Sensor
                    </button>
                  </div>
                </div>

                {/* Oscilloscope Screen */}
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 shadow-inner">
                  <canvas ref={oscCanvasRef} className="w-full h-48 block" />
                  
                  {/* Floating Measurement HUD */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-3">
                    <div>Vpp: <span className="text-cyan-400">{(voltage * 2).toFixed(2)}V</span></div>
                    <div>Freq: <span className="text-amber-400">1.25 kHz</span></div>
                    <div>Duty: <span className="text-emerald-400">50%</span></div>
                  </div>
                </div>

                {/* 16-Bar Real-Time Frequency Spectrum Visualizer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      16-Channel Telemetry Frequency Spectrum
                    </span>
                    <span className="text-amber-400 font-bold">Live FFT Analyzer (60 FPS)</span>
                  </div>
                  <div className="h-16 bg-slate-950/90 rounded-xl p-2.5 border border-cyan-500/20 flex items-end justify-between gap-1 shadow-inner">
                    {spectrumBars.map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          className="w-full rounded-t transition-all duration-75 bg-gradient-to-t from-cyan-500 via-emerald-400 to-amber-400 shadow-sm shadow-cyan-400/30"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1 px-1">
                    <span>63Hz</span>
                    <span>250Hz</span>
                    <span>1kHz</span>
                    <span>4kHz</span>
                    <span>16kHz</span>
                  </div>
                </div>
              </div>

              {/* Live Serial Monitor Terminal */}
              <div className="p-6 rounded-2xl bg-[var(--theme-bg-card)]/90 border border-[var(--theme-border)] shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                      Live Serial Monitor (115200 Baud)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsStreaming(!isStreaming)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                    >
                      {isStreaming ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      <span>{isStreaming ? 'Pause' : 'Resume'}</span>
                    </button>
                    <button
                      onClick={() => setSerialLogs([])}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Log stream view */}
                <div
                  ref={serialContainerRef}
                  className="h-44 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 text-left scrollbar-none"
                >
                  {serialLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith('[RELAY')
                          ? 'text-emerald-400 font-semibold'
                          : log.startsWith('[MQTT')
                          ? 'text-cyan-300'
                          : log.startsWith('gnani@')
                          ? 'text-amber-300 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>

                {/* Serial input form */}
                <form onSubmit={handleSendSerial} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="Send command (e.g., 'relay1 on', 'AT+STATUS', 'reboot')..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold font-mono flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI CIRCUIT & FIRMWARE ARCHITECT */}
        {activeTab === 'architect' && (
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--theme-bg-card)]/90 border border-[var(--theme-border)] shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif-display text-white">
                    AI Circuit & Firmware Code Architect
                  </h3>
                  <p className="text-xs text-slate-400">
                    Describe any IoT hardware requirement. Gemini will synthesize pinout wiring tables, C++ firmware, and component BOM.
                  </p>
                </div>
              </div>

              {/* Requirement prompt input */}
              <div className="space-y-3 mb-5">
                <label className="block text-xs font-mono text-slate-300">
                  Hardware Specifications & Target System:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={architectPrompt}
                    onChange={(e) => setArchitectPrompt(e.target.value)}
                    placeholder="e.g. ESP32 LoRa Soil Moisture Sensor Node with Deep Sleep..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleGenerateArchitecture}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Generate Architecture</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-400">
                  <span>Quick Presets:</span>
                  {[
                    'ESP32 MQTT Solar Energy Monitor',
                    'Smart Irrigation Threshold Relay',
                    'BLE Temperature Beacon with Deep Sleep',
                    'I2C OLED Environmental Telemetry Station',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setArchitectPrompt(preset)}
                      className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Output */}
              {generatedSpec && (
                <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
                      Generated Firmware Specification
                    </span>
                    <button
                      onClick={handleCopySpec}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto">
                    {generatedSpec}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { usePortfolio, THEME_PRESETS, PortfolioTheme } from '../../context/PortfolioContext';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMatrix: () => void;
  onNavigateSection: (sectionId: string) => void;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export function TerminalModal({
  isOpen,
  onClose,
  onToggleMatrix,
  onNavigateSection,
}: TerminalModalProps) {
  const { currentTheme, setTheme, data } = usePortfolio();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'system.init()',
      output: (
        <div className="text-slate-300">
          <span className="text-amber-400 font-bold">GNANI ARCHITECTURE CLI v3.8.0</span>
          <br />
          Connected to microcontroller environment: <span className="text-emerald-400">ESP32 Dual-Core @ 240MHz</span>
          <br />
          Type <span className="text-cyan-400 font-bold">help</span> to view available commands.
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);

  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const body = terminalBodyRef.current;
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }, [history, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < pastCommands.length) {
          setHistoryIndex(nextIdx);
          setInputVal(pastCommands[pastCommands.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(pastCommands[pastCommands.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    sound.playKey();
    setPastCommands((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setInputVal('');

    const [cmd, ...args] = raw.split(' ');
    const lowerCmd = cmd.toLowerCase();

    let output: React.ReactNode = '';

    switch (lowerCmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-slate-300">
            <div className="text-amber-400 font-semibold mb-1">Available System Commands:</div>
            <div><span className="text-cyan-400 w-28 inline-block">about</span> : Candidate background, degree & philosophy</div>
            <div><span className="text-cyan-400 w-28 inline-block">skills</span> : Hardware & full-stack tech stack breakdown</div>
            <div><span className="text-cyan-400 w-28 inline-block">projects</span> : List featured projects with metrics</div>
            <div><span className="text-cyan-400 w-28 inline-block">workbench</span> : Navigate directly to IoT Simulator Workbench</div>
            <div><span className="text-cyan-400 w-28 inline-block">pinout</span> : Print ESP32 GPIO bus wiring layout</div>
            <div><span className="text-cyan-400 w-28 inline-block">matrix</span> : Toggle hacker digital code rain overlay</div>
            <div><span className="text-cyan-400 w-28 inline-block">sound</span> : Toggle synthesizer audio sound effects</div>
            <div><span className="text-cyan-400 w-28 inline-block">theme</span> : Switch theme (emerald | sapphire | amethyst | cyan | crimson | amber)</div>
            <div><span className="text-cyan-400 w-28 inline-block">ai [prompt]</span> : Query the Gemini Copilot from the command line</div>
            <div><span className="text-cyan-400 w-28 inline-block">contact</span> : View direct communication channels</div>
            <div><span className="text-cyan-400 w-28 inline-block">clear</span> : Clear terminal console output</div>
            <div><span className="text-cyan-400 w-28 inline-block">exit</span> : Close terminal window</div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-1 text-slate-300">
            <div className="text-amber-400 font-bold">{data.personal.name} — B.Tech Electronics & Communication Engineering</div>
            <p className="text-xs leading-relaxed text-slate-300">{data.personal.shortBio}</p>
            <div className="text-xs text-emerald-400 font-mono mt-1">
              Location: {data.personal.location} · Status: Available for Technical Roles & Internships
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <div><span className="text-amber-400 font-bold">• Embedded & IoT:</span> ESP32, Arduino, C/C++, I2C, SPI, UART, BLE, Wi-Fi, MQTT, PlatformIO</div>
            <div><span className="text-cyan-400 font-bold">• Full-Stack Web:</span> React 19, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, REST APIs</div>
            <div><span className="text-emerald-400 font-bold">• Protocols & Hardware:</span> Oscilloscopes, ADC/DAC, Logic Analyzers, KiCad, Linux CLI, Git</div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1.5 text-xs text-slate-300">
            {data.projects.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-amber-300 font-bold">{p.title}</span>
                <span className="text-slate-400">{p.category}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'workbench':
        onNavigateSection('workbench');
        onClose();
        return;

      case 'pinout':
        output = (
          <pre className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto">
{`+-------------------------------------------------------+
|                 ESP32-WROOM-32D PINOUT                 |
|                                                       |
|  [3V3] - Regulated Power      [GND] - Digital Ground   |
|  [D21] - I2C SDA (Data)       [D22] - I2C SCL (Clock)  |
|  [D23] - SPI MOSI             [D19] - SPI MISO         |
|  [D18] - SPI SCK / Relay 1    [D05] - SPI CS / Relay 2 |
|  [D34] - ADC1_CH6 (Analog)    [D35] - ADC1_CH7         |
|  [TX0] - UART0 Serial TX      [RX0] - UART0 Serial RX  |
+-------------------------------------------------------+`}
          </pre>
        );
        break;

      case 'matrix':
        onToggleMatrix();
        output = <div className="text-emerald-400">Toggled digital matrix code rain overlay.</div>;
        break;

      case 'sound':
        const newState = sound.toggle();
        output = (
          <div className="text-amber-400">
            Web Audio Synthesizer Sound Effects: {newState ? 'ENABLED [ON]' : 'MUTED [OFF]'}
          </div>
        );
        break;

      case 'theme':
        if (args[0] && ['emerald', 'sapphire', 'amethyst', 'cyan', 'crimson', 'amber'].includes(args[0].toLowerCase())) {
          const t = args[0].toLowerCase() as PortfolioTheme;
          setTheme(t);
          output = <div className="text-amber-400">Active portfolio theme switched to: {t.toUpperCase()}</div>;
        } else {
          output = (
            <div className="text-slate-400">
              Usage: <span className="text-cyan-400">theme [emerald | sapphire | amethyst | cyan | crimson | amber]</span>
            </div>
          );
        }
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <div>Email: <span className="text-amber-300">{data.personal.email}</span></div>
            <div>GitHub: <span className="text-cyan-300">{data.personal.github}</span></div>
            <div>LinkedIn: <span className="text-cyan-300">{data.personal.linkedin}</span></div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
        onClose();
        return;

      case 'ai':
        const aiPrompt = args.join(' ');
        if (!aiPrompt) {
          output = <div className="text-slate-400">Usage: ai [your question for Gnani's copilot]</div>;
        } else {
          try {
            output = <div className="text-cyan-400 animate-pulse">Connecting to Gemini API...</div>;
            setHistory((prev) => [...prev, { command: raw, output }]);
            const res = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: aiPrompt }),
            });
            const resData = await res.json();
            output = <div className="text-amber-200 whitespace-pre-wrap">{resData.reply}</div>;
          } catch {
            output = <div className="text-rose-400">Failed to query Gemini Copilot.</div>;
          }
        }
        break;

      default:
        output = (
          <div className="text-rose-400">
            Command not recognized: '{cmd}'. Type <span className="text-cyan-400 font-bold">help</span> for documentation.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: raw, output }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full rounded-2xl bg-[#050914] border border-cyan-500/30 shadow-2xl shadow-black flex flex-col overflow-hidden transition-all text-left ${
          isMaximized ? 'h-[95vh] max-w-5xl' : 'h-[520px] max-w-3xl'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080f22] border-b border-slate-800 text-xs font-mono select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-bold">gnani@embedded-linux:~$ (Hacker CLI Mode)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Log Screen */}
        <div
          ref={terminalBodyRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-3 scrollbar-none"
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span>gnani@portfolio:~$</span>
                <span className="text-white font-normal">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 px-4 py-3 bg-[#070d1e] border-t border-slate-800">
          <span className="text-cyan-400 font-mono text-xs font-bold shrink-0">
            gnani@portfolio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command ('help', 'about', 'skills', 'pinout')..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
}

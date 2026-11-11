import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface Message {
  sender: 'user' | 'model';
  text: string;
}

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CopilotChatDrawer({ isOpen, onClose }: CopilotChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'model',
      text: "Hello! I am Gnani's AI Copilot powered by Gemini. Ask me about his ECE degree, ESP32 and embedded projects, full-stack React/Node architecture, or why he's a great match for your engineering team!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const sampleQuestions = [
    'Why should we hire Gnani for an Embedded / IoT role?',
    'Tell me about his ESP32 Agricultural Irrigation project',
    'What is his full-stack experience in React & Node.js?',
    'What degree and college credentials does he hold?',
  ];

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    sound.playKey();
    const newMessages: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: newMessages.slice(-6),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'model', text: data.reply }]);
        sound.playChirp();
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'model', text: "I couldn't process that query. Please try asking again!" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'model',
          text: 'Gnani holds a B.Tech in Electronics & Communication Engineering and has completed production-grade projects across ESP32, Arduino, React, and Node.js. Feel free to connect with him directly via the contact form!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#080d1a] border-l border-amber-500/30 flex flex-col justify-between shadow-2xl shadow-black text-left animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-[#0a1122] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/30">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif-display text-white">
                Gnani AI Copilot
              </h3>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Powered by Gemini 3.8 Flash</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: 'model',
                    text: "Conversation reset. What would you like to know about Gnani's engineering work?",
                  },
                ]);
                sound.playClick();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div
          ref={messagesContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-none text-xs sm:text-sm"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'model' && (
                <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Gemini is synthesizing technical answer...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="p-3 bg-[#0a1122]/90 border-t border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Suggested Recruiter Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#080d1a] border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about Gnani's skills, ECE degree, projects..."
            className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

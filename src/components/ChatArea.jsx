import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Bot, User, SlidersHorizontal, 
  Settings2, Trash2, StopCircle, CornerDownLeft, Mic 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { logActivity } from '../utils/logger';
import toast from 'react-hot-toast';

const PROMPT_VERSIONS_KEY = 'nexus_prompt_versions';

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const getNextVersionLabel = (versions) => {
  const max = versions.reduce((acc, version) => {
    const match = /^v(\d+)$/i.exec(version.label?.trim() || '');
    if (!match) return acc;
    return Math.max(acc, Number(match[1]));
  }, 0);

  return `v${max + 1}`;
};

const getUniqueLabel = (versions, baseLabel) => {
  const normalizedBase = baseLabel.trim();
  const existing = new Set(versions.map((version) => version.label.toLowerCase()));
  if (!existing.has(normalizedBase.toLowerCase())) {
    return normalizedBase;
  }

  let counter = 2;
  let candidate = `${normalizedBase}-${counter}`;
  while (existing.has(candidate.toLowerCase())) {
    counter += 1;
    candidate = `${normalizedBase}-${counter}`;
  }

  return candidate;
};

const ChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');
  const [promptVersions, setPromptVersions] = useState(() =>
    safeParse(localStorage.getItem(PROMPT_VERSIONS_KEY), [])
  );
  const [compareSelection, setCompareSelection] = useState([]);
  const activeRequestRef = useRef(0);
  const messagesEndRef = useRef(null);

  const [config, setConfig] = useState({
    systemPrompt: 'You are an elite AI assistant. Always format code blocks clearly.',
    temperature: 0.7,
    maxLength: 1000,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(PROMPT_VERSIONS_KEY, JSON.stringify(promptVersions));
  }, [promptVersions]);

  // Voice Input Logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      toast.success("Voice captured successfully!");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    const requestId = Date.now();
    activeRequestRef.current = requestId;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: config.systemPrompt
      });

      const generationConfig = {
        temperature: config.temperature,
        maxOutputTokens: config.maxLength,
      };

      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: history,
        generationConfig,
      });

      const result = await chat.sendMessage(userMessage.content);
      const responseText = result.response.text();

      if (activeRequestRef.current !== requestId) {
        return;
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: responseText }]);
      logActivity("Text Generation", "Playground Chat", "Success", Math.round(responseText.length / 4));

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `### ⚠️ Connection Error\nCheck your \`.env.local\` file API key.\n\n\`${error.message}\``,
        isError: true
      }]);
      logActivity("System Error", "API Timeout/Auth", "Failed", 0);
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsTyping(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSavePromptVersion = () => {
    const prompt = config.systemPrompt.trim();
    if (!prompt) {
      toast.error('System prompt is empty. Add text before saving.');
      return;
    }

    const normalizedLabel = versionLabel.trim();
    const nextLabel = normalizedLabel || getNextVersionLabel(promptVersions);

    const duplicateLabel = promptVersions.some(
      (version) => version.label.toLowerCase() === nextLabel.toLowerCase()
    );

    if (duplicateLabel) {
      toast.error('A version with this label already exists.');
      return;
    }

    const version = {
      id: crypto.randomUUID(),
      label: nextLabel,
      prompt,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setPromptVersions((prev) => [version, ...prev]);
    setVersionLabel('');
    toast.success(`Saved ${nextLabel}`);
  };

  const handleRestorePromptVersion = (version) => {
    setConfig((prev) => ({ ...prev, systemPrompt: version.prompt }));
    toast.success(`Restored ${version.label}`);
  };

  const handleFavoriteToggle = (id) => {
    setPromptVersions((prev) =>
      prev.map((version) =>
        version.id === id ? { ...version, isFavorite: !version.isFavorite } : version
      )
    );
  };

  const handleDuplicateVersion = (version) => {
    const duplicateLabel = getUniqueLabel(promptVersions, `${version.label}-copy`);
    const duplicate = {
      ...version,
      id: crypto.randomUUID(),
      label: duplicateLabel,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setPromptVersions((prev) => [duplicate, ...prev]);
    toast.success(`Duplicated ${version.label}`);
  };

  const handleDeleteVersion = (id) => {
    setPromptVersions((prev) => prev.filter((version) => version.id !== id));
    setCompareSelection((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const toggleCompareSelection = (id) => {
    setCompareSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      }
      if (prev.length === 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const comparedVersions = compareSelection
    .map((id) => promptVersions.find((version) => version.id === id))
    .filter(Boolean);

  const sortedVersions = [...promptVersions].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const stopGeneration = () => {
    if (!isTyping) return;
    activeRequestRef.current = 0;
    setIsTyping(false);
    toast('Response stopped');
  };

  return (
    <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
        
        <div className="h-14 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
              <Sparkles size={12} className="text-cyan-400" /> Model: Gemini 2.5 Flash
            </span>
            {messages.length > 0 && (
              <button 
                onClick={() => { setMessages([]); toast.success("Context cleared"); }}
                className="text-xs font-semibold text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Clear Context
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded-lg border transition-colors ${showConfig ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-800/50 flex items-center justify-center mb-6 shadow-2xl">
                <Bot size={32} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Nexus Play Environment</h2>
              <p className="text-zinc-500 text-sm max-w-sm">
                Adjust the model parameters on the right, establish a system prompt, and begin generation.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-sm">
                          <User size={14} className="text-zinc-300" />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${msg.isError ? 'bg-rose-950 border-rose-900' : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/50'}`}>
                          <Bot size={14} className={msg.isError ? "text-rose-400" : "text-white"} />
                        </div>
                      )}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl p-5 ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 shadow-md' 
                        : msg.isError 
                          ? 'bg-rose-500/5 border border-rose-500/20 text-rose-200'
                          : 'bg-transparent text-zinc-300'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:shadow-xl max-w-none text-sm">
                          <ReactMarkdown
                            children={msg.content}
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-xl overflow-hidden text-xs my-4"
                                    {...props}
                                  />
                                ) : (
                                  <code className="bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded-md text-xs font-mono" {...props}>
                                    {children}
                                  </code>
                                )
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/50 mt-1 shadow-sm">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-transparent p-5 flex items-center gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-cyan-500/50" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-cyan-500/50" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-cyan-500/50" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/60 z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-10 group-focus-within:opacity-30 blur transition duration-500"></div>
            <div className="relative bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl flex items-end p-2 transition-colors focus-within:border-cyan-500/50">
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexus..."
                className="flex-1 max-h-48 min-h-[44px] bg-transparent px-4 py-3 resize-none focus:outline-none text-zinc-100 placeholder:text-zinc-500 text-sm leading-relaxed"
                rows={1}
                style={{ height: "auto" }}
              />
              
              <div className="flex items-center gap-2 px-2 pb-1.5">
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                  <CornerDownLeft size={10} /> Enter to send
                </span>
                
                <button 
                  onClick={startListening} 
                  className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  title="Dictate prompt"
                >
                  <Mic size={18} />
                </button>

                {isTyping ? (
                  <button
                    onClick={stopGeneration}
                    className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 p-2.5 rounded-xl transition-colors"
                  >
                    <StopCircle size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={!input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white disabled:text-zinc-600 p-2.5 rounded-xl transition-all shadow-lg disabled:shadow-none"
                  >
                    <Send size={18} className={input.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-zinc-800/60 bg-zinc-950/50 backdrop-blur-xl z-20 flex flex-col overflow-hidden whitespace-nowrap"
          >
            <div className="h-14 border-b border-zinc-800/60 flex items-center px-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 size={16} className="text-cyan-400" /> Model Configuration
              </h3>
            </div>
            
            <div className="p-6 flex flex-col gap-8 overflow-y-auto">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">System Instruction</label>
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs h-32 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner text-zinc-300 leading-relaxed"
                  placeholder="Define the AI's behavior..."
                />

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={versionLabel}
                    onChange={(e) => setVersionLabel(e.target.value)}
                    placeholder={`Label (default ${getNextVersionLabel(promptVersions)})`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500/50 text-zinc-200"
                  />
                  <button
                    onClick={handleSavePromptVersion}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                  >
                    Save
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                    Saved Versions ({promptVersions.length})
                  </p>
                  {compareSelection.length > 0 && (
                    <button
                      onClick={() => setCompareSelection([])}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      Clear Compare
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {promptVersions.length === 0 ? (
                    <p className="text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl p-3">
                      No saved prompt versions yet.
                    </p>
                  ) : (
                    sortedVersions.map((version) => (
                      <div key={version.id} className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/70">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <button
                            onClick={() => handleRestorePromptVersion(version)}
                            className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 truncate"
                            title="Restore this version"
                          >
                            {version.label}
                          </button>
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              onClick={() => toggleCompareSelection(version.id)}
                              className={`px-2 py-1 rounded-md border ${compareSelection.includes(version.id) ? 'border-cyan-500/40 text-cyan-300' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Compare
                            </button>
                            <button
                              onClick={() => handleFavoriteToggle(version.id)}
                              className={`px-2 py-1 rounded-md border ${version.isFavorite ? 'border-amber-500/40 text-amber-300' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Fav
                            </button>
                            <button
                              onClick={() => handleDuplicateVersion(version)}
                              className="px-2 py-1 rounded-md border border-zinc-700 text-zinc-500 hover:text-zinc-300"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => handleDeleteVersion(version.id)}
                              className="px-2 py-1 rounded-md border border-zinc-700 text-zinc-500 hover:text-rose-300"
                            >
                              Del
                            </button>
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-600 mb-2">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-400 line-clamp-2">{version.prompt}</p>
                      </div>
                    ))
                  )}
                </div>

                {comparedVersions.length === 2 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt Compare</p>
                    <div className="grid grid-cols-2 gap-2">
                      {comparedVersions.map((version) => (
                        <div key={version.id} className="border border-zinc-800 rounded-xl p-2 bg-zinc-900/70">
                          <p className="text-[10px] text-cyan-300 mb-1 truncate">{version.label}</p>
                          <textarea
                            readOnly
                            value={version.prompt}
                            className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] text-zinc-400 resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-widest text-zinc-500">Temperature</span>
                  <span className="bg-zinc-900 px-2 py-1 rounded-md text-cyan-400 font-mono border border-zinc-800">{config.temperature}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-medium">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-widest text-zinc-500">Max Length</span>
                  <span className="bg-zinc-900 px-2 py-1 rounded-md text-cyan-400 font-mono border border-zinc-800">{config.maxLength}</span>
                </div>
                <input
                  type="range" min="100" max="4000" step="100"
                  value={config.maxLength}
                  onChange={(e) => setConfig({ ...config, maxLength: parseInt(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;
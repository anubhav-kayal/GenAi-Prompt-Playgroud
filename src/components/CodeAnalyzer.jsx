import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, ArrowRight, Terminal, Sparkles, Loader2, 
  Copy, Check, RotateCcw, Cpu, ShieldCheck, Download 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { logActivity } from '../utils/logger';
import toast from 'react-hot-toast';

const CodeAnalyzer = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputCode.trim()) return;
    setIsAnalyzing(true);
    setOutputCode('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are a world-class Staff Software Engineer. Analyze the provided code for logic errors, security vulnerabilities, and performance bottlenecks. Then, provide a refactored version that is clean, modular, and follows industry best practices. Format your response in Markdown with clear headings."
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: inputCode }] }],
      });

      const responseText = result.response.text();
      setOutputCode(responseText);
      logActivity("Code Refactor", "AST Optimization", "Success", Math.round(responseText.length / 4));
      toast.success("Code successfully refactored!");

    } catch (error) {
      setOutputCode(`### ⚠️ System Fault\nAnalysis interrupted. Check connectivity or API credentials.\n\n\`${error.message}\``);
      logActivity("System Error", "API Timeout/Auth", "Failed", 0);
      toast.error("Analysis failed. Check logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([outputCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus_refactored_code.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!");
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 p-6 lg:p-8 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
              <Terminal className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">Engine<span className="text-cyan-500">.</span>Analyzer</h2>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Professional-grade code refactoring and architectural optimization.</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !inputCode.trim()}
          className="relative group overflow-hidden bg-zinc-100 text-zinc-950 px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="text-cyan-600" />}
          {isAnalyzing ? 'Processing AST...' : 'Optimize Code'}
        </motion.button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden group focus-within:border-zinc-700/50 transition-all shadow-2xl"
        >
          <div className="bg-zinc-900/80 px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-2">Source_Input.js</span>
            </div>
            <button onClick={() => { setInputCode(''); toast.success("Editor cleared"); }} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <RotateCcw size={14} />
            </button>
          </div>
          
          <div className="relative flex-1 group">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-zinc-950/20 border-r border-zinc-800/40 flex flex-col items-center pt-6 text-[10px] font-mono text-zinc-700 select-none">
              {Array.from({length: 20}).map((_, i) => <div key={i} className="leading-relaxed">{i + 1}</div>)}
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="// Paste your raw logic here for deep analysis..."
              className="w-full h-full bg-transparent pl-14 p-6 resize-none focus:outline-none text-zinc-300 font-mono text-sm leading-relaxed placeholder:text-zinc-800"
              spellCheck="false"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl relative"
        >
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="bg-zinc-900/80 px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-cyan-500/10 rounded border border-cyan-500/20">
                <Cpu size={12} className="text-cyan-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/80">Analysis_Output.md</span>
            </div>
            
            <div className="flex items-center gap-3">
              {outputCode && (
                <>
                  <button onClick={downloadCode} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                    <Download size={12} /> Download
                  </button>
                  <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            {outputCode ? (
              <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-white prose-p:leading-relaxed prose-pre:bg-zinc-950/50 prose-pre:border prose-pre:border-zinc-800/80 w-full max-w-none text-sm">
                <ReactMarkdown
                  children={outputCode}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl border border-zinc-800/50 my-6 shadow-2xl"
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
                  <ShieldCheck size={28} className="text-zinc-700" />
                </div>
                <h3 className="text-zinc-400 font-bold mb-1 italic">Idle System</h3>
                <p className="text-zinc-600 text-xs max-w-[200px]">Awaiting source code injection for architectural review.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CodeAnalyzer;
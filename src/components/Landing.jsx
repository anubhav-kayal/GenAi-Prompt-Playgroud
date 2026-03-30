import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, MessageSquare, Code2, BarChart3, ShieldCheck, 
  ArrowRight, Globe, Database, Cpu, Sparkles, Terminal, Activity, 
  Lock, CheckCircle 
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* 🧭 Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 flex items-center justify-between px-10 z-[100] bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <Zap size={18} className="text-black fill-black" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">NEXUS<span className="text-cyan-500">.AI</span></span>
        </div>
        <button onClick={() => navigate('/login')} className="group flex items-center gap-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl transition-all">
          Launch Console <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* 🌪 HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full animate-pulse" />
        
        <div className="relative z-10 text-center max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-10"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Enterprise AI Infrastructure • v2.5 Stable</span>
          </motion.div>

          <h1 className="text-7xl md:text-[130px] font-display font-bold tracking-tighter leading-[0.8] mb-12 uppercase">
            BUILD. AUDIT.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500">SCALE.</span>
          </h1>

          <p className="text-zinc-500 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            The professional orchestration suite for high-concurrency AI workflows. 
            Refactor code, audit prompts, and monitor token economy in one unified interface.
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="px-12 py-6 bg-white text-black font-black rounded-2xl text-xl transition-all hover:scale-105 shadow-[0_0_60px_rgba(6,182,212,0.4)]"
          >
            Initialize Platform
          </button>
        </div>
      </section>

      {/* 📦 BENTO GRID */}
      <section className="py-32 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            
            <div className="md:col-span-2 row-span-1 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
              <MessageSquare className="text-cyan-500 mb-6" size={32} />
              <div>
                <h3 className="text-3xl font-black mb-3">Neural Playground</h3>
                <p className="text-zinc-500 text-sm max-w-md">Fine-tune model behavior with granular temperature controls and persistent system instruction sets.</p>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group">
              <ShieldCheck className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-bold mb-2">OAuth 2.0</h3>
              <p className="text-zinc-600 text-xs">Firebase Secured</p>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group">
              <Activity className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-bold mb-2">Live Metrics</h3>
              <p className="text-zinc-600 text-xs">Real-time Logging</p>
            </div>

            <div className="md:col-span-2 row-span-1 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
              <Code2 className="text-purple-500 mb-6" size={32} />
              <div>
                <h3 className="text-3xl font-black mb-3">Engine.Analyzer</h3>
                <p className="text-zinc-500 text-sm max-w-md">Deep-packet code inspection using Gemini 2.5 Flash for security audits and AST-based refactoring.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🛠 DEEP DIVE: ANALYZER */}
      <section className="py-48 px-10 bg-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-cyan-500 font-black text-xs uppercase tracking-[0.4em] mb-6 block">Module 01 // Static Analysis</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase">Automated <br />Code <span className="text-zinc-700">Auditing.</span></h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Nexus.ai doesn't just rewrite code—it explains it. Our analyzer performs a recursive review of your logic to detect performance bottlenecks and exposed secrets before they reach production.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                <Lock size={20} className="text-cyan-400 mb-2" />
                <h4 className="text-sm font-bold">Security First</h4>
              </div>
              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                <Database size={20} className="text-purple-400 mb-2" />
                <h4 className="text-sm font-bold">Blob Export</h4>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
            <div className="bg-black rounded-[1.6rem] aspect-video overflow-hidden p-6 font-mono text-[11px] relative">
               <div className="absolute top-4 right-6 text-emerald-500/40 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> COMPILING_AST
               </div>
               <div className="space-y-3 mt-4">
                 <p className="text-zinc-600">Checking for vulnerabilities...</p>
                 <p className="text-rose-400/80">- if (apiKey === "sk-...") {'{'}</p>
                 <p className="text-emerald-400/80">+ if (process.env.API_KEY) {'{'}</p>
                 <p className="text-zinc-500 mt-6">// Analysis Complete: 1 security flaw resolved.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎙 DEEP DIVE: PLAYGROUND */}
      <section className="py-48 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-8 aspect-square flex flex-col justify-center gap-8 relative overflow-hidden">
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
             <div className="space-y-6 relative z-10">
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} className="h-full bg-cyan-500" />
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '40%' }} className="h-full bg-purple-500" />
                </div>
                <div className="mt-10 p-6 bg-black rounded-2xl border border-white/5 flex items-center justify-center">
                   <div className="flex gap-1 items-end h-8">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [10, 24, 12, 28, 10] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          className="w-1 bg-cyan-500/50 rounded-full" 
                        />
                      ))}
                   </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-purple-500 font-black text-xs uppercase tracking-[0.4em] mb-6 block">Module 02 // Neural Sandbox</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase">Voice Enabled <br />Prompt <span className="text-zinc-700">Design.</span></h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Iterate faster than ever. Toggle between high-creativity and strict-logic modes using physical sliders, or use integrated voice recognition to dictate complex system prompts.
            </p>
            <ul className="space-y-4">
               {["Granular Temperature Control", "Max Token Boundaries", "Web Speech API Integration"].map((text, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                    <CheckCircle size={16} className="text-cyan-500" /> {text}
                 </li>
               ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-cyan-500 fill-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
            <span className="text-2xl font-black tracking-tighter uppercase">NEXUS.AI</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] mb-2">Enterprise Software Solutions</p>
            <p className="text-white font-bold text-sm">Developed by Anubhav Kayal</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
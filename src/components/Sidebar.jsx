import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, MessageSquare, Sliders, Zap, LayoutDashboard, Code2 } from 'lucide-react';

const Sidebar = ({ config, setConfig }) => {
  return (
    <div className="w-80 h-full bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800/60 p-6 flex flex-col gap-6 shadow-2xl z-10 overflow-y-auto font-sans">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
          <Zap className="text-white" size={20} />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter font-display">
          Nexus<span className="text-cyan-400">.ai</span>
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Core Platform</p>
        
        <NavLink 
          to="/dashboard" 
          end 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/dashboard/playground" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <MessageSquare size={18} /> AI Playground
        </NavLink>

        <NavLink 
          to="/dashboard/code-analyzer" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <Code2 size={18} /> Code Analyzer
        </NavLink>

        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <Settings size={18} /> Settings
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-900 my-2"></div>

      {/* Contextual Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
            <MessageSquare size={12} /> System Instruction
          </label>
          <textarea
            value={config.systemPrompt}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-xs h-32 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all text-zinc-300"
            placeholder="Persona definition..."
          />
        </div>

        {/* Parameters Section */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
            <Sliders size={12} /> Model Parameters
          </label>
          
          <div className="space-y-4">
            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                <span>Creativity</span>
                <span className="text-cyan-400 font-mono">{config.temperature}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Token Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                <span>Response Limit</span>
                <span className="text-cyan-400 font-mono">{config.maxLength}</span>
              </div>
              <input
                type="range" min="100" max="4000" step="100"
                value={config.maxLength}
                onChange={(e) => setConfig({ ...config, maxLength: parseInt(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
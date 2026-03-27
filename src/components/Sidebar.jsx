import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, MessageSquare, Sliders, Zap, LayoutDashboard, Code2 } from 'lucide-react';

const Sidebar = ({ config, setConfig }) => {
  return (
    <div className="w-80 h-full bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800/60 p-6 flex flex-col gap-6 shadow-2xl z-10 overflow-y-auto">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
          <Zap className="text-white" size={20} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
          Nexus<span className="text-cyan-400">.ai</span>
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Menu</p>
        
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        
        <NavLink to="/playground" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
          <MessageSquare size={18} /> AI Playground
        </NavLink>

        <NavLink to="/code-analyzer" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
          <Code2 size={18} /> Code Analyzer
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-800/50 my-2"></div>

      {/* System Instruction */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <MessageSquare size={14} /> System Instruction
        </label>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner placeholder:text-zinc-600 leading-relaxed"
          placeholder="e.g. You are an expert React developer. Always answer in Markdown..."
        />
      </div>

      {/* Parameters */}
      <div className="flex flex-col gap-6 pb-4">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Sliders size={14} /> Parameters
        </label>

        {/* Temperature */}
        <div className="space-y-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-300 font-medium">Temperature</span>
            <span className="bg-zinc-800 px-2 py-1 rounded-md text-cyan-400 font-mono text-xs border border-zinc-700">{config.temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-300 font-medium">Max Length</span>
            <span className="bg-zinc-800 px-2 py-1 rounded-md text-cyan-400 font-mono text-xs border border-zinc-700">{config.maxLength}</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={config.maxLength}
            onChange={(e) => setConfig({ ...config, maxLength: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
          />
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;
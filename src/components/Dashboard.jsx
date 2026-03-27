import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Cpu, Zap, Clock, ArrowRight, Database, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  // Mock data to make the frontend look "heavy" and data-driven
  const stats = [
    { label: "Total API Calls", value: "1,284", icon: <Activity size={20} className="text-cyan-400" />, trend: "+12.5%" },
    { label: "Tokens Processed", value: "842.5k", icon: <Cpu size={20} className="text-purple-400" />, trend: "+5.2%" },
    { label: "Compute Time", value: "4.2 hrs", icon: <Clock size={20} className="text-emerald-400" />, trend: "-2.1%" },
    { label: "Active Models", value: "Gemini 1.5", icon: <Database size={20} className="text-blue-400" />, trend: "Live" },
  ];

  const recentActivity = [
    { id: 1, type: "Code Refactor", prompt: "Refactor nested loops in Python...", time: "2 mins ago", status: "Success" },
    { id: 2, type: "Text Generation", prompt: "Write a system prompt for a...", time: "15 mins ago", status: "Success" },
    { id: 3, type: "Code Refactor", prompt: "Debug React useEffect infinite...", time: "1 hour ago", status: "Success" },
    { id: 4, type: "Error", prompt: "API Rate Limit Exceeded", time: "3 hours ago", status: "Failed" },
  ];

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto relative z-10">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="text-cyan-400" size={32} />
            Overview Dashboard
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">Welcome back. Here is your API usage and generation history.</p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/50">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : stat.trend.startsWith('-') ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-800 text-zinc-300'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Progress / Usage */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              API Quota Usage
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Monthly Tokens</span>
                  <span className="text-cyan-400 font-mono">84.2%</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 border border-zinc-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{ width: '84.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Requests per Minute (RPM)</span>
                  <span className="text-emerald-400 font-mono">12 / 15</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 border border-zinc-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <NavLink to="/playground" className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 transition-colors group">
                <span className="text-sm font-medium text-zinc-300 group-hover:text-cyan-400 transition-colors">Open AI Playground</span>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
              </NavLink>
              <NavLink to="/code-analyzer" className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 transition-colors group">
                <span className="text-sm font-medium text-zinc-300 group-hover:text-cyan-400 transition-colors">Refactor a Component</span>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Log */}
        <div className="col-span-2 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Generations</h3>
            <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${log.status === 'Success' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {log.type === 'Code Refactor' ? <Database size={16} /> : <Activity size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{log.type}</p>
                    <p className="text-xs text-zinc-500 truncate w-64">{log.prompt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold mb-1 ${log.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>{log.status}</p>
                  <p className="text-xs text-zinc-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
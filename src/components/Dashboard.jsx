import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Cpu, Zap, Target, ArrowRight, Database, BarChart3, Terminal } from 'lucide-react';
import { getLogs, getStats } from '../utils/logger';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [statsData, setStatsData] = useState({ totalCalls: 0, successRate: 0, totalTokens: 0 });

  // Fetch the real data from local storage when the dashboard loads
  useEffect(() => {
    setLogs(getLogs().slice(0, 5)); // Grab the 5 most recent activities
    setStatsData(getStats());
  }, []);

  // Helper to format large token numbers (e.g., 1200 -> 1.2k)
  const formatTokens = (num) => {
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
  };

  // Dynamic Stats Array
  const stats = [
    { label: "Total API Calls", value: statsData.totalCalls.toString(), icon: <Activity size={18} className="text-cyan-400" />, trend: "Live" },
    { label: "Tokens Processed", value: formatTokens(statsData.totalTokens), icon: <Cpu size={18} className="text-purple-400" />, trend: "Live" },
    { label: "Success Rate", value: `${statsData.successRate}%`, icon: <Target size={18} className="text-emerald-400" />, trend: statsData.successRate >= 80 ? "+Healthy" : "-Warn" },
    { label: "Active Models", value: "Gemini 2.5", icon: <Database size={18} className="text-blue-400" />, trend: "Flash" },
  ];

  // Calculate dynamic quota progress (assuming a 10,000 token test limit for the UI)
  const quotaPercentage = Math.min((statsData.totalTokens / 10000) * 100, 100).toFixed(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col h-full w-full p-8 lg:p-10 overflow-y-auto relative z-10 scroll-smooth">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Overview
        </h2>
        <p className="text-zinc-400 mt-2 text-sm max-w-xl leading-relaxed">
          Monitor your API usage, token consumption, and recent generation history across all active Nexus AI models.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-8">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} variants={itemVariants}
              className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800/80 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : stat.trend.startsWith('-') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50'}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Complex Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column: Usage & Actions */}
          <motion.div variants={itemVariants} className="xl:col-span-1 flex flex-col gap-6">
            
            {/* Dynamic Quota Card */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                <Zap size={18} className="text-yellow-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Usage & Quotas</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-300 mb-0.5">Test Environment Tokens</p>
                      <p className="text-[10px] text-zinc-500">{statsData.totalTokens} / 10k limit</p>
                    </div>
                    <span className="text-cyan-400 font-mono text-sm font-bold">{quotaPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800/80 shadow-inner overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${quotaPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 backdrop-blur-xl border border-cyan-800/30 rounded-2xl p-6 shadow-2xl flex-1 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors duration-500">
                <Terminal size={120} />
              </div>
              <h3 className="text-sm font-bold text-cyan-50 mb-6 relative z-10">Quick Launch</h3>
              <div className="flex flex-col gap-3 relative z-10">
                <NavLink to="/playground" className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all group/btn">
                  <span className="text-sm font-semibold text-zinc-300 group-hover/btn:text-cyan-400 transition-colors">Open AI Playground</span>
                  <ArrowRight size={16} className="text-zinc-600 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-1 transition-all" />
                </NavLink>
                <NavLink to="/code-analyzer" className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all group/btn">
                  <span className="text-sm font-semibold text-zinc-300 group-hover/btn:text-cyan-400 transition-colors">Refactor Codebase</span>
                  <ArrowRight size={16} className="text-zinc-600 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-1 transition-all" />
                </NavLink>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Timeline Activity */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/50">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activity Feed</h3>
              <button className="text-[10px] font-bold text-zinc-400 hover:text-cyan-400 uppercase tracking-widest transition-colors bg-zinc-950 py-1.5 px-3 rounded-lg border border-zinc-800 hover:border-cyan-900">View Logs</button>
            </div>
            
            <div className="relative">
              {logs.length > 0 ? (
                <>
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-800"></div>
                  <div className="flex flex-col gap-8 relative z-10">
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-6 group">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-300 ${log.status === 'Success' ? 'bg-zinc-950 border-cyan-900/50 text-cyan-400' : 'bg-zinc-950 border-rose-900/50 text-rose-400'}`}>
                            {log.type.includes('Code') ? <Database size={18} /> : <Activity size={18} />}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-bold text-zinc-200">{log.type}</p>
                            <span className="text-[10px] text-zinc-500 font-medium font-mono">{log.time}</span>
                          </div>
                          <p className="text-sm text-zinc-400">{log.target}</p>
                          <div className="mt-3 inline-flex items-center gap-3">
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800/80">
                              <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">{log.status}</span>
                            </div>
                            {log.tokens > 0 && (
                              <span className="text-[10px] text-zinc-500 font-mono">~{log.tokens} tokens</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <Activity size={24} className="text-zinc-700" />
                  </div>
                  <p className="text-zinc-400 font-bold mb-1">No activity yet</p>
                  <p className="text-zinc-600 text-sm">Head over to the Playground to run your first generation.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
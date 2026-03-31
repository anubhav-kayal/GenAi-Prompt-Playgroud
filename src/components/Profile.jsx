import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  UserRound,
  Mail,
  ShieldCheck,
  Sparkles,
  Activity,
  Target,
  Cpu,
  Clock3,
  Settings,
  BadgeCheck,
} from 'lucide-react';
import { getCachedUserProfile, getSafeStoredObject } from '../utils/authSecurity';
import { getLogs, getStats } from '../utils/logger';

const Profile = () => {
  const fallbackProfile = {
    name: 'Nexus User',
    email: 'No email connected',
    avatar: '',
  };

  const userProfile = getCachedUserProfile() || fallbackProfile;
  const stats = getStats();
  const recentLogs = getLogs().slice(0, 6);
  const preferences = getSafeStoredObject('nexus_prefs', {
    streamResponses: true,
    saveHistory: true,
  });

  const joinedDate = useMemo(() => {
    if (!recentLogs.length) return 'Just now';
    const oldestTimestamp = recentLogs[recentLogs.length - 1]?.timestamp;
    if (!oldestTimestamp) return 'Recently';
    return new Date(oldestTimestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [recentLogs]);

  const profileStats = [
    {
      label: 'Total API Calls',
      value: stats.totalCalls,
      icon: <Activity size={16} className="text-cyan-400" />,
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <Target size={16} className="text-emerald-400" />,
    },
    {
      label: 'Tokens Processed',
      value: stats.totalTokens,
      icon: <Cpu size={16} className="text-violet-400" />,
    },
  ];

  return (
    <div className="flex h-full w-full p-8 lg:p-10 overflow-y-auto relative z-10">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_55%)] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-700/80 bg-zinc-950 flex items-center justify-center shadow-xl">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserRound size={38} className="text-cyan-400" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-bold mb-2">Account Profile</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">{userProfile.name}</h2>
              <p className="text-zinc-400 flex items-center gap-2 text-sm md:text-base">
                <Mail size={16} className="text-zinc-500" /> {userProfile.email}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-600/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck size={14} /> Active Account
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-300 text-xs font-semibold">
                  <Clock3 size={14} /> Active since {joinedDate}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {profileStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 backdrop-blur-md p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">{item.label}</p>
                {item.icon}
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Security & Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                  <Sparkles size={15} className="text-cyan-400" /> Stream Responses
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${preferences.streamResponses ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {preferences.streamResponses ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                  <Settings size={15} className="text-cyan-400" /> Save History
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${preferences.saveHistory ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {preferences.saveHistory ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Activity</h3>
            </div>

            {recentLogs.length ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{log.type}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">{log.time || '-'}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{log.target}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-32 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 flex items-center justify-center">
                <p className="text-sm text-zinc-500">No activity recorded yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

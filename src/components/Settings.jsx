import React, { useState, useEffect, useRef } from 'react';
import { Key, User, Palette, Save, ShieldCheck, AlertCircle, Lock, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCachedUserProfile, getSafeStoredObject } from '../utils/authSecurity';

// Custom Mouse-Tracking Spotlight Component
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md transition-colors duration-500 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [userProfile, setUserProfile] = useState({ name: 'Guest', email: '', avatar: '' });
  
  // App Preferences State
  const [toggles, setToggles] = useState({
    streamResponses: true,
    saveHistory: true,
  });

  // INITIALIZATION: Load all saved data when the page opens
  useEffect(() => {
    // 1. Load API Key
    const savedKey = localStorage.getItem('nexus_api_key');
    if (savedKey) setApiKey(savedKey);

    // 2. Load Real Google Auth Profile
    const savedUser = getCachedUserProfile();
    if (savedUser) setUserProfile(savedUser);

    // 3. Load User Preferences
    const savedPrefs = getSafeStoredObject('nexus_prefs', null);
    if (savedPrefs) setToggles(savedPrefs);
  }, []);

  // Save API Key Function
  const handleSaveKey = () => {
    if (apiKey.trim() === '') return;
    localStorage.setItem('nexus_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Save Preferences Function
  const handleToggle = (key) => {
    const newToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(newToggles);
    // Instantly save the new toggle state to localStorage
    localStorage.setItem('nexus_prefs', JSON.stringify(newToggles));
  };

  return (
    <div className="flex h-full w-full p-8 lg:p-12 overflow-y-auto relative z-10">
      
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none -z-10"></div>

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Sub-Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6">Settings</h2>
            <nav className="flex flex-col gap-2">
              {[
                { id: 'api', icon: Key, label: 'API & Keys' },
                { id: 'profile', icon: User, label: 'Account Profile' },
                { id: 'appearance', icon: Palette, label: 'Preferences' },
                { id: 'security', icon: Lock, label: 'Security' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                    activeTab === tab.id 
                      ? 'bg-zinc-800/80 text-cyan-400 shadow-inner border border-zinc-700/50' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <tab.icon size={18} className={activeTab === tab.id ? "text-cyan-400" : "text-zinc-500"} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Column: Settings Content */}
        <div className="flex-1 max-w-3xl flex flex-col gap-8 pb-20">
          
          {activeTab === 'api' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">API Configuration</h3>
                <p className="text-zinc-400 text-sm">Manage your integration keys and set up your environment boundaries.</p>
              </div>

              <SpotlightCard>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800/50">
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner">
                    <Database size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Google Gemini Protocol</h4>
                    <p className="text-xs text-zinc-500">LLM Generation Engine Override</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Custom Secret Key</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSyB..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 pl-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-zinc-300 placeholder:text-zinc-700 shadow-inner"
                      />
                    </div>
                    <button
                      onClick={handleSaveKey}
                      className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                  
                  {/* Status Message */}
                  <div className="h-6 flex items-center">
                    {isSaved ? (
                      <p className="text-emerald-400 text-xs flex items-center gap-1.5 font-bold animate-pulse">
                        <ShieldCheck size={14} /> Key saved locally. It will override your .env file.
                      </p>
                    ) : (
                      <p className="text-zinc-500 text-xs flex items-center gap-1.5 font-medium">
                        <AlertCircle size={14} /> Leave blank to use the default environment variable key.
                      </p>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Account Profile</h3>
                <p className="text-zinc-400 text-sm">Manage your personal data and active workspaces.</p>
              </div>

              <SpotlightCard>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border-4 border-zinc-950 shadow-2xl relative overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-cyan-400">GU</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">{userProfile.name}</h4>
                    <p className="text-sm text-zinc-400 mb-3">{userProfile.email || 'No email attached'}</p>
                    <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border border-cyan-500/20">Pro Tier</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">System Preferences</h3>
                <p className="text-zinc-400 text-sm">Customize the engine's behavior and aesthetics.</p>
              </div>

              <SpotlightCard>
                <div className="space-y-8">
                  
                  {/* Custom CSS Toggle 1 */}
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleToggle('streamResponses')}>
                    <div>
                      <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Stream Generation</p>
                      <p className="text-xs text-zinc-500 mt-1">Render LLM tokens in real-time as they arrive.</p>
                    </div>
                    <button 
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${toggles.streamResponses ? 'bg-cyan-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${toggles.streamResponses ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div className="h-px bg-zinc-800/50 w-full"></div>

                  {/* Custom CSS Toggle 2 */}
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleToggle('saveHistory')}>
                    <div>
                      <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Save Chat History</p>
                      <p className="text-xs text-zinc-500 mt-1">Store prompts locally for future reference.</p>
                    </div>
                    <button 
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${toggles.saveHistory ? 'bg-cyan-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${toggles.saveHistory ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <SpotlightCard className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-inner mb-4">
                  <Lock size={24} className="text-zinc-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Security Hub</h4>
                <p className="text-sm text-zinc-500 max-w-sm">Manage two-factor authentication, active sessions, and OAuth connections.</p>
                <button className="mt-6 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white rounded-lg transition-colors border border-zinc-700">
                  Setup 2FA
                </button>
              </SpotlightCard>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
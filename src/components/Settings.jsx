import React, { useState, useEffect } from 'react';
import { Key, User, Palette, Save, ShieldCheck, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load the key from localStorage when the component mounts
  useEffect(() => {
    const savedKey = localStorage.getItem('nexus_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim() === '') return;
    localStorage.setItem('nexus_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide the success message after 3 seconds
  };

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto relative z-10">
      
      {/* Background glowing effects */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Platform Settings</h2>
        <p className="text-zinc-400 mt-2 text-sm">Manage your API keys, preferences, and account details.</p>
      </div>

      <div className="max-w-4xl flex flex-col gap-8">
        
        {/* Section 1: API Configuration */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
            <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/50">
              <Key size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Configuration</h3>
              <p className="text-xs text-zinc-500">Connect your Google Gemini API key to power the application.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl">
            <label className="text-sm font-semibold text-zinc-300">Google Gemini API Key</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyB..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono text-zinc-300 placeholder:text-zinc-700"
                />
              </div>
              <button
                onClick={handleSaveKey}
                className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
              >
                <Save size={16} />
                Save Key
              </button>
            </div>
            
            {/* Status Message */}
            <div className="flex items-center gap-2 mt-2">
              {isSaved ? (
                <p className="text-emerald-400 text-xs flex items-center gap-1 font-medium"><ShieldCheck size={14} /> API Key encrypted and saved to localStorage.</p>
              ) : (
                <p className="text-zinc-500 text-xs flex items-center gap-1"><AlertCircle size={14} /> Keys are stored locally in your browser and never sent to our servers.</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Preferences (UI Mock) */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
            <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/50">
              <Palette size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interface Preferences</h3>
              <p className="text-xs text-zinc-500">Customize your workspace experience.</p>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Stream Responses</p>
                <p className="text-xs text-zinc-500">Show AI output typing out in real-time.</p>
              </div>
              <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Syntax Highlighting Theme</p>
                <p className="text-xs text-zinc-500">Color scheme for code blocks.</p>
              </div>
              <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg focus:outline-none focus:border-cyan-500 p-2 cursor-pointer">
                <option>VS Code Dark+</option>
                <option>Dracula</option>
                <option>GitHub Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Profile (UI Mock) */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
            <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/50">
              <User size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Info</h3>
              <p className="text-xs text-zinc-500">Your current plan and details.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-800 shadow-inner">
              <span className="text-2xl font-bold text-zinc-500">AK</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-1">Anubhav Kayal</h4>
              <p className="text-sm text-zinc-400 mb-2">Pro Developer Tier</p>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md border border-emerald-500/20">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
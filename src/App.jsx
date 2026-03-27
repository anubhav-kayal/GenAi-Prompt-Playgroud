import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import CodeAnalyzer from './components/CodeAnalyzer';
import Dashboard from './components/Dashboard';



const Settings = () => <div className="p-8 text-white h-full flex items-center justify-center text-2xl font-bold">App Settings...</div>;

function App() {
  // Global state to pass down to different routes
  const [config, setConfig] = useState({
    systemPrompt: '',
    temperature: 0.7,
    maxLength: 1000,
  });

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-zinc-50 font-sans tracking-wide">
        
        {/* Sidebar is now global navigation */}
        <Sidebar config={config} setConfig={setConfig} />
        
        {/* Main Content Area changes based on the URL */}
        <main className="flex-1 relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playground" element={<ChatArea config={config} />} />
            <Route path="/code-analyzer" element={<CodeAnalyzer />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
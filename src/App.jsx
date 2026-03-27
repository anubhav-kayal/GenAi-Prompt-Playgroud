import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [config, setConfig] = useState({
    systemPrompt: '',
    temperature: 0.7,
    maxLength: 1000,
  });

  return (
    // Added a subtle radial gradient for a premium dark mode feel
    <div className="flex h-screen overflow-hidden bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-zinc-50 font-sans tracking-wide">
      <Sidebar config={config} setConfig={setConfig} />
      <ChatArea config={config} />
    </div>
  );
}

export default App;
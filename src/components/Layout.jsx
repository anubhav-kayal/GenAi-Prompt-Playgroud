import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Zap, LayoutDashboard, MessageSquare, Code2, Settings, 
  Search, Bell, LogOut, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock Google OAuth User Data
  const user = {
    name: "Anubhav Kayal",
    email: "anubhav@vit.edu",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Anubhav" // Cute dynamic avatar
  };

  const handleLogout = () => {
    // Later, you will put your Google Auth sign-out logic here
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* 1. Global Sidebar */}
      <div className="w-64 bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col z-20 relative">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md shadow-lg shadow-cyan-500/20">
              <Zap className="text-white" size={16} />
            </div>
            <span className="text-lg font-extrabold tracking-tighter">Nexus<span className="text-cyan-400">.ai</span></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Platform</p>
          
          {[
            { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
            { to: "/playground", icon: <MessageSquare size={18} />, label: "Playground" },
            { to: "/code-analyzer", icon: <Code2 size={18} />, label: "Code Analyzer" },
            { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
          ].map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-zinc-800/80 text-cyan-400 shadow-inner' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-8 z-50 sticky top-0">
          
          {/* Global Search Mockup */}
          <div className="flex items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search generations, settings..." 
                className="w-64 lg:w-96 bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block bg-zinc-800 text-zinc-400 px-1.5 rounded text-[10px] font-mono border border-zinc-700">⌘</kbd>
                <kbd className="hidden sm:inline-block bg-zinc-800 text-zinc-400 px-1.5 rounded text-[10px] font-mono border border-zinc-700">K</kbd>
              </div>
            </div>
          </div>

          {/* Right Actions & Auth Profile */}
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full border border-zinc-950"></span>
            </button>

            <div className="w-px h-6 bg-zinc-800"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-zinc-900 py-1 px-2 rounded-lg transition-colors"
              >
                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold leading-tight">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">{user.email}</p>
                </div>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Account</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Billing & Quotas</button>
                    <div className="h-px bg-zinc-800 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. Page Content Area */}
        <div className="flex-1 overflow-auto relative">
           {/* Outlet is where React Router injects your Dashboard, Playground, etc. */}
           <Outlet /> 
        </div>

      </div>
    </div>
  );
};

export default Layout;
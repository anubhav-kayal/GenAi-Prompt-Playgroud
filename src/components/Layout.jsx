import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Zap, LayoutDashboard, MessageSquare, Code2, Settings, 
  Search, Bell, LogOut, ChevronDown, Activity, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { cacheUserProfile, clearCachedUserProfile, getCachedUserProfile } from '../utils/authSecurity';



const Layout = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [authProfile, setAuthProfile] = useState(getCachedUserProfile());
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Keyboard Shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setAuthProfile(null);
        return;
      }

      const profile = cacheUserProfile({
        name: firebaseUser.displayName || 'Nexus User',
        email: firebaseUser.email || 'No email',
        avatar: firebaseUser.photoURL || 'https://api.dicebear.com/9.x/notionists/svg?seed=Guest',
      });

      setAuthProfile(profile);
    });

    return () => unsubscribe();
  }, []);

  // Fetch real Google Auth data from localStorage
  const savedUser = authProfile;
  
  // Fallback to a Guest profile just in case someone bypasses the login page
  const user = savedUser || {
    name: "Guest User",
    email: "Login required",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Guest"
  };

  // Update your handleLogout function to actually clear the data!

  // Hardcoded Notifications
  const notifications = [
    { id: 1, type: "alert", title: "API Quota Warning", desc: "You have used 84% of your monthly Gemini tokens.", time: "2m ago", unread: true },
    { id: 2, type: "info", title: "Model Update", desc: "Gemini 1.5 Pro is now available in your region.", time: "1h ago", unread: false },
    { id: 3, type: "security", title: "New Login", desc: "Access detected from Chrome on Mac OS.", time: "2d ago", unread: false }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      clearCachedUserProfile();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', fontSize: '14px', fontWeight: '500' },
          success: { iconTheme: { primary: '#06b6d4', secondary: '#fff' } }
        }} 
      />
      
      {/* Global Sidebar */}
      <div className="w-64 bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col z-20 relative">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md shadow-lg shadow-cyan-500/20">
              <Zap className="text-white" size={16} />
            </div>
            <span className="text-lg font-extrabold tracking-tighter">Nexus<span className="text-cyan-400">.ai</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Platform</p>
          {[
            { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
            { to: "/dashboard/playground", icon: <MessageSquare size={18} />, label: "Playground" },
            { to: "/dashboard/code-analyzer", icon: <Code2 size={18} />, label: "Code Analyzer" },
            { to: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" },
          ].map((item) => (
            <NavLink 
              key={item.to} to={item.to} 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive ? 'bg-zinc-800/80 text-cyan-400 shadow-inner border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative min-w-0 w-full">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-8 z-50 sticky top-0">
          
          {/* Functional Search Bar */}
          <div className="flex items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search generations, settings..." 
                className="w-64 lg:w-96 bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-block bg-zinc-800 text-zinc-400 px-1.5 rounded text-[10px] font-mono border border-zinc-700">⌘</kbd>
                <kbd className="hidden sm:inline-block bg-zinc-800 text-zinc-400 px-1.5 rounded text-[10px] font-mono border border-zinc-700">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-zinc-400 hover:text-white transition-colors relative p-1 rounded-full hover:bg-zinc-800"
              >
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-zinc-950 animate-pulse"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                      <p className="text-xs text-zinc-300 uppercase tracking-wider font-bold">Notifications</p>
                      <button className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold">Mark all as read</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-zinc-800/20' : ''}`}>
                          <div className={`mt-0.5 p-1.5 rounded-full h-fit ${notif.type === 'alert' ? 'bg-rose-500/10 text-rose-400' : notif.type === 'security' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            {notif.type === 'alert' ? <Activity size={14} /> : notif.type === 'security' ? <ShieldAlert size={14} /> : <Zap size={14} />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold mb-0.5 ${notif.unread ? 'text-zinc-100' : 'text-zinc-300'}`}>{notif.title}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed mb-1">{notif.desc}</p>
                            <p className="text-[10px] text-zinc-600 font-semibold">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                    className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Account</p>
                    </div>
                    <button onClick={() => navigate("/dashboard/profile")} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">Billing & Quotas</button>
                    <div className="h-px bg-zinc-800 my-1"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <LogOut size={16} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content Area (This now correctly stretches 100%) */}
        <div className="flex-1 overflow-auto relative w-full h-full flex">
           <Outlet /> 
        </div>

      </div>
    </div>
  );
};

export default Layout;
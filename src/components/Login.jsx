import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase'; // Imports the Firebase file you created

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // The actual Firebase Google Login function
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Trigger the Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 2. Save the real user data to localStorage so Layout.jsx can show your profile picture
      localStorage.setItem('nexus_user', JSON.stringify({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }));

      // 3. Navigate to the Dashboard after successful login
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans text-zinc-50 overflow-hidden">
      
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-12 xl:p-24 relative z-10 border-r border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Zap className="text-white" size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter">Nexus<span className="text-cyan-400">.ai</span></span>
        </div>

        {/* Login Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-sm w-full mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome</h1>
          <p className="text-zinc-400 text-sm mb-8">Authenticate with Google to access your dashboard.</p>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* REAL Google OAuth Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-zinc-200 text-zinc-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-zinc-900" size={20} />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-zinc-950 px-2 text-zinc-500 font-medium">Enterprise SSO</span>
            </div>
          </div> */}

          {/* <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="email" disabled placeholder="Corporate Email (Disabled in Demo)" className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none transition-all placeholder:text-zinc-600 cursor-not-allowed opacity-50" />
            </div>
          </form> */}
        </motion.div>

        {/* Footer */}
        <div className="text-xs text-zinc-500 flex items-center gap-4">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> End-to-End Encrypted</span>
        </div>
      </div>

      {/* Right Side: Abstract Visuals */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 w-[600px] bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/50 rounded-2xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800/50 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800/50 rounded w-5/6"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
            </div>
            <div className="h-32 bg-zinc-800/20 border border-zinc-700/30 rounded-xl"></div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
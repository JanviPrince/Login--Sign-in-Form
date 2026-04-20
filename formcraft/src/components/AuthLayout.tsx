import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import Lottie from 'lottie-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [isDark, setIsDark] = useState(false);
  const [bgAnimation, setBgAnimation] = useState<any>(null);

  useEffect(() => {
    fetch('https://lottie.host/cc2fbe9b-e85b-426c-8b8a-36070624d45d/V7m4R9K7mK.json')
      .then(res => res.json())
      .then(data => setBgAnimation(data));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Lottie Animation */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none scale-150 sm:scale-100">
        {bgAnimation && <Lottie animationData={bgAnimation} loop={true} />}
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-full border transition-all z-50 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className={`rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-12 border overflow-hidden relative transition-all duration-500 ${isDark ? 'bg-slate-900/60 border-slate-800/50 backdrop-blur-2xl' : 'bg-white/80 border-slate-100 backdrop-blur-md'}`}>
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="mb-8 sm:mb-10 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {subtitle}
            </motion.p>
          </div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

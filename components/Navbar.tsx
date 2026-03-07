
import React, { useState, useEffect } from 'react';
import { Home, Zap, Info, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { AppView } from '../types';
import { useSiteConfig } from '../contexts/useSiteConfig';

const TechnoLogo = () => {
  return (
    <motion.div 
      className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
      whileHover="hover"
      initial="initial"
    >
      <motion.div 
        className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"
        variants={{
          hover: { scale: 1.5, opacity: 0.6 }
        }}
      />
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
        <motion.path
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-white/20"
          variants={{
            initial: { pathLength: 1, rotate: 0 },
            hover: { rotate: 90, transition: { duration: 0.6, ease: "easeInOut" } }
          }}
        />
        <motion.path
          d="M30 35 H70 M50 35 V75"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-amber-500"
          variants={{
            initial: { pathLength: 0.8, opacity: 0.8 },
            hover: { 
              pathLength: 1, 
              opacity: 1, 
              scale: 1.1,
              transition: { duration: 0.3 } 
            }
          }}
        />
        <motion.circle 
          cx="50" cy="5" r="4" 
          className="fill-amber-500"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
};

interface NavbarProps {
  currentView: AppView;
  setView: (v: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { config } = useSiteConfig();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = () => {
    setView('home');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleRegisterClick = () => {
    handleSidebarNavigate('home', config.registration.isOpen ? 'events-section' : 'site-notice');
  };

  const handleAboutClick = () => {
    setView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSidebarNavigate = (view: AppView, section?: string) => {
    setView(view);

    const navigateToTarget = () => {
      if (section) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (view !== currentView) {
      setTimeout(navigateToTarget, 100);
      return;
    }

    navigateToTarget();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 md:px-8 flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-16 md:h-20 bg-[#0c0a09]/95 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'h-20 md:h-24 bg-transparent'}`}>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="md:hidden p-2 text-slate-400 hover:text-white"
           >
             <Menu size={24} />
           </button>
           <motion.div 
            className="flex items-center gap-4 cursor-pointer group h-full"
            onClick={handleHomeClick}
            whileHover="hover"
          >
            <TechnoLogo />
            <div className="flex flex-col justify-center">
              <span className="font-futuristic text-lg md:text-3xl tracking-tighter leading-none font-black italic text-white group-hover:text-amber-500 transition-colors">
                TECHNOFEST<span className="text-amber-500 group-hover:text-white">2026</span>
              </span>
              <div className="flex flex-col mt-1.5">
                <span className="text-[7px] md:text-[9px] font-black text-amber-500/90 uppercase tracking-[0.3em] leading-none italic">
                  ICEM TECHNOLOGICAL Fest
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-4 md:gap-8 items-center text-[10px] font-black tracking-[0.2em]">
          <button 
            onClick={handleHomeClick} 
            className={`hover:text-amber-400 transition-colors hidden md:flex items-center gap-2 ${currentView === 'home' ? 'text-amber-500' : 'text-slate-500'}`}
          >
            <Home size={14} /> HOME
          </button>

          <button 
            onClick={handleAboutClick} 
            className={`hover:text-amber-400 transition-colors hidden md:flex items-center gap-2 ${currentView === 'about' ? 'text-amber-500' : 'text-slate-500'}`}
          >
            <Info size={14} /> ABOUT
          </button>

          <button 
            onClick={handleRegisterClick}
            className={`flex items-center gap-3 px-5 md:px-7 py-3 rounded-2xl transition-all font-black text-[11px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-95 group ${
              config.registration.isOpen
                ? 'bg-white hover:bg-teal-500 text-black hover:text-white'
                : 'bg-red-500/15 text-red-200 hover:bg-red-500/25'
            }`}
          >
            <Zap size={16} className="group-hover:animate-pulse" /> 
            <span className="hidden md:inline">{config.registration.isOpen ? 'REGISTER' : 'REG CLOSED'}</span>
            <span className="md:hidden">{config.registration.isOpen ? 'JOIN' : 'NOTICE'}</span>
          </button>
        </div>
      </nav>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate} 
      />
    </>
  );
};

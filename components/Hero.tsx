
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SponsorLogos } from './SponsorLogos';

const ScrambleText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\/[]{}\u2014=+*^?#________';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <motion.span className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{displayText}</motion.span>;
};

const HUDBracket: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div className={`absolute top-0 bottom-0 w-8 md:w-16 flex flex-col justify-between py-1 pointer-events-none ${side === 'left' ? '-left-6 md:-left-12' : '-right-6 md:-right-20'}`}>
    <div className={`w-full h-4 border-t-2 ${side === 'left' ? 'border-l-2 rounded-tl-lg' : 'border-r-2 rounded-tr-lg'} border-amber-500/40`} />
    <div className={`w-full h-4 border-b-2 ${side === 'left' ? 'border-l-2 rounded-bl-lg' : 'border-r-2 rounded-br-lg'} border-amber-500/40`} />
  </div>
);

const TimerUnit: React.FC<{ value: number; label: string; max: number }> = ({ value, label, max }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-1 md:gap-1.5 group">
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-20">
          <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="currentColor" strokeWidth="1.5" className="text-slate-700" strokeDasharray="3 3" />
        </svg>
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle 
            cx="50%" cy="50%" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-amber-500"
            style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))' }}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "circOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="relative w-9 h-9 md:w-14 md:h-14 glass rounded-full border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 w-full h-[1px] bg-white/5 top-0 animate-[scanline_4s_linear_infinite] pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.span 
              key={value}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              className="text-sm md:text-xl font-futuristic text-white font-black leading-none tracking-tighter z-10"
            >
              {value.toString().padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="text-[5px] md:text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
};

export const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const target = new Date("March 14, 2026 09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      setTimeLeft({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero-section" className="relative flex flex-col items-center justify-center px-6 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] pt-4 pb-6 md:pb-10 text-center overflow-hidden bg-[#0c0a09] hud-grid">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_80%)]" />
      </div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-2 md:gap-4"
      >
        {/* Institution Branding */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4 md:gap-5"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-teal-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <div className="w-full h-full rounded-full bg-[#0c0a09] p-1 overflow-hidden">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4D0BAQHRdNGDV4pIGw/company-logo_200_200/B4DZsGrHdhL0AI-/0/1765343525228/indira_college_of_engineering_and_management_pune_logo?e=2147483647&v=beta&t=2EAdKZ8vaze54kFVbP21F87FMtVVRY9UnL9bPUso_wA" 
                alt="ICEM Logo" 
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-amber-500/30 rounded-full -m-2"
            />
          </motion.div>
          <h2 className="text-white/60 text-[8px] md:text-[11px] font-futuristic tracking-[0.5em] font-bold uppercase">
            INDIRA COLLEGE OF ENGINEERING & MANAGEMENT
          </h2>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] md:text-[11px] font-black tracking-[0.4em] uppercase text-amber-500 italic">
              Organizing
            </span>
            <span className="text-[8px] md:text-[10px] font-black tracking-[0.25em] uppercase text-slate-400 max-w-[280px] md:max-w-none">
              The Largest Gathering of Pune's Tech Innovators
            </span>
          </div>
        </motion.div>

        {/* Central Title */}
        <div className="relative w-full px-10 md:px-16 overflow-visible">
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-block mx-auto"
          >
            <HUDBracket side="left" />
            <HUDBracket side="right" />
            
            <h1 
              className="font-futuristic w-full font-black uppercase leading-[0.85] select-none italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 drop-shadow-[0_20px_60px_rgba(0,0,0,1)] electric-thunder tracking-tighter inline-block px-4"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 8.5rem)' }}
            >
              TECHNOFEST
            </h1>
          </motion.div>
          
          <div className="flex items-center justify-center gap-5 mt-2">
             <div className="h-[1px] w-8 md:w-20 bg-teal-500/20" />
             <ScrambleText 
               text="THE ULTIMATE TECH ARENA" 
               className="text-teal-400 font-futuristic text-[8px] md:text-sm tracking-[0.5em] font-black italic whitespace-nowrap"
               delay={0.5}
             />
             <div className="h-[1px] w-8 md:w-20 bg-teal-500/20" />
          </div>
        </div>

        {/* HUD Timer & Action */}
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full mt-4 md:mt-6">
          <div className="flex gap-4 md:gap-8 lg:gap-12">
            <TimerUnit value={timeLeft.days} label="Days" max={30} />
            <TimerUnit value={timeLeft.hours} label="Hours" max={24} />
            <TimerUnit value={timeLeft.minutes} label="Minutes" max={60} />
            <TimerUnit value={timeLeft.seconds} label="Seconds" max={60} />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(245,158,11,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 md:px-16 py-3 md:py-5 bg-white text-black font-black uppercase tracking-[0.5em] text-[9px] md:text-xs rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex items-center gap-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            INITIATE CONNECTION <Zap size={18} className="fill-current group-hover:animate-pulse" />
          </motion.button>

          <SponsorLogos />
        </div>
      </motion.div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-50px); }
          100% { transform: translateY(150px); }
        }
      `}</style>
    </section>
  );
};

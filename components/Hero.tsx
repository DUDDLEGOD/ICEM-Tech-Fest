import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../contexts/SiteContext';
import { ChevronDown } from 'lucide-react';

const ThreeScene = lazy(() => import('./ThreeScene'));

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-xl px-3 py-3 md:px-5 md:py-4 min-w-[60px] md:min-w-[80px]"
        style={{ background: 'linear-gradient(135deg, #144552, #272640)', border: '1px solid rgba(6,100,102,0.3)' }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -30, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="block text-center font-futuristic text-2xl md:text-4xl font-black tabular-nums"
            style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.4)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">{label}</span>
    </div>
  );
};

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex items-center gap-3 md:gap-4">
      <CountdownUnit value={timeLeft.days} label="Days" />
      <span className="text-[#006466] font-futuristic text-2xl md:text-3xl mb-5">:</span>
      <CountdownUnit value={timeLeft.hours} label="Hours" />
      <span className="text-[#006466] font-futuristic text-2xl md:text-3xl mb-5">:</span>
      <CountdownUnit value={timeLeft.minutes} label="Min" />
      <span className="text-[#006466] font-futuristic text-2xl md:text-3xl mb-5">:</span>
      <CountdownUnit value={timeLeft.seconds} label="Sec" />
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  const { config } = useSiteConfig();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <section id="hero-section" className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0a0a12]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #0a0a12, transparent 40%, rgba(10,10,18,0.5))' }} />
        <Suspense fallback={<div className="w-full h-full bg-[#0a0a12]" />}>
          <ThreeScene />
        </Suspense>
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-20 w-full flex flex-col items-center justify-center text-center px-6 gap-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-col items-center gap-6 mb-2">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-teal-500 to-purple-500 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <img src="/icem-logo.png" alt="ICEM Logo" className="w-full h-full object-cover rounded-full bg-black" />
          </div>
          
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="font-futuristic text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-none font-black italic text-white drop-shadow-2xl">
              {config.hero.mainTitlePart1}<span className="text-[#ff5400] drop-shadow-[0_0_15px_rgba(255,84,0,0.5)]">{config.hero.mainTitlePart2}</span>
            </h1>
            <div className="flex flex-col mt-4">
              <span className="text-[9px] md:text-[11px] font-black text-teal-500/90 uppercase tracking-[0.4em] leading-none italic">
                {config.hero.institution} — {config.hero.organizingLabel}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#ff5400] text-sm md:text-lg font-bold max-w-xl tracking-[0.1em] drop-shadow-[0_0_15px_rgba(255,84,0,0.5)]">
          {config.hero.subLabel}
        </motion.p>

        <Countdown targetDate={config.hero.countdownDate} />

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-4 group relative px-10 py-4 border font-bold uppercase tracking-[0.3em] text-[11px] rounded-full overflow-hidden transition-colors duration-300"
          style={{ borderColor: 'rgba(6,100,102,0.5)', color: '#06b6d4' }}>
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: '#006466' }} />
          <span className="relative z-10 group-hover:text-white">{config.hero.buttonText}</span>
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ChevronDown size={24} className="text-white/15 animate-bounce" />
      </motion.div>
    </section>
  );
};

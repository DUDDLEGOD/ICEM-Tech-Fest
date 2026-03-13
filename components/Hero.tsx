import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { SponsorLogos } from "./SponsorLogos";

const ThreeScene = lazy(() => import("./ThreeScene"));

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">

      <div
        className="relative overflow-hidden rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] backdrop-blur-md"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,182,212,0.18), rgba(30,41,59,0.45))",
          border: "1px solid rgba(6,182,212,0.35)",
          boxShadow: "0 0 30px rgba(6,182,212,0.2)",
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -35, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 35, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="block text-center font-futuristic text-3xl md:text-4xl font-black tabular-nums"
            style={{
              color: "#22d3ee",
              textShadow: "0 0 20px rgba(6,182,212,0.55)",
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>

    </div>
  );
};

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    calc();
    const id = setInterval(calc, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const colonStyle =
    "text-cyan-300/70 font-futuristic text-2xl md:text-3xl mb-5 drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex items-center gap-3 md:gap-4"
    >
      <CountdownUnit value={timeLeft.days} label="Days" />
      <span className={colonStyle}>:</span>
      <CountdownUnit value={timeLeft.hours} label="Hours" />
      <span className={colonStyle}>:</span>
      <CountdownUnit value={timeLeft.minutes} label="Min" />
      <span className={colonStyle}>:</span>
      <CountdownUnit value={timeLeft.seconds} label="Sec" />
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  const { config } = useSiteConfig();
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const isRegistrationOpen = config.registration.isOpen;

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-screen pt-20 md:pt-8 flex flex-col items-center justify-start overflow-hidden bg-[#0a0a12]"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top,#0a0a12,transparent 30%,rgba(10,10,18,0.75))",
          }}
        />

        <Suspense fallback={<div className="w-full h-full bg-[#0a0a12]" />}>
          <ThreeScene />
        </Suspense>

      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-20 w-full flex flex-col items-center text-center px-4 md:px-6 pb-12"
      >
        {/* Top Logo */}
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center gap-4 md:gap-5 mb-1 md:mb-2"
        >
          <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full p-[2px] bg-gradient-to-tr from-teal-400 to-purple-500 shadow-[0_0_50px_rgba(6,182,212,0.25)]">
            <img
              src="/icem-logo.png"
              alt="ICEM Logo"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>

          {/* Title Block */}
          <div className="relative flex flex-col items-center">

            {/* Cinematic readability layer */}
            <div className="absolute w-[620px] h-[200px] bg-black/45 blur-3xl rounded-full -z-10" />

            <span className="text-[12px] md:text-[14px] font-black text-white/90 uppercase tracking-[0.25em] italic">
              {config.hero.institution} — {config.hero.organizingLabel}
            </span>

            <h1 className="font-futuristic text-3xl md:text-6xl lg:text-7xl tracking-tight leading-none font-black italic text-white drop-shadow-2xl whitespace-nowrap px-4">

              {config.hero.mainTitlePart1}

              <span
                className="ml-2 inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 px-2"
                style={{
                  textShadow: "0 0 20px rgba(255,140,0,0.65)",
                  filter: "drop-shadow(0 0 12px rgba(255,140,0,0.45))",
                }}
              >
                {config.hero.mainTitlePart2}
              </span>

            </h1>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-amber-400 text-sm md:text-md lg:text-lg font-bold max-w-xl tracking-[0.08em] drop-shadow-[0_0_16px_rgba(255,140,0,0.6)] mb-3"
        >
          {config.hero.subLabel}
        </motion.p>

        {/* Countdown */}
        <div className="mt-5 mb-4 px-4 py-3 rounded-lg">
          <Countdown targetDate={config.hero.countdownDate} />
        </div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => {
            const targetId = isRegistrationOpen ? "events-section" : "site-notice";
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              // Lazy-loaded content may not be in DOM yet — scroll down to trigger it
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
              setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
              }, 400);
            }
          }}
          className="mt-4 group relative px-8 py-3 md:px-10 md:py-3.5 border font-bold uppercase tracking-[0.25em] text-[10px] md:text-[11px] rounded-full overflow-hidden transition-all duration-300 backdrop-blur-md"
          style={{
            borderColor: "rgba(0,251,255,0.6)",
            color: "#ffffff",
            boxShadow: "0 0 24px rgba(0,251,255,0.22)",
          }}
        >
          <div
            className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style={{ background: "#006466" }}
          />

          <span className="relative z-10 group-hover:text-white">
            {isRegistrationOpen ? config.hero.buttonText : "VIEW UPDATE"}
          </span>
        </motion.button>

        {/* Sponsors */}
        <motion.div
	  initial={{ opacity: 0 }}
	  animate={{ opacity: 1 }}
	  transition={{ delay: 1.0, duration: 1 }}
	  className="w-full mt-2 max-w-4xl px-6 py-6"
	>
          <SponsorLogos />
        </motion.div>
      </motion.div>

      {/* Scroll Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-[7.2rem] left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown
	  size={24}
	  className="text-cyan-300/60 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-bounce"
	/>
      </motion.div>
    </section>
  );
};

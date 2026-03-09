import { motion } from 'framer-motion';
import React from 'react';
import { useSiteConfig } from '../contexts/useSiteConfig';

export const SponsorLogos: React.FC = () => {
  const { config } = useSiteConfig();
  const sponsors = config.sponsors || [];

  if (sponsors.length === 0) return null;

  // Duplicate the list to create a seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="w-full mt-6 md:mt-8 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0c0a09] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0c0a09] to-transparent z-10" />

      <div className="flex flex-col items-center mb-4 md:mb-6">
        <span className="text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase text-white/70 italic text-center w-full">
          Strategic Partners & Sponsors
        </span>
      </div>

      <motion.div
        className="flex gap-8 md:gap-16 items-center whitespace-nowrap"
        animate={{
          x: [0, -1920], // Adjust based on content width if needed, but for a marquee this is a common pattern
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            key={`${sponsor.name}-${index}`}
            className="flex flex-col items-center gap-3 md:gap-4 group shrink-0"
          >
            <div className="relative flex items-center justify-center w-20 h-10 md:w-32 md:h-16 rounded-xl md:rounded-2xl px-4 py-2 bg-white/95 border-2 border-white/20 group-hover:border-amber-500 group-hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden">
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[9px] md:text-[11px] font-black text-slate-400 group-hover:text-amber-500 uppercase tracking-widest transition-colors drop-shadow-md">
              {sponsor.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

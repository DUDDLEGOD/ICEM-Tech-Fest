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

      <div className="flex flex-col items-center mb-2">
        <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 italic">
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
            className="flex flex-col items-center gap-3 group shrink-0"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full p-0.5 bg-white/5 border border-white/10 group-hover:border-amber-500/50 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[7px] md:text-[9px] font-bold text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">
              {sponsor.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

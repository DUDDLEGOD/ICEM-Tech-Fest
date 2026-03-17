import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";

export const SponsorLogos: React.FC = () => {
  const { config } = useSiteConfig();
  const sponsors = config.sponsors || [];

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const measure = () => {
      setWidth(marqueeRef.current!.scrollWidth / 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(marqueeRef.current);

    return () => observer.disconnect();
  }, []);

  if (sponsors.length === 0) return null;

  // Single sponsor layout
  if (sponsors.length === 1) {
    const sponsor = sponsors[0];

    return (
      <div className="w-full mt-2 flex flex-col items-center">

        {/* Title */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-[420px] h-12 bg-black/40 blur-xl rounded-full" />
          </div>

          <span
            className="text-[14px] md:text-[18px] font-extrabold tracking-[0.18em] uppercase text-white relative"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            Strategic Partners & Sponsors
          </span>
        </div>


          <div className="relative flex items-center justify-center w-32 h-16 md:w-40 md:h-20 rounded-2xl px-4 py-2 bg-white/95 border-2 border-white/20 hover:border-cyan-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden">

            {/* Glimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />

            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-full h-full object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>


        </div>
    );
  }

  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="w-full mt-16 overflow-hidden relative">

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0c0a09] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0c0a09] to-transparent z-10" />

      {/* Title */}
      <div className="flex justify-center mb-6 relative">
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[420px] h-12 bg-black/40 blur-xl rounded-full" />
        </div>

        <span
          className="text-[14px] md:text-[18px] font-extrabold tracking-[0.18em] uppercase text-white relative"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
        >
          Strategic Partners & Sponsors
        </span>
      </div>

      {/* Marquee */}
      <motion.div
        ref={marqueeRef}
        className="flex gap-12 md:gap-20 items-center w-max"
        animate={{ x: -width }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: width / 80,
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            key={`${sponsor.name}-${index}`}
            className="flex flex-col items-center gap-3 group shrink-0"
          >
            <div className="relative flex items-center justify-center w-28 h-14 md:w-40 md:h-20 rounded-2xl px-4 py-2 bg-white/95 border-2 border-white/20 hover:border-cyan-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden">

              {/* Glimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />

              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-full h-full object-contain relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>

            <span className="text-[11px] md:text-[13px] font-bold text-slate-300 group-hover:text-cyan-300 uppercase tracking-widest transition-colors">
              {sponsor.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

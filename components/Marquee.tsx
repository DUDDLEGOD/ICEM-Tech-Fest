
import React from 'react';
import { Department } from '../types';
import { motion } from 'framer-motion';

export const Marquee: React.FC = () => {
  const departments = Object.values(Department);
  
  return (
    <div className="pt-8 pb-2 bg-black/40 border-y border-white/5 overflow-hidden whitespace-nowrap relative">
      {/* Edge Fades */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0c0a09] to-transparent z-20"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0c0a09] to-transparent z-20"></div>

      <div className="flex animate-marquee hover:pause cursor-default relative">
        {[...departments, ...departments].map((dept, i) => (
          <div 
            key={i} 
            className="mx-16 flex items-center gap-12 group relative py-4"
          >
            {/* Floating Energy Blobs (Behind Text) */}
            <motion.div
              animate={{
                scale: [1, 1.2, 0.9, 1.1],
                opacity: [0.1, 0.2, 0.15, 0.1],
                x: [-10, 10, -5, 5],
                y: [-5, 5, 10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`absolute inset-0 blur-[60px] rounded-full z-0 pointer-events-none ${
                i % 2 === 0 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
            />

            {/* Shimmering Gradient Text */}
            <span className="relative z-10 font-futuristic text-5xl font-black uppercase tracking-[0.2em] transition-all duration-700 bg-gradient-to-r from-white/10 via-white/40 to-white/10 bg-[length:200%_auto] animate-shimmer group-hover:from-amber-400 group-hover:via-white group-hover:to-blue-500 bg-clip-text text-transparent group-hover:scale-110">
              {dept}
            </span>

            {/* Energy Particle */}
            <motion.div 
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.4, 0.8, 0.4],
                boxShadow: [
                  "0 0 10px rgba(245,158,11,0.5)",
                  "0 0 30px rgba(59,130,246,0.8)",
                  "0 0 10px rgba(245,158,11,0.5)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: i * 0.5 }}
              className={`w-3 h-3 rounded-full relative z-10 ${
                i % 2 === 0 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-inherit opacity-20"></div>
            </motion.div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

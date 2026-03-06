import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const BackgroundEffect: React.FC = React.memo(() => {
  const { scrollY } = useScroll();
  // Simplified transform for better performance
  const y1 = useTransform(scrollY, [0, 2000], [0, -100]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0c0a09]">
      {/* Primary Grid - Optimized size and opacity */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]"
      />
      
      {/* Static Light Blobs - Replaced heavy blurs with CSS radial gradients for performance */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
      </div>
      
      {/* digital data rain - reduced count significantly for performance */}
      <div className="absolute inset-0 opacity-[0.03]">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: (i * 18) + "%", y: -100 }}
            animate={{ y: [0, 1000] }}
            transition={{ 
              duration: 12 + i * 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 1.5
            }}
            className="absolute w-[1px] h-[40px] bg-amber-500"
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-[0.01]"></div>
    </div>
  );
});

// Adding a display name for debugging purposes
BackgroundEffect.displayName = 'BackgroundEffect';

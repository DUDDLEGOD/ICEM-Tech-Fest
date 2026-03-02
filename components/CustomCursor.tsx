
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  // Balanced spring config for responsiveness without jitter
  const springConfig = { damping: 30, stiffness: 250, restDelta: 0.001 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, input, [role="button"]'));
    };

    window.addEventListener('mousemove', moveMouse, { passive: true });
    window.addEventListener('mouseover', handleHover, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [cursorX, cursorY, isHidden]);

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Ring */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 50 : 28,
          height: isHovering ? 50 : 28,
        }}
        className="absolute border border-amber-500/50 rounded-full transition-[width,height] duration-200"
      />
      
      {/* Inner Dot */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className={`absolute w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white] transition-transform duration-200 ${isHovering ? 'scale-0' : 'scale-100'}`}
      />
    </div>
  );
};

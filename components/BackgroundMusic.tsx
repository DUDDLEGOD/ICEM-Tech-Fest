import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current && isPlayingRef.current) {
        setHasInteracted(true);
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current.play().catch(() => {});
            }
          });
        }
        
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.error("Manual play failed:", err);
      });
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        onCanPlay={() => {
          if (isPlayingRef.current && !hasInteracted) {
            audioRef.current?.play().catch(() => {});
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }}
        onPause={() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }}
        onError={(e) => {
          console.error("Audio Error Event:", e);
          const target = e.target as HTMLAudioElement;
          console.error("Audio Error Code:", target.error?.code);
          console.error("Audio Error Message:", target.error?.message);
        }}
      >
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" type="audio/mpeg" />
        <source src="https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" type="audio/mpeg" />
      </audio>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="w-12 h-12 glass rounded-full flex items-center justify-center text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-500 transition-all"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Volume2 size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <VolumeX size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isPlaying && (
          <div className="absolute -top-1 flex gap-0.5 items-end h-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, 12, 6, 10, 4],
                }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-0.5 bg-amber-500 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
};

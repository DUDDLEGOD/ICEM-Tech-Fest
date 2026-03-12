import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BackgroundMusic: React.FC = () => {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(
    localStorage.getItem("bgMusic") !== "off"
  );

  const fadeAudio = (target: number, duration = 800) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const step = 0.05;
    const interval = duration / (1 / step);

    const fade = setInterval(() => {
      if (!audio) return;

      if (target > audio.volume) {
        audio.volume = Math.min(audio.volume + step, target);
      } else {
        audio.volume = Math.max(audio.volume - step, target);
      }

      if (audio.volume === target) clearInterval(fade);
    }, interval);
  };

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0;

    const startAudio = () => {
      if (!audio.paused) return;

      audio.play().then(() => {
        fadeAudio(0.35);
      }).catch(() => {});

      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
    };

    window.addEventListener("click", startAudio);
    window.addEventListener("keydown", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
    };

  }, []);

  const toggleMusic = () => {

    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {

      audio.play().then(() => fadeAudio(0.35));

      setIsPlaying(true);
      localStorage.setItem("bgMusic", "on");

    } else {

      fadeAudio(0);

      setTimeout(() => audio.pause(), 800);

      setIsPlaying(false);
      localStorage.setItem("bgMusic", "off");

    }

  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">

      <audio ref={audioRef} loop preload="auto">

        <source
          src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_7b41edc64a.mp3"
          type="audio/mpeg"
        />

      </audio>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="w-12 h-12 glass rounded-full flex items-center justify-center text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:border-amber-500 transition-all"
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
                animate={{ height: [4, 12, 6, 10, 4] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-[2px] bg-amber-500 rounded-full"
              />
            ))}

          </div>

        )}

      </motion.button>

    </div>
  );
};

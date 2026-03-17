import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const BackgroundEffect: React.FC = React.memo(() => {

  const { scrollY } = useScroll();

  const gridY = useTransform(scrollY, [0, 2000], [0, -120]);
  const gridOpacity = useTransform(scrollY, [0, 800], [0.03, 0.015]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050816]">

      {/* GRID */}
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-0
        bg-[linear-gradient(to_right,rgba(103,232,249,0.08)_1px,transparent_1px),
        linear-gradient(to_bottom,rgba(192,132,252,0.06)_1px,transparent_1px)]
        bg-[size:72px_72px]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(192,132,252,0.1),transparent_34%)]" />

      {/* LIGHT BLOBS */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute top-[-12%] left-[-10%] w-[60%] h-[60%]
        bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)]"
      />

      <motion.div
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 22, repeat: Infinity }}
        className="absolute bottom-[-14%] right-[-10%] w-[60%] h-[60%]
        bg-[radial-gradient(circle,rgba(192,132,252,0.08)_0%,transparent_70%)]"
      />

      {/* DATA STREAMS */}
      <div className="absolute inset-0 opacity-[0.035]">

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: `${10 + i * 12}%`, y: -100 }}
            animate={{ y: [0, 1100] }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.2
            }}
            className="absolute w-[1px] h-[50px] bg-gradient-to-b from-[#06b6d4] to-purple-400"
          />
        ))}

      </div>

      {/* SCAN SWEEP */}
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 opacity-[0.015]
        bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)]"
      />

      {/* NOISE TEXTURE */}
      <div className="absolute inset-0
        bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]
        opacity-[0.02]"
      />

    </div>
  );

});

BackgroundEffect.displayName = "BackgroundEffect";

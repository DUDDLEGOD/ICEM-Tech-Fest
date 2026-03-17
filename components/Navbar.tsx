import { motion } from "framer-motion";
import { Home, Info, Menu, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { AppView } from "../types";
import { Sidebar } from "./Sidebar";

const TechnoLogo = () => {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/fest-logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Scan through image, key out dark blue and remove watermark
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const idx = (y * img.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

          // Watermark is roughly bottom-right 15%
          const inWatermarkZone = x > img.width * 0.85 && y > img.height * 0.85;

          // Drop pixel if it's the dark background (luminance check) or in the watermark zone
          if (inWatermarkZone || luminance <= 40) {
            data[idx + 3] = 0; // set alpha to 0 for transparency
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setLogoSrc(canvas.toDataURL('image/png'));
    };
  }, []);

  return (
    <motion.div
      className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
      whileHover={{ scale: 1.1 }}
      initial="initial"
    >
      {logoSrc && (
        <img
          src={logoSrc}
          alt="Technofest Logo"
          className="w-full h-full object-contain"
        />
      )}
    </motion.div>
  );
};

interface NavbarProps {
  currentView: AppView;
  setView: (v: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { config } = useSiteConfig();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHomeClick = () => {
    setView("home");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleAboutClick = () => {
    setView("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegisterClick = () => {
    const target = config.registration.isOpen
      ? "events-section"
      : "site-notice";

    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSidebarNavigate = (view: AppView, section?: string) => {
    setView(view);

    const navigate = () => {
      if (section) {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (view !== currentView) {
      setTimeout(navigate, 100);
      return;
    }

    navigate();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 px-4 md:px-10 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? "h-14 md:h-20 bg-[linear-gradient(180deg,rgba(5,8,22,0.9),rgba(5,8,22,0.72))] backdrop-blur-xl shadow-[0_18px_50px_rgba(2,6,23,0.65)]"
            : "h-16 md:h-24 bg-transparent"
        }`}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <Menu size={22} />
          </button>

          {/* LOGO + TITLE */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleHomeClick}
            whileHover={{ scale: 1.03 }}
          >
            <TechnoLogo />

            <div className="flex flex-col">

              <span className="font-futuristic whitespace-nowrap text-base md:text-3xl tracking-tight font-black italic text-white group-hover:text-cyan-300 transition-colors">
                TECHNOFEST
                <span className="ml-1 text-purple-300 group-hover:text-white">
                  2026
                </span>
              </span>

              <span className="hidden md:block text-[9px] font-black text-cyan-300/90 uppercase tracking-[0.25em] italic">
                ICEM TECHNOLOGICAL FEST
              </span>

            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-3 md:gap-10 items-center text-[10px] font-black tracking-[0.2em]">

          {/* HOME */}
          <button
            onClick={handleHomeClick}
            className={`hidden md:flex items-center gap-2 transition-colors ${
              currentView === "home"
                ? "text-cyan-300"
                : "text-slate-500 hover:text-cyan-300"
            }`}
          >
            <Home size={14} />
            HOME
          </button>

          {/* ABOUT */}
          <button
            onClick={handleAboutClick}
            className={`hidden md:flex items-center gap-2 transition-colors ${
              currentView === "about"
                ? "text-cyan-300"
                : "text-slate-500 hover:text-cyan-300"
            }`}
          >
            <Info size={14} />
            ABOUT
          </button>

          {/* REGISTER BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegisterClick}
            className={`flex items-center gap-2 px-3 md:px-8 py-2 md:py-3 rounded-xl font-black text-[11px] transition-all border ${
              config.registration.isOpen
                ? "border-cyan-300/35 bg-[linear-gradient(180deg,rgba(8,18,35,0.8),rgba(9,16,30,0.65))] text-cyan-200 hover:border-cyan-200/60 shadow-[0_12px_35px_rgba(2,6,23,0.4)]"
                : "border-red-400/40 bg-red-500/10 text-red-300"
            }`}
          >
            <Zap size={14} />

            <span className="hidden md:inline">
              {config.registration.isOpen ? "REGISTER" : "REG CLOSED"}
            </span>

            <span className="md:hidden">
              {config.registration.isOpen ? "JOIN" : "NOTICE"}
            </span>
          </motion.button>

        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleSidebarNavigate}
      />
    </>
  );
};

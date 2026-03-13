import { motion } from "framer-motion";
import { Home, Info, Menu, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { AppView } from "../types";
import { Sidebar } from "./Sidebar";

const TechnoLogo = () => {
  return (
    <motion.div
      className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center"
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full"
        variants={{ hover: { scale: 1.6, opacity: 0.7 } }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(255,180,0,0.6)]"
      >
        <motion.path
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-white/20"
          variants={{
            initial: { rotate: 0 },
            hover: { rotate: 90, transition: { duration: 0.6 } },
          }}
        />

        <motion.path
          d="M30 35 H70 M50 35 V75"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-amber-500"
          variants={{ hover: { scale: 1.1 } }}
        />

        <motion.circle
          cx="50"
          cy="5"
          r="4"
          className="fill-amber-500"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
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
            ? "h-14 md:h-20 bg-black/50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
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

              <span className="font-futuristic whitespace-nowrap text-base md:text-3xl tracking-tight font-black italic text-white group-hover:text-amber-400 transition-colors">
                TECHNOFEST
                <span className="ml-1 text-amber-400 group-hover:text-white">
                  2026
                </span>
              </span>

              <span className="hidden md:block text-[9px] font-black text-amber-400/90 uppercase tracking-[0.25em] italic">
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
                ? "text-amber-400"
                : "text-slate-500 hover:text-amber-400"
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
                ? "text-amber-400"
                : "text-slate-500 hover:text-amber-400"
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
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/25 shadow-[0_0_25px_rgba(0,255,255,0.25)]"
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

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Activity,
  BookOpen,
  ChevronLeft,
  Code,
  Cpu,
  Globe,
  Landmark,
  Library,
  Microscope,
  Radio,
  Rocket,
  Shield,
  Target,
} from "lucide-react";
import { useSiteConfig } from "../contexts/useSiteConfig";

interface AboutPageProps {
  onNavigateBack: () => void;
}

/* ---------------- ANIMATION VARIANTS ---------------- */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

/* ---------------- HUD DECORATION ---------------- */

const HUDDecoration = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 6, repeat: Infinity }}
    className={`absolute pointer-events-none opacity-[0.03] font-futuristic text-[8px] uppercase tracking-[0.4em] text-white space-y-2 ${className}`}
  >
    <div className="flex items-center gap-2">
      <Radio size={10} /> SYSTEM_STATUS: OPERATIONAL
    </div>
    <div className="flex items-center gap-2">
      <Cpu size={10} /> NETWORK_LATENCY: 12MS
    </div>
    <div className="flex items-center gap-2">
      <Shield size={10} /> PROTOCOL: HTTPS_SECURE
    </div>
    <div className="w-full h-[1px] bg-white/20" />
    <div className="text-[6px]">LOC: 18.66 N / 73.71 E</div>
  </motion.div>
);

/* ---------------- CAMPUS FEATURES ---------------- */

const campusFeatures = [
  {
    icon: Library,
    title: "Central Library",
    desc: "Digital repository with journals and IEEE access.",
    color: "text-cyan-300"
  },
  {
    icon: Microscope,
    title: "Research Labs",
    desc: "Infrastructure for AI, Robotics, and Civil.",
    color: "text-purple-300"
  },
  {
    icon: Globe,
    title: "Academic Synergy",
    desc: "Collaborations with global institutions.",
    color: "text-cyan-400"
  },
  {
    icon: Shield,
    title: "NAAC Accredited",
    desc: "Certified standards of excellence.",
    color: "text-purple-300"
  }
];

/* ---------------- PAGE ---------------- */

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateBack }) => {

  const { config } = useSiteConfig();
  const { about, contact } = config;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0c0a09] pt-8 pb-24 px-6 md:px-12 relative overflow-hidden"
    >

      {/* background lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/5 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/5 blur-[140px] rounded-full" />

      <HUDDecoration className="top-24 left-12 hidden lg:block" />
      <HUDDecoration className="bottom-24 right-12 hidden lg:block rotate-180" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* BACK BUTTON */}

        <motion.button
          onClick={onNavigateBack}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-300 transition-colors group mb-6"
        >
          <ChevronLeft size={18} className="group-hover:animate-pulse" />
          <span className="font-futuristic text-[9px] font-black uppercase tracking-[0.3em]">
            Back to Portal
          </span>
        </motion.button>

        {/* EVENT SECTION */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-5 gap-12 items-start"
        >

          <div className="lg:col-span-3 space-y-8">

            <div className="space-y-4">

              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-300 text-[10px] font-black uppercase tracking-widest">
                <Activity size={12} /> {about.eventBadge}
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-futuristic font-black uppercase italic tracking-tighter text-white leading-[1]">
                {about.eventHeadline}
                <br />
                <span className="text-purple-300">{about.eventHighlight}</span>
              </h1>

            </div>

            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic border-l-2 border-cyan-400/30 pl-6 max-w-2xl">
              "{about.eventQuote}"
            </p>

            <div className="grid md:grid-cols-2 gap-4">

              {/* TECH FRAMEWORK */}

              <div className="glass p-6 rounded-2xl border-white/5 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all space-y-3">

                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-300">
                  <Code size={18} />
                </div>

                <h4 className="text-white font-black uppercase tracking-widest text-[10px]">
                  Technical Framework
                </h4>

                <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed">
                  {about.technicalFrameworkText}
                </p>

              </div>

              {/* INDUSTRY */}

              <div className="glass p-6 rounded-2xl border-white/5 hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(192,132,252,0.2)] transition-all space-y-3">

                <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-300">
                  <Rocket size={18} />
                </div>

                <h4 className="text-white font-black uppercase tracking-widest text-[10px]">
                  Industry Linkage
                </h4>

                <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed">
                  {about.industryLinkageText}
                </p>

              </div>

            </div>
          </div>

          {/* EVENT IMAGE */}

          <div className="lg:col-span-2 relative group mt-8 lg:mt-0">

            <div className="absolute -inset-4 bg-cyan-400/5 blur-2xl rounded-[2.5rem] group-hover:bg-cyan-400/10 transition-all duration-700" />

            <div className="relative glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">

              <motion.img
                src={about.eventImageUrl}
                alt="TechnoFest Event"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            </div>

          </div>

        </motion.div>

        {/* STATS */}

        <div className="pt-20 border-t border-white/5 mt-24">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            {about.stats.map((stat, index) => (

              <motion.div
                key={index}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-1 group"
              >

                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-cyan-300 transition-colors">
                  {stat.label}
                </span>

                <span className="text-3xl md:text-5xl font-futuristic font-black text-white italic tracking-tighter group-hover:scale-105 transition-transform block">
                  {stat.value}
                </span>

                <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">
                  {stat.sub}
                </span>

              </motion.div>

            ))}

          </div>

        </div>

      </div>
    </motion.div>
  );
};

import React, { useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { EventConfig } from "../types";
import {
  Trophy,
  Users,
  X,
  Zap,
  Calendar,
  Target,
  Shield,
  Clock,
  MapPin,
  ChevronRight,
  Mail,
  Phone,
  Download
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

/* ---------------- ANIMATIONS ---------------- */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
};

const cardVariants: Variants = {
  hidden: {
    y: 40,
    opacity: 0,
    scale: 0.95
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18
    }
  },
  hover: {
    y: -12,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 15
    }
  }
};

/* ---------------- RULE LIST ---------------- */

const EventRulesList: React.FC<{ rules: string[] }> = ({ rules }) => (
  <ul className="space-y-5">
    {rules.map((rule, i) => (
      <li key={i} className="flex gap-5 text-slate-300 text-[13px] font-medium items-start leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,1)]"></span>
        {rule}
      </li>
    ))}
  </ul>
);

/* ---------------- ROUNDS ---------------- */

const EventRoundsTimeline: React.FC<{ rounds: EventConfig["rounds"] }> = ({ rounds }) => (
  <div className="relative space-y-8 pl-10 border-l border-white/10 ml-2">
    {rounds.map((round, i) => (
      <div key={i} className="relative">
        <div className="absolute -left-[51px] top-0 w-6 h-6 rounded-full bg-stone-900 border-2 border-cyan-400/60 flex items-center justify-center text-[10px] font-black text-cyan-400 z-10">
          {i + 1}
        </div>

        <div className="space-y-2">
          <h5 className="font-black text-white text-sm tracking-widest uppercase">
            {round.title}
          </h5>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {round.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
);

/* ---------------- EVENT CARD ---------------- */

const EventCard = ({
  event,
  onRegister,
  onOpenDetails,
  registrationEnabled
}: any) => (
  <motion.div
    variants={cardVariants}
    whileHover="hover"
    className="group relative h-[440px]"
  >

    {/* glow border */}
    <div className="absolute -inset-[1px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-400/40 via-blue-400/20 to-transparent blur-sm -z-10"></div>

    <div className="absolute inset-0 bg-black/55 backdrop-blur-xl rounded-[2.5rem] border border-cyan-400/10 group-hover:border-cyan-400/40 overflow-hidden flex flex-col justify-between transition-all duration-500">

      <div className="relative z-10 p-8 flex flex-col h-full text-left">

        <div className="flex justify-between items-start mb-8">

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-cyan-400/5 border border-cyan-400/20 rounded-full w-fit">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                {event.department.split(" ")[0]}
              </span>
            </div>

            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] block ml-1">
              SECTOR_{event.id}
            </span>
          </div>

          <div className="p-3 bg-cyan-400/10 rounded-2xl text-cyan-300 border border-cyan-400/20 group-hover:bg-cyan-400 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300">
            <Trophy size={18} />
          </div>

        </div>

        <div className="flex-1 space-y-3">

          <h4 className="text-3xl font-futuristic font-black text-white group-hover:text-cyan-400 transition-colors uppercase leading-[0.9] italic tracking-tighter">
            {event.name}
          </h4>

          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              {event.tagline}
            </p>
          </div>

          <p className="text-slate-500 text-[12px] leading-relaxed font-medium line-clamp-3">
            {event.description}
          </p>

        </div>

        <div className="flex items-center gap-3 pt-8 border-t border-white/5">

          <button
            onClick={() => onOpenDetails(event)}
            className="flex-1 py-4 bg-white/5 hover:bg-cyan-400/10 border border-white/10 hover:border-cyan-400/40 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all"
          >
            SPEC_DATA
          </button>

          <button
  onClick={() => onRegister(event.id)}
  disabled={!registrationEnabled}
  className={`flex-[1.8] py-4 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
    registrationEnabled
      ? 'bg-[#06b6d4] hover:bg-white text-black shadow-[#06b6d4]/5'
      : 'bg-white/10 text-slate-500 cursor-not-allowed shadow-transparent'
  }`}
>
  {registrationEnabled ? 'JOIN_ARENA' : 'ARENA_CLOSED'}
  <ChevronRight size={14} />
</button>

        </div>

      </div>
    </div>
  </motion.div>
);

/* ---------------- EVENT CATALOG ---------------- */

export const EventCatalog = ({ onRegister, brochureVisibility = {} }: any) => {

  const { config } = useSiteConfig();
  const [selectedEvent, setSelectedEvent] = useState<EventConfig | null>(null);

  return (
    <section
      id="events-section"
      className="py-12 md:py-16 px-6 max-w-7xl mx-auto relative bg-[#0a0a12]"
    >

      {/* background glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-400/5 blur-[180px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[160px] rounded-full -z-10 pointer-events-none"></div>

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
      >

        <div className="space-y-5 text-left">

          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-cyan-400"></div>
            <h2 className="text-cyan-400 font-futuristic text-[10px] tracking-[0.5em] font-black uppercase">
              Battleground Directory
            </h2>
          </div>

          <h3 className="text-4xl md:text-6xl lg:text-7xl font-futuristic font-black tracking-tighter uppercase leading-[0.85] italic text-white pr-4">
            SELECT YOUR <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 py-1">
              ENVIRONMENT
            </span>
          </h3>

        </div>
      </motion.div>

      {/* GRID */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
      >

        {config.events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
            onOpenDetails={setSelectedEvent}
            registrationEnabled={
              config.registration.isOpen && event.isRegistrationOpen
            }
          />
        ))}

      </motion.div>

      {/* MODAL */}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-8"
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="glass max-w-4xl w-full rounded-[3rem] border border-white/10 p-10 relative"
            >

              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-5xl font-futuristic font-black uppercase text-white mb-6">
                {selectedEvent.name}
              </h2>

              <p className="text-slate-400 mb-6">{selectedEvent.description}</p>

              <EventRulesList rules={selectedEvent.rules} />

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

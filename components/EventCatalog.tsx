import { AnimatePresence, motion, Variants } from "framer-motion";
import {
    Calendar,
    ChevronRight,
    Clock,
    Download,
    Mail,
    MapPin,
    Phone,
    Trophy,
    User,
    Users,
    X,
    Zap
} from "lucide-react";
import React, { useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { EventConfig } from "../types";

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

      {/* MODAL — Compact two-column layout */}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-4 md:p-6"
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-w-5xl w-full rounded-[2rem] border border-white/10 p-5 md:p-8 relative"
            >

              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-500 hover:text-white z-10"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                    {selectedEvent.department}
                  </span>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    SECTOR_{selectedEvent.id}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-futuristic font-black uppercase text-white leading-tight">
                  {selectedEvent.name}
                </h2>
                <p className="text-amber-400 font-bold text-xs mt-1 tracking-wide">
                  {selectedEvent.tagline}
                </p>
              </div>

              <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-2">{selectedEvent.description}</p>

              {/* Key Info Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: <Trophy size={12} />, label: 'Prize', value: selectedEvent.prizePool },
                  { icon: <Users size={12} />, label: 'Team', value: `${selectedEvent.minTeam}–${selectedEvent.maxTeam}` },
                  { icon: <Zap size={12} />, label: 'Fee', value: selectedEvent.fee === 0 ? 'FREE' : `₹${selectedEvent.fee}` },
                  { icon: <Calendar size={12} />, label: 'Date', value: selectedEvent.eventDateLabel.replace('March ', 'Mar ') },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      {item.icon}
                      <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <p className="text-white font-black text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Two-Column Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Left Column — Rules + Venue */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-3">Rules</h4>
                    <ul className="space-y-2">
                      {selectedEvent.rules.map((rule, i) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-[12px] font-medium items-start leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 shadow-[0_0_6px_rgba(6,182,212,1)]"></span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-400 text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-cyan-400" />
                      <span className="font-medium">{selectedEvent.venueLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" />
                      <span className="font-medium">{selectedEvent.eventTimeLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column — Rounds + Coordinator */}
                <div className="space-y-4">
                  {selectedEvent.rounds.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-3">Rounds</h4>
                      <div className="relative space-y-4 pl-7 border-l border-white/10 ml-1">
                        {selectedEvent.rounds.map((round, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[33px] top-0 w-5 h-5 rounded-full bg-stone-900 border-2 border-cyan-400/60 flex items-center justify-center text-[8px] font-black text-cyan-400 z-10">
                              {i + 1}
                            </div>
                            <div>
                              <h5 className="font-black text-white text-xs tracking-wider uppercase">{round.title}</h5>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{round.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-2">Coordinator</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-slate-500" />
                        <span className="text-white font-bold text-xs">{selectedEvent.coordinatorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-slate-500" />
                        <a href={`mailto:${selectedEvent.coordinatorEmail}`} className="text-slate-400 text-xs hover:text-cyan-400 transition-colors">
                          {selectedEvent.coordinatorEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-500" />
                        <a href={`tel:${selectedEvent.coordinatorPhone.replace(/\s+/g, '')}`} className="text-slate-400 text-xs hover:text-cyan-400 transition-colors">
                          {selectedEvent.coordinatorPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                {brochureVisibility[selectedEvent.id] && (
                  <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:border-cyan-400/40 text-white font-black text-[10px] tracking-widest uppercase rounded-xl transition-all">
                    <Download size={13} />
                    BROCHURE
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    onRegister(selectedEvent.id);
                  }}
                  disabled={!(config.registration.isOpen && selectedEvent.isRegistrationOpen)}
                  className={`flex-1 py-3 font-black text-[10px] tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
                    config.registration.isOpen && selectedEvent.isRegistrationOpen
                      ? 'bg-[#06b6d4] hover:bg-white text-black shadow-lg shadow-[#06b6d4]/10'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {config.registration.isOpen && selectedEvent.isRegistrationOpen ? 'REGISTER NOW' : 'REGISTRATION CLOSED'}
                  <ChevronRight size={13} />
                </button>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

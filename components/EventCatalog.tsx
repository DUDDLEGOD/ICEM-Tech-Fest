import { AnimatePresence, motion, Variants } from "framer-motion";
import {
    Calendar,
    ChevronRight,
    Clock,
    Download,
    Mail,
    MapPin,
    Trophy,
    User,
    Users,
    X,
    Zap
} from "lucide-react";
import React, { useState } from "react";
import { useSiteConfig } from "../contexts/useSiteConfig";
import { BrochureVisibility, CoordinatorContact, Department, EventConfig } from "../types";

const formatEventFee = (fee: EventConfig["fee"]) => {
  if (typeof fee === "number") {
    return fee === 0 ? "FREE" : `Rs. ${fee}`;
  }

  const robotMatch = fee.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (robotMatch) {
    return `Rs. ${robotMatch[1]} / Rs. ${robotMatch[2]}`;
  }

  return fee;
};

const formatPhoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const getFacultyCoordinators = (event: EventConfig): CoordinatorContact[] => {
  if (event.facultyCoordinators && event.facultyCoordinators.length > 0) {
    return event.facultyCoordinators;
  }

  return event.coordinatorName && event.coordinatorPhone
    ? [
        {
          name: event.coordinatorName,
          phone: event.coordinatorPhone,
          email: event.coordinatorEmail,
        },
      ]
    : [];
};

const BROCHURE_SLUGS: Record<string, string> = {
  [Department.FIRST_YEAR]: "first-year",
  [Department.COMPS]: "computer",
  [Department.AIDS]: "aids",
  [Department.IT]: "it",
  [Department.CIVIL]: "civil",
  [Department.MECH]: "mech",
  [Department.ENTC]: "entc",
  [Department.MCA_BCA]: "mca-bca",
  [Department.MBA]: "mba",
};

const getBrochureHref = (event: EventConfig) => {
  const slug = BROCHURE_SLUGS[event.department] || event.id.toLowerCase();
  return `/brochurs/${slug}.pdf`;
};

const CoordinatorCards: React.FC<{
  coordinators: CoordinatorContact[];
  icon: React.ReactNode;
  sharedEmail?: string;
}> = ({ coordinators, icon, sharedEmail }) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {coordinators.map((coordinator, index) => (
      <div
        key={`${coordinator.name}-${index}`}
        className="h-full rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-slate-500">{icon}</div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs">{coordinator.name}</p>
            <a
              href={formatPhoneHref(coordinator.phone)}
              className="block text-slate-400 text-xs hover:text-cyan-400 transition-colors"
            >
              {coordinator.phone}
            </a>
            {(coordinator.email || (index === 0 ? sharedEmail : undefined)) && (
              <a
                href={`mailto:${coordinator.email || sharedEmail}`}
                className="mt-1 flex items-center gap-1.5 text-slate-400 text-xs hover:text-cyan-400 transition-colors break-all"
              >
                <Mail size={11} className="flex-shrink-0" />
                <span>{coordinator.email || sharedEmail}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface EventCardProps {
  event: EventConfig;
  onRegister: (eventId: string) => void;
  onOpenDetails: (event: EventConfig) => void;
  registrationEnabled: boolean;
}

interface EventCatalogProps {
  onRegister: (eventId: string) => void;
  brochureVisibility?: BrochureVisibility;
}

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
}: EventCardProps) => (
  <motion.div
    variants={cardVariants}
    whileHover="hover"
    className="group relative min-h-[380px] md:h-[440px]"
  >

    {/* glow border */}
    <div className="absolute -inset-[1px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-400/40 via-purple-400/20 to-transparent blur-sm -z-10"></div>

    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,35,0.95),rgba(4,9,24,0.9))] backdrop-blur-xl rounded-[2.5rem] border border-cyan-400/10 group-hover:border-cyan-300/40 overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-[0_24px_60px_rgba(2,6,23,0.35)]">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent opacity-80" />
      <div className="absolute -right-10 top-10 w-28 h-28 rounded-full bg-purple-400/10 blur-3xl" />
      <div className="absolute -left-10 bottom-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 p-6 md:p-8 flex flex-col h-full text-left">

        <div className="flex justify-between items-start gap-4 mb-6 md:mb-8">

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-cyan-400/5 border border-cyan-400/20 rounded-[1.25rem] w-fit max-w-[14rem]">
              <span className="text-[9px] leading-tight font-black text-cyan-400 uppercase tracking-[0.2em] whitespace-normal break-words" title={event.department}>
                {event.department}
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

          <h4 className="text-2xl md:text-3xl font-futuristic font-black text-white group-hover:text-cyan-400 transition-colors uppercase leading-[0.9] italic tracking-tighter">
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

        <div className="flex items-center gap-3 pt-6 md:pt-8 border-t border-white/5">

          <button
            onClick={() => onOpenDetails(event)}
            className="flex-1 py-4 bg-white/5 hover:bg-cyan-400/10 border border-white/10 hover:border-cyan-300/40 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all"
          >
            SPEC_DATA
          </button>

          <button
  onClick={() => onRegister(event.id)}
  disabled={!registrationEnabled}
  className={`flex-[1.8] py-4 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
    registrationEnabled
      ? 'bg-gradient-to-r from-[#06b6d4] to-purple-400 hover:brightness-110 text-slate-950 shadow-[#06b6d4]/10'
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

export const EventCatalog: React.FC<EventCatalogProps> = ({
  onRegister,
  brochureVisibility = {},
}) => {

  const { config } = useSiteConfig();
  const [selectedEvent, setSelectedEvent] = useState<EventConfig | null>(null);
  const selectedBrochureHref = selectedEvent ? getBrochureHref(selectedEvent) : null;
  const shouldShowBrochure = selectedEvent
    ? brochureVisibility[selectedEvent.id] || Boolean(selectedBrochureHref)
    : false;

  return (
    <section
      id="events-section"
      className="py-12 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto relative bg-[#0a0a12]"
    >

      {/* background glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-400/5 blur-[180px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-400/5 blur-[160px] rounded-full -z-10 pointer-events-none"></div>

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 gap-6 md:gap-8"
      >

        <div className="space-y-5 text-left">

          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-cyan-400"></div>
            <h2 className="text-cyan-400 font-futuristic text-[10px] tracking-[0.5em] font-black uppercase">
              Battleground Directory
            </h2>
          </div>

          <h3 className="text-3xl md:text-6xl lg:text-7xl font-futuristic font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] italic text-white pr-2 md:pr-4">
            SELECT YOUR <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-300 py-1">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
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

      {/* MODAL - Compact two-column layout */}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-2 sm:p-4 md:p-6"
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[1.5rem] border border-white/10 p-4 sm:p-5 md:rounded-[2rem] md:p-8 relative"
            >

              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-500 hover:text-white z-10"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mb-4 md:mb-5 pr-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                    {selectedEvent.department}
                  </span>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    SECTOR_{selectedEvent.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-futuristic font-black uppercase text-white leading-tight">
                  {selectedEvent.name}
                </h2>
                <p className="text-purple-300 font-bold text-xs mt-1 tracking-wide">
                  {selectedEvent.tagline}
                </p>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm mb-4 md:mb-5 leading-relaxed line-clamp-3">{selectedEvent.description}</p>

              {/* Key Info Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3 mb-4 md:mb-5">
                {[
                  { icon: <Trophy size={12} />, label: 'Prize', value: selectedEvent.prizePool },
                  { icon: <Users size={12} />, label: 'Team', value: `${selectedEvent.minTeam}-${selectedEvent.maxTeam}` },
                  { icon: <Zap size={12} />, label: 'Fee', value: formatEventFee(selectedEvent.fee) },
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

                {/* Left Column - Rules + Venue */}
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

                {/* Right Column - Rounds */}
                <div className="space-y-4">
                  {selectedEvent.rounds.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-3">Rounds</h4>
                      <div className="relative space-y-3 pl-6 border-l border-white/10 ml-1">
                        {selectedEvent.rounds.map((round, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[29px] top-0 w-4.5 h-4.5 rounded-full bg-stone-900 border-2 border-cyan-400/60 flex items-center justify-center text-[8px] font-black text-cyan-400 z-10">
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
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-3 md:p-4">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-3">Contacts</h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.28em] mb-2">
                      Faculty Coordinators
                    </p>
                    <CoordinatorCards
                      coordinators={getFacultyCoordinators(selectedEvent)}
                      icon={<User size={12} />}
                      sharedEmail={selectedEvent.coordinatorEmail}
                    />
                  </div>

                  {selectedEvent.studentCoordinators && selectedEvent.studentCoordinators.length > 0 && (
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.28em] mb-2">
                          Student Coordinators
                        </p>
                        <CoordinatorCards
                          coordinators={selectedEvent.studentCoordinators}
                          icon={<Users size={12} />}
                        />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-5">
                {shouldShowBrochure && selectedBrochureHref && (
                  <a
                    href={selectedBrochureHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 hover:border-cyan-400/40 text-white font-black text-[11px] tracking-[0.22em] uppercase rounded-xl transition-all"
                  >
                    <Download size={15} />
                    BROCHURE
                  </a>
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

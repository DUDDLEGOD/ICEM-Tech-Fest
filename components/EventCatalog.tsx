import React, { useState } from 'react';
import { EVENTS } from '../constants';
import { EventConfig } from '../types';
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
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
  hover: {
    y: -10,
    transition: { type: 'spring', stiffness: 400, damping: 12 }
  }
};

interface EventCatalogProps {
  onRegister: (id: string) => void;
  brochureVisibility?: Record<string, boolean>;
}

interface EventCardProps {
  event: EventConfig;
  onRegister: (id: string) => void;
  onOpenDetails: (event: EventConfig) => void;
}

interface EventModalProps {
  event: EventConfig;
  onClose: () => void;
  onRegister: (id: string) => void;
  showBrochure?: boolean;
}

const EventRulesList: React.FC<{ rules: string[] }> = ({ rules }) => (
  <ul className="space-y-5">
    {rules.map((rule, i) => (
      <li key={i} className="flex gap-5 text-slate-300 text-[13px] font-medium items-start leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,1)]"></span>
        {rule}
      </li>
    ))}
  </ul>
);

const EventRoundsTimeline: React.FC<{ rounds: EventConfig['rounds'] }> = ({ rounds }) => (
  <div className="relative space-y-8 pl-10 border-l border-white/10 ml-2">
    {rounds.map((round, i) => (
      <div key={i} className="relative">
        <div className="absolute -left-[51px] top-0 w-6 h-6 rounded-full bg-stone-900 border-2 border-amber-500/50 flex items-center justify-center text-[10px] font-black text-amber-500 z-10">
          {i + 1}
        </div>
        <div className="space-y-2">
          <h5 className="font-black text-white text-sm tracking-widest uppercase">{round.title}</h5>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{round.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const EventCard: React.FC<EventCardProps> = ({ event, onRegister, onOpenDetails }) => (
  <motion.div key={event.id} variants={cardVariants} whileHover="hover" className="group relative h-[440px]">
    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] group-hover:from-amber-500/50 transition-all duration-500 -z-10"></div>

    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col justify-between transition-all duration-500">
      <div className="relative z-10 p-8 flex flex-col h-full text-left">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-amber-500/5 border border-amber-500/20 rounded-full w-fit">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                {event.department.split(' ')[0]}
              </span>
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] block ml-1">SECTOR_{event.id}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl text-amber-500 border border-white/5 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
            <Trophy size={18} />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h4 className="text-3xl font-futuristic font-black text-white group-hover:text-amber-500 transition-colors uppercase leading-[0.9] italic tracking-tighter">
            {event.name}
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-amber-500" />
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{event.tagline}</p>
          </div>
          <div className="pt-4">
            <p className="text-slate-500 text-[12px] leading-relaxed font-medium line-clamp-3">{event.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-8 border-t border-white/5">
          <button
            onClick={() => onOpenDetails(event)}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all"
          >
            SPEC_DATA
          </button>
          <button
            onClick={() => onRegister(event.id)}
            className="flex-[1.8] py-4 bg-amber-500 hover:bg-white text-black font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-amber-500/5 flex items-center justify-center gap-2"
          >
            JOIN_ARENA <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onRegister, showBrochure }) => {
  const handleDownloadBrochure = () => {
    // In a real app, this would be a PDF URL specifically for the event
    // For this prototype, we'll create a text file to download
    const content = `TECHNQFEST 2026 - EVENT BROCHURE\n\nEvent: ${event.name}\nDepartment: ${event.department}\nDetails: ${event.description}\n\nRules:\n${event.rules.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechnoFest26_${event.id}_Brochure.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl overflow-y-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative glass max-w-5xl w-full rounded-[3rem] border border-white/10 overflow-hidden my-auto shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
      >
        <X size={24} />
      </button>

      <div className="relative z-10 p-10 md:p-16 space-y-12 text-left">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 border-b border-white/5 pb-12">
          <div className="space-y-5 max-w-3xl">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 leading-none">
                <Target size={14} /> {event.department}
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-futuristic font-black uppercase text-white tracking-tighter italic leading-none">
              {event.name}
            </h2>
            <p className="text-xl text-slate-400 italic font-medium leading-relaxed">"{event.tagline}"</p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-amber-500 border border-amber-400 px-8 py-6 rounded-3xl text-center shadow-2xl shadow-amber-500/10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black font-black block mb-2 opacity-60">Prize Fund</span>
              <p className="text-3xl font-futuristic font-black text-black leading-none">{event.prizePool}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Shield size={18} className="text-amber-500" />
              <h4 className="font-futuristic text-xs font-black tracking-[0.5em] text-white uppercase">Combat Rules</h4>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
              <EventRulesList rules={event.rules} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Clock size={18} className="text-amber-500" />
              <h4 className="font-futuristic text-xs font-black tracking-[0.5em] text-white uppercase">Timeline Phase</h4>
            </div>
            <EventRoundsTimeline rounds={event.rounds} />
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-10">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-amber-500" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">{event.eventDateLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-amber-500" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">{event.eventTimeLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-amber-500" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">
                {event.minTeam}-{event.maxTeam} Combatants
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-amber-500" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">{event.venueLabel}</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Coordinator Desk</p>
              <p className="text-white font-bold text-base">{event.coordinatorName}</p>
              <div className="flex flex-wrap gap-6">
                <a href={`mailto:${event.coordinatorEmail}`} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold">
                  <Mail size={14} className="text-amber-500" />
                  {event.coordinatorEmail}
                </a>
                <a href={`tel:${event.coordinatorPhone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold">
                  <Phone size={14} className="text-amber-500" />
                  {event.coordinatorPhone}
                </a>
              </div>
              {showBrochure && (
                <button
                  onClick={handleDownloadBrochure}
                  className="w-full md:w-auto px-8 py-6 bg-transparent border-2 border-teal-500/50 hover:border-teal-400 hover:bg-teal-500/10 text-teal-400 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <Download size={16} /> BROCHURE
                </button>
              )}
            </div>

            <button
              onClick={() => onRegister(event.id)}
              className="w-full md:w-auto px-16 py-6 bg-white hover:bg-amber-500 text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
            >
              <Zap size={18} /> INITIALIZE_UPLINK
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
  );
};

export const EventCatalog: React.FC<EventCatalogProps> = ({ onRegister, brochureVisibility = {} }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventConfig | null>(null);

  return (
    <section id="events-section" className="py-12 md:py-16 px-6 max-w-7xl mx-auto relative bg-[#0c0a09]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 gap-8"
      >
        <div className="space-y-5 text-left">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-amber-500"></div>
            <h2 className="text-amber-500 font-futuristic text-[10px] tracking-[0.5em] font-black uppercase">Battleground Directory</h2>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-futuristic font-black tracking-tighter uppercase leading-[0.85] italic text-white pr-4">
            SELECT YOUR <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-amber-200 py-1">ENVIRONMENT</span>
          </h3>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
      >
        {EVENTS.map((event) => (
          <EventCard key={event.id} event={event} onRegister={onRegister} onOpenDetails={setSelectedEvent} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
            onRegister={onRegister} 
            showBrochure={brochureVisibility[selectedEvent.id]}
          />
        )}
      </AnimatePresence>
    </section>
  );
};


import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronRight,
    Cpu,
    Home,
    Info,
    Layers,
    MessageSquare,
    Shield,
    ShieldCheck,
    Terminal,
    X,
    Zap
} from 'lucide-react';
import React from 'react';
import { AppView, Department } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView, section?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { name: 'Home Portal', icon: Home, action: () => onNavigate('home') },
    { name: 'About ICEM', icon: Info, action: () => onNavigate('about') },
    { name: 'Event Deck', icon: Terminal, action: () => onNavigate('home', 'events-section') },
    { name: 'Registration', icon: Zap, action: () => onNavigate('home', 'events-section') },
    { name: 'Social Feed', icon: MessageSquare, action: () => onNavigate('home', 'social-section') },
  ];

  const deptItems = Object.entries(Department).map(([key, value]) => ({
    name: value,
    short: key,
    icon: key === 'COMPS' || key === 'IT' ? Cpu : key === 'MECH' || key === 'ENTC' ? Layers : Shield
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900]"
          />

          {/* Sidebar Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[280px] md:w-[350px] glass border-r border-amber-500/20 z-[1000] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black italic shadow-lg shadow-amber-500/10">T</div>
                <div>
                  <h4 className="font-futuristic text-xs font-black uppercase tracking-widest text-white">Menu</h4>
                  <span className="text-[8px] font-bold text-amber-500/50 uppercase tracking-[0.3em]">System Navigation</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
              <div className="space-y-2">
                <span className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Main Protocols</span>
                <div className="space-y-1">
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { item.action(); onClose(); }}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-amber-500/10 text-slate-400 hover:text-amber-500 transition-all group"
                    >
                      <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                      <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Event Categories</span>
                <div className="grid grid-cols-1 gap-2">
                  {deptItems.map((dept, i) => (
                    <button
                      key={i}
                      onClick={() => { onNavigate('home', 'events-section'); onClose(); }}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/5 hover:border-blue-500/30 bg-white/[0.02] hover:bg-blue-500/5 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <dept.icon size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{dept.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="p-8 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Connection Secure</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

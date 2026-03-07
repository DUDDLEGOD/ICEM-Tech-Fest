import React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useSiteConfig } from '../contexts/useSiteConfig';

interface AboutPageProps {
  onNavigateBack: () => void;
}

const HUDDecoration = ({ className }: { className?: string }) => (
  <div
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
  </div>
);

const campusFeatures = [
  { icon: Library, title: 'Central Library', desc: 'Digital repository with journals and IEEE access.', color: 'text-emerald-500' },
  { icon: Microscope, title: 'Research Labs', desc: 'Infrastructure for AI, Robotics, and Civil.', color: 'text-purple-500' },
  { icon: Globe, title: 'Academic Synergy', desc: 'Collaborations with global institutions.', color: 'text-blue-500' },
  { icon: Shield, title: 'NAAC Accredited', desc: 'Certified standards of excellence.', color: 'text-amber-500' },
];

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
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <HUDDecoration className="top-24 left-12 hidden lg:block" />
      <HUDDecoration className="bottom-24 right-12 hidden lg:block rotate-180" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.button
          onClick={onNavigateBack}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors group mb-6"
        >
          <ChevronLeft size={18} className="group-hover:animate-pulse" />
          <span className="font-futuristic text-[9px] font-black uppercase tracking-[0.3em]">Back to Portal</span>
        </motion.button>

        <div className="space-y-24">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">
                  <Activity size={12} /> {about.eventBadge}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-futuristic font-black uppercase italic leading-[1] tracking-tighter text-white">
                  {about.eventHeadline}
                  <br />
                  <span className="text-amber-500">{about.eventHighlight}</span>
                </h1>
              </div>

              <div className="space-y-6">
                <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic border-l-2 border-amber-500/30 pl-6 max-w-2xl">
                  "{about.eventQuote}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass p-6 rounded-2xl border-white/5 space-y-3 hover:bg-white/[0.02] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Code size={18} />
                    </div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Technical Framework</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase">
                      {about.technicalFrameworkText}
                    </p>
                  </div>
                  <div className="glass p-6 rounded-2xl border-white/5 space-y-3 hover:bg-white/[0.02] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Rocket size={18} />
                    </div>
                    <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Industry Linkage</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase">
                      {about.industryLinkageText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 relative group mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-amber-500/5 blur-2xl rounded-[2.5rem] group-hover:bg-amber-500/10 transition-all duration-700" />
              <div className="relative glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src={about.eventImageUrl}
                  alt="TechnoFest Event"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-amber-500/50" />
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">EVNT_HQ / SECTOR_01</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none">
                    <Landmark size={12} /> {about.institutionBadge}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-futuristic font-black uppercase text-white tracking-tighter leading-none italic">
                    {about.institutionTitle}
                    <br />
                    <span className="text-blue-500">{about.institutionHighlight}</span>
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{about.institutionDescription}</p>
                </div>

                <div className="space-y-4">
                  <div className="group glass p-6 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all bg-gradient-to-br from-blue-500/[0.02] to-transparent">
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                        <Target size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-white font-futuristic text-[11px] font-black uppercase tracking-widest">VISION_CORE</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{about.visionText}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group glass p-6 rounded-2xl border-white/5 hover:border-amber-500/30 transition-all bg-gradient-to-br from-amber-500/[0.02] to-transparent">
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-lg">
                        <BookOpen size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-white font-futuristic text-[11px] font-black uppercase tracking-widest">MISSION_PROTOCOL</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{about.missionText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {campusFeatures.map((feature) => (
                  <div key={feature.title} className="glass p-6 rounded-2xl border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <feature.icon className={`w-6 h-6 ${feature.color} mb-3 group-hover:scale-110 transition-transform`} />
                    <h5 className="text-white font-black text-[9px] uppercase tracking-[0.2em] mb-1">{feature.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">{feature.desc}</p>
                  </div>
                ))}

                <div className="md:col-span-2 glass p-6 rounded-3xl border-white/5 relative overflow-hidden h-[240px]">
                  <img
                    src={about.campusImageUrl}
                    alt="ICEM Campus Wide"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="relative z-10 flex flex-col justify-end h-full">
                    <h5 className="text-white font-futuristic text-xl font-black uppercase tracking-tighter italic">CAMPUS_SITE</h5>
                    <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.4em] mt-1">{about.campusLocationLabel}</p>
                    <a
                      href={about.campusSiteUrl || contact.institutionSiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-3 px-6 py-3 bg-white text-black font-black uppercase tracking-[0.3em] text-[9px] rounded-xl w-fit hover:bg-amber-500 hover:text-white transition-all shadow-xl"
                    >
                      OFFICIAL HQ SITE <Globe size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-amber-500 to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {about.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="space-y-1 group">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block group-hover:text-amber-500 transition-colors">
                    {stat.label}
                  </span>
                  <span className="text-3xl md:text-5xl font-futuristic font-black text-white italic tracking-tighter group-hover:scale-105 transition-transform block">
                    {stat.value}
                  </span>
                  <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em] block">{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

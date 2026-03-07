import React from 'react';
import { Github, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink, Globe, Zap, Home, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '../contexts/useSiteConfig';

export const Footer: React.FC = () => {
  const { config } = useSiteConfig();
  const deptLinks = [
    { name: 'COMPUTER ENGINEERING', url: 'https://indiraicem.ac.in/programs/computer-engineering/' },
    { name: 'INFORMATION TECHNOLOGY', url: 'https://indiraicem.ac.in/programs/information-technology/' },
    { name: 'AI & DATA SCIENCE', url: 'https://indiraicem.ac.in/programs/artificial-intelligence-and-data-science/' },
    { name: 'ELECTRONICS & TELECOMM.', url: 'https://indiraicem.ac.in/programs/electronics-and-telecommunication-engineering/' },
    { name: 'MECHANICAL ENGINEERING', url: 'https://indiraicem.ac.in/programs/mechanical-engineering/' },
    { name: 'CIVIL ENGINEERING', url: 'https://indiraicem.ac.in/programs/civil-engineering/' },
  ];

  const quickLinks = [
    { name: 'HOME PORTAL', icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'EVENT CATALOG', icon: Zap, action: () => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'INSTITUTIONAL HQ', icon: Globe, url: config.contact.institutionSiteUrl },
  ];

  return (
    <footer id="contact-section" className="relative z-10 pt-16 pb-8 px-6 bg-[#0a0a12] border-t border-white/5 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="font-futuristic text-2xl tracking-tighter leading-none font-black italic text-white">TECHNOFEST<span className="text-teal-400">2026</span></h2>
            <div className="border-l-2 border-teal-500/40 pl-4 space-y-2">
              <p className="text-slate-300 text-[10px] font-bold uppercase tracking-tight">Indira College of Engineering and Management (ICEM)</p>
              <p className="text-slate-500 text-[9px] font-medium leading-relaxed">{config.contact.footerBlurb}</p>
            </div>
            <div className="flex items-center gap-4">
              <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-teal-400 transition-all"><Instagram size={16}/></a>
              <a href={config.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-teal-400 transition-all"><Linkedin size={16}/></a>
              <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-teal-400 transition-all"><Github size={16}/></a>
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-10">
            <h5 className="font-futuristic text-[11px] font-black tracking-[0.4em] text-teal-400 uppercase">Academic Sectors</h5>
            <div className="space-y-2">
              {deptLinks.map((dept, i) => (
                <a key={i} href={dept.url} target="_blank" rel="noopener" className="flex items-center justify-between group py-1.5 transition-all border-b border-white/[0.02]">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{dept.name}</span>
                  <ExternalLink size={11} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-10">
            <h5 className="font-futuristic text-[11px] font-black tracking-[0.4em] text-purple-400 uppercase">Navigation</h5>
            <div className="space-y-4">
              {quickLinks.map((link, i) => (
                <button key={i} onClick={link.action ? link.action : () => window.open(link.url, '_blank')} className="flex items-center gap-4 group w-full text-left transition-all">
                  <div className="p-2.5 rounded-xl bg-white/5 text-slate-600 group-hover:text-purple-400 transition-all border border-transparent group-hover:border-purple-400/20"><link.icon size={14}/></div>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-white tracking-[0.2em] uppercase transition-colors">{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-10">
            <h5 className="font-futuristic text-[11px] font-black tracking-[0.4em] text-teal-400 uppercase">Connect</h5>
            <ul className="space-y-6">
              <li className="flex gap-4"><MapPin size={16} className="text-teal-400"/><span className="text-[11px] font-bold text-slate-300 uppercase">{config.contact.address}</span></li>
              <li className="flex gap-4"><Mail size={16} className="text-teal-400"/><a href={`mailto:${config.contact.email}`} className="text-[11px] font-bold text-slate-300 hover:text-teal-400 transition-colors">{config.contact.email}</a></li>
              <li className="flex gap-4"><Phone size={16} className="text-teal-400"/><a href={`tel:${config.contact.phone.replace(/\s+/g, '')}`} className="text-[11px] font-bold text-white hover:text-teal-400 transition-colors">{config.contact.phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10 min-h-[50px]">
          <p className="text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase text-center lg:text-left">
            &copy; 2026 ICEM TECHNOFEST &bull; OFFICIAL REGISTRATION PORTAL
          </p>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-purple-500/5 rounded-xl border border-purple-500/20">
            <ShieldCheck size={14} className="text-purple-500" />
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">SSL SECURE CONNECTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

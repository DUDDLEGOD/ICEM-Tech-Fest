
import React from 'react';
import { Github, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink, Globe, Zap, Home, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
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
    { name: 'INSTITUTIONAL HQ', icon: Globe, url: 'https://indiraicem.ac.in/' },
  ];

  return (
    <footer id="contact-section" className="relative z-10 pt-16 pb-8 px-6 bg-[#0c0a09] border-t border-white/5 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <h2 className="font-futuristic text-2xl tracking-tighter leading-none font-black italic text-white">TECHNOFEST<span className="text-amber-500">2026</span></h2>
            <div className="border-l-2 border-teal-500/40 pl-4 space-y-2">
              <p className="text-slate-300 text-[10px] font-bold uppercase tracking-tight">Indira College of Engineering and Management (ICEM)</p>
              <p className="text-slate-500 text-[9px] font-medium leading-relaxed">Official technical wing of SCES. Focusing on Engineering & Management excellence.</p>
            </div>
            <div className="flex items-center gap-4">
              {[Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-teal-400 transition-all"><Icon size={16}/></a>
              ))}
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
            <h5 className="font-futuristic text-[11px] font-black tracking-[0.4em] text-amber-500 uppercase">Navigation</h5>
            <div className="space-y-4">
              {quickLinks.map((link, i) => (
                <button key={i} onClick={link.action ? link.action : () => window.open(link.url, '_blank')} className="flex items-center gap-4 group w-full text-left transition-all">
                  <div className="p-2.5 rounded-xl bg-white/5 text-slate-600 group-hover:text-amber-500 transition-all border border-transparent group-hover:border-amber-500/20"><link.icon size={14}/></div>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-white tracking-[0.2em] uppercase transition-colors">{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-10">
            <h5 className="font-futuristic text-[11px] font-black tracking-[0.4em] text-teal-400 uppercase">Connect</h5>
            <ul className="space-y-6">
              <li className="flex gap-4"><MapPin size={16} className="text-teal-400"/><span className="text-[11px] font-bold text-slate-300 uppercase">Parandwadi, Pune, MH 410506</span></li>
              <li className="flex gap-4"><Mail size={16} className="text-teal-400"/><a href="mailto:icem@indiraicem.ac.in" className="text-[11px] font-bold text-slate-300 hover:text-teal-400 transition-colors">icem@indiraicem.ac.in</a></li>
              <li className="flex gap-4"><Phone size={16} className="text-teal-400"/><a href="tel:+918855977815" className="text-[11px] font-bold text-white hover:text-teal-400 transition-colors">+91 88559 77815</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
          <p className="text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase text-center lg:text-left">© 2026 ICEM TECHNOFEST • OFFICIAL REGISTRATION PORTAL</p>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/5 rounded-xl border border-blue-500/20">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SSL SECURE CONNECTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

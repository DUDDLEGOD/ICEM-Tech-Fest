import React from 'react';
import { ArrowRight, Megaphone } from 'lucide-react';
import { useSiteConfig } from '../contexts/useSiteConfig';

export const SiteAnnouncement: React.FC = () => {
  const { config } = useSiteConfig();
  const { announcement } = config;

  if (!announcement.enabled || !announcement.message.trim()) {
    return null;
  }

  const handleAction = () => {
    if (!announcement.ctaHref) {
      return;
    }

    if (announcement.ctaHref.startsWith('#')) {
      document.querySelector(announcement.ctaHref)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.open(announcement.ctaHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="site-notice" className="px-4 md:px-6 pt-4">
      <div className="max-w-7xl mx-auto rounded-[2rem] border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent px-5 py-4 md:px-8 md:py-5 shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
              <Megaphone size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">
                {announcement.label || 'Live Update'}
              </p>
              <p className="text-sm font-semibold text-slate-100 md:text-base">{announcement.message}</p>
            </div>
          </div>

          {announcement.ctaText.trim() && announcement.ctaHref.trim() && (
            <button
              onClick={handleAction}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-400/30 px-5 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-amber-300 transition-colors hover:bg-amber-400 hover:text-black"
            >
              {announcement.ctaText}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Heart, MessageCircle, Share2 } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    user: "@cyber_kavi",
    msg: "Just registered for #CodeVerse at #TechnoFest2026! 🚀 The logic problems look insane. Team Matrix ready for battle!",
    type: "Twitter",
    likes: 124,
    comments: 12,
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 2,
    user: "tech_aura",
    msg: "Bridge-It prep is in full swing! 🌉 Testing structural integrity with 10kg loads. See you at ICEM on March 14th!",
    type: "Instagram",
    likes: 450,
    comments: 34,
    color: "from-pink-500/20 to-transparent"
  },
  {
    id: 3,
    user: "@ai_junkie",
    msg: "Agentic AI rounds are going to be a game changer. Building a swarm that solves real-world logistics. 🔥 #TechnoFestInnovation",
    type: "Twitter",
    likes: 89,
    comments: 5,
    color: "from-amber-500/20 to-transparent"
  },
  {
    id: 4,
    user: "@pune_coder",
    msg: "The TechnoFest arena is looking futuristic! Can't wait to see the RoboVerse battles. 🤖🔥 #ICEMTechnoFest",
    type: "Twitter",
    likes: 210,
    comments: 18,
    color: "from-purple-500/20 to-transparent"
  },
  {
    id: 5,
    user: "design_node",
    msg: "Vibe Coding is my new favorite genre. UI design with live rhythm? Count me in! 🎨🎹",
    type: "Instagram",
    likes: 567,
    comments: 42,
    color: "from-emerald-500/20 to-transparent"
  }
];

export const SocialFeed: React.FC = () => {
  const scrollingPosts = [...POSTS, ...POSTS, ...POSTS];

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 font-futuristic text-sm tracking-[0.4em] font-bold uppercase"
          >
            Live Feed
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-futuristic font-black uppercase tracking-tighter"
          >
            #TechnoFest26
          </motion.h3>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          Syncing Real-time Mentions
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden py-10 group">
        <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#0c0a09] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#0c0a09] to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-scroll-social group-hover:pause gap-8 w-max px-4">
          {scrollingPosts.map((post, i) => (
            <div
              key={`${post.id}-${i}`}
              className="w-[320px] md:w-[400px] shrink-0 glass p-8 rounded-[2.5rem] border border-white/5 space-y-6 group/card hover:border-amber-500/40 transition-all relative overflow-hidden bg-stone-900/40 backdrop-blur-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-white text-lg group-hover/card:scale-110 transition-transform">
                    {post.user.charAt(post.user.startsWith('@') ? 1 : 0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white tracking-tight">{post.user}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{post.type}</span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl text-slate-400 group-hover/card:text-white transition-colors">
                  {post.type === 'Twitter' ? <Twitter size={18} /> : <Instagram size={18} />}
                </div>
              </div>

              <p className="relative z-10 text-slate-400 text-sm leading-relaxed min-h-[70px] font-medium">
                {post.msg}
              </p>

              <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-white/5 text-slate-500">
                <div className="flex items-center gap-2 hover:text-red-500 transition-colors cursor-pointer group/stat">
                  <Heart size={16} className="group-hover/stat:fill-red-500 transition-all" /> 
                  <span className="text-xs font-black">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer group/stat">
                  <MessageCircle size={16} className="group-hover/stat:fill-blue-500 transition-all" /> 
                  <span className="text-xs font-black">{post.comments}</span>
                </div>
                <div className="ml-auto hover:text-white transition-colors cursor-pointer">
                  <Share2 size={16} />
                </div>
              </div>

              <div className="absolute bottom-4 right-8 text-[40px] font-black text-white/[0.03] italic font-futuristic pointer-events-none select-none">
                {post.type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-social {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * (400px + 2rem) * ${POSTS.length})); }
        }
        @media (max-width: 768px) {
          @keyframes scroll-social {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-1 * (320px + 2rem) * ${POSTS.length})); }
          }
        }
        .animate-scroll-social {
          animation: scroll-social 60s linear infinite;
        }
        .group-hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};


import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { EventCatalog } from './components/EventCatalog';
import { RegistrationForm } from './components/RegistrationForm';
import { AboutPage } from './components/AboutPage';
import { SocialFeed } from './components/SocialFeed';
import { Footer } from './components/Footer';
import { BackgroundEffect } from './components/BackgroundEffect';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundMusic } from './components/BackgroundMusic';
import { Registration } from './types';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [view, setView] = useState<'home' | 'register' | 'about'>('home');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('nexus_regs');
    if (stored) setRegistrations(JSON.parse(stored));
  }, []);

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId);
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onRegistrationSuccess = (reg: Registration) => {
    const newRegs = [...registrations, reg];
    setRegistrations(newRegs);
    localStorage.setItem('nexus_regs', JSON.stringify(newRegs));
    
    setView('home');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const renderView = () => {
    switch (view) {
      case 'register':
        return (
          <RegistrationForm 
            onSuccess={onRegistrationSuccess} 
            initialEventId={selectedEventId}
          />
        );
      case 'about':
        return <AboutPage onNavigateBack={() => setView('home')} />;
      default:
        return (
          <>
            <Hero />
            <EventCatalog onRegister={handleRegister} />
            <Marquee />
            <div id="social-section">
              <SocialFeed />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen relative text-slate-50 selection:bg-amber-500 selection:text-white cursor-none bg-[#0c0a09]">
      <CustomCursor />
      <BackgroundEffect />
      
      <Navbar 
        currentView={view} 
        setView={setView} 
      />

      <BackgroundMusic />

      <main className="relative z-10 pt-20 md:pt-24">
        {renderView()}
      </main>

      <Footer />

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4"
          >
            <div className="glass border-green-500/50 p-6 rounded-3xl shadow-2xl shadow-green-500/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-green-500/20">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-futuristic text-sm font-black uppercase text-white tracking-tighter">Registration Successful</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Cloud sync complete. Check your email for further instructions.</p>
              </div>
              <button onClick={() => setShowSuccessToast(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

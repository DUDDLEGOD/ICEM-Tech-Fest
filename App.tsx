
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/700.css';

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { SocialFeed } from './components/SocialFeed';
import { Footer } from './components/Footer';
import { BackgroundEffect } from './components/BackgroundEffect';

import { BackgroundMusic } from './components/BackgroundMusic';
import { AppView, Registration } from './types';
import { CheckCircle2, X, Loader2 } from 'lucide-react';

const EventCatalog = lazy(() => import('./components/EventCatalog').then(m => ({ default: m.EventCatalog })));
const RegistrationForm = lazy(() => import('./components/RegistrationForm').then(m => ({ default: m.RegistrationForm })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
import { motion, AnimatePresence } from 'framer-motion';

const REGISTRATIONS_STORAGE_KEY = 'nexus_regs';
const SUCCESS_TOAST_TIMEOUT_MS = 5000;
const DEFAULT_SUCCESS_TOAST_MESSAGE = 'Cloud sync complete. Check your email for further instructions.';

const loadStoredRegistrations = (): Registration[] => {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse stored registrations:', error);
    return [];
  }
};

const BROCHURES_STORAGE_KEY = 'nexus_brochures';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState(DEFAULT_SUCCESS_TOAST_MESSAGE);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [brochureVisibility, setBrochureVisibility] = useState<Record<string, boolean>>({});
  const successToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const storedVisibility = localStorage.getItem(BROCHURES_STORAGE_KEY);
      if (storedVisibility) {
        setBrochureVisibility(JSON.parse(storedVisibility));
      }
    } catch (e) {
      console.error('Failed to parse brochure settings:', e);
    }
  }, [view]);

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId);
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onRegistrationSuccess = (reg: Registration, toastMessage?: string) => {
    const nextRegistrations = [...loadStoredRegistrations(), reg];
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(nextRegistrations));
    
    setView('home');
    setSuccessToastMessage(toastMessage ?? DEFAULT_SUCCESS_TOAST_MESSAGE);
    setShowSuccessToast(true);

    if (successToastTimeoutRef.current !== null) {
      window.clearTimeout(successToastTimeoutRef.current);
    }

    successToastTimeoutRef.current = window.setTimeout(() => {
      setShowSuccessToast(false);
      successToastTimeoutRef.current = null;
    }, SUCCESS_TOAST_TIMEOUT_MS);
  };

  useEffect(() => {
    return () => {
      if (successToastTimeoutRef.current !== null) {
        window.clearTimeout(successToastTimeoutRef.current);
      }
    };
  }, []);

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
      case 'admin':
        return <AdminDashboard onNavigateBack={() => setView('home')} />;
      default:
        return (
          <>
            <Hero />
            <EventCatalog onRegister={handleRegister} brochureVisibility={brochureVisibility} />
            <Marquee />
            <div id="social-section">
              <SocialFeed />
            </div>
          </>
        );
    }
  };

  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-teal-400 gap-6">
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-teal-500 to-purple-500 animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <img src="/icem-logo.png" alt="ICEM Logo" className="w-full h-full object-cover rounded-full bg-black" />
      </div>
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin" size={20} />
        <span className="font-futuristic tracking-[0.3em] uppercase text-[10px] md:text-xs">Initializing Uplink...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative text-slate-50 selection:bg-[#006466] selection:text-white bg-[#0a0a12]">
      <BackgroundEffect />
      
      <Navbar 
        currentView={view} 
        setView={setView} 
      />

      <BackgroundMusic />

      <main className="relative z-10 pt-20 md:pt-24 min-h-[80vh]">
        <Suspense fallback={<LoadingFallback />}>
          {renderView()}
        </Suspense>
      </main>

      <Footer setView={setView} />

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
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{successToastMessage}</p>
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

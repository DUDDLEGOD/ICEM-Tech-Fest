import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventConfig, EventID, Department } from '../types';

export interface HeroConfig {
  institution: string;
  organizingLabel: string;
  subLabel: string;
  mainTitlePart1: string;
  mainTitlePart2: string;
  scrambleText: string;
  buttonText: string;
  countdownDate: string;
}

export interface SiteConfig {
  hero: HeroConfig;
  events: EventConfig[];
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

const DEFAULT_EVENTS: EventConfig[] = [
  {
    id: EventID.VAC,
    name: 'Virtual Avatar Championship',
    tagline: 'Unleash your digital alter ego',
    description: 'Design and render high-fidelity 3D avatars. Compete in the ultimate digital fashion and lore showdown.',
    department: Department.COMPS,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '10:00 AM - 04:00 PM',
    venueLabel: 'Digital Design Lab, ICEM',
    coordinatorName: 'Prof. Aditi Patil',
    coordinatorEmail: 'vac@indiraicem.ac.in',
    coordinatorPhone: '+91 88559 77815',
    rules: [
      'Character must be original',
      'Idea abstract must be submitted in text',
      'Real-time rendering required in Final Round'
    ],
    rounds: [
      { title: 'Conceptualization', desc: 'Submit your character design abstract and lore.' },
      { title: 'The Nexus Arena', desc: 'Live presentation of your 3D avatar.' }
    ]
  },
  {
    id: EventID.CODEVERSE,
    name: 'CodeVerse',
    tagline: 'Survival of the Fittest Code',
    description: 'Battle through algorithmic gauntlets and full-stack architecture challenges in a high-pressure environment.',
    department: Department.IT,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B930,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '09:00 AM - 06:00 PM',
    venueLabel: 'Seminar Hall 2, ICEM',
    coordinatorName: 'Prof. Rohan Kulkarni',
    coordinatorEmail: 'codeverse@indiraicem.ac.in',
    coordinatorPhone: '+91 90211 33445',
    rules: [
      'Exact team size protocols active',
      'No internet access during rounds',
      'Languages: C++, Java, Python'
    ],
    rounds: [
      { title: 'The Matrix', desc: 'Rapid fire algorithmic challenges.' },
      { title: 'Project Architect', desc: 'Full-stack module development.' }
    ]
  },
  {
    id: EventID.AGENTS,
    name: 'Agentic AI',
    tagline: 'Prompt, Deploy, Dominate',
    description: 'Master LLM orchestration. Build autonomous agents capable of solving multi-step real-world workflows.',
    department: Department.AIDS,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B920,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '11:00 AM - 05:00 PM',
    venueLabel: 'AI Center, ICEM',
    coordinatorName: 'Prof. Snehal Joshi',
    coordinatorEmail: 'agenticai@indiraicem.ac.in',
    coordinatorPhone: '+91 97662 14789',
    rules: [
      'Use of any LLM allowed',
      'Must build a functional agentic workflow',
      'Focus on automation and problem solving'
    ],
    rounds: [
      { title: 'The Prompt Engineering', desc: 'Optimizing AI outputs for complex tasks.' },
      { title: 'Agent Deployment', desc: 'Solving real-world scenarios with autonomous agents.' }
    ]
  },
  {
    id: EventID.ROBO,
    name: 'RoboVerse',
    tagline: 'The Ultimate Metal Clash',
    description: 'Engineered for destruction. Enter the arena for high-octane robot combat and precision obstacle racing.',
    department: Department.MECH,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B950,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '10:30 AM - 06:30 PM',
    venueLabel: 'Mechanical Workshop Arena, ICEM',
    coordinatorName: 'Prof. Pratik More',
    coordinatorEmail: 'roboverse@indiraicem.ac.in',
    coordinatorPhone: '+91 91588 00124',
    rules: [
      'Robot weight limit: 15kg',
      'Combat and Racing categories',
      'Remote control only (No wired)'
    ],
    rounds: [
      { title: 'Circuit Race', desc: 'Navigate the obstacle-filled track.' },
      { title: 'Death Match', desc: 'The last bot standing wins.' }
    ]
  },
  {
    id: EventID.BRIDGE,
    name: 'Bridge-It',
    tagline: 'Structural Elegance & Strength',
    description: 'Construct popsicle-stick marvels. Test the limits of structural engineering under extreme point loads.',
    department: Department.CIVIL,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B915,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '09:30 AM - 03:30 PM',
    venueLabel: 'Civil Structure Lab, ICEM',
    coordinatorName: 'Prof. Shruti Deshmukh',
    coordinatorEmail: 'bridgeit@indiraicem.ac.in',
    coordinatorPhone: '+91 99228 11456',
    rules: [
      'Only popsicles and glue allowed',
      'Maximum span: 1.5 meters',
      'Aesthetics carry 30% weightage'
    ],
    rounds: [
      { title: 'Construction Phase', desc: 'On-site bridge building (3 hours).' },
      { title: 'Load Test', desc: 'Point load application until structural failure.' }
    ]
  },
  {
    id: EventID.VIBE,
    name: 'Vibe Coding',
    tagline: 'Code with Aesthetic & Rhythm',
    description: 'Where UI design meets creative rhythm. Build stunning visual experiences with live interactive logic.',
    department: Department.BCA,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: '\u20B910,000',
    eventDateLabel: 'March 14, 2026',
    eventTimeLabel: '12:00 PM - 05:00 PM',
    venueLabel: 'Innovation Studio, ICEM',
    coordinatorName: 'Prof. Neha Pawar',
    coordinatorEmail: 'vibecoding@indiraicem.ac.in',
    coordinatorPhone: '+91 98344 77120',
    rules: [
      'Creative synergy required',
      'Creativity > Complexity',
      "Live 'Vibing' while coding is encouraged"
    ],
    rounds: [
      { title: 'Visual Symphony', desc: 'Build the most visually stunning UI.' },
      { title: 'Creative Logic', desc: 'Add interactivity that wows the judges.' }
    ]
  }
];

const DEFAULT_CONFIG: SiteConfig = {
  hero: {
    institution: 'INDIRA COLLEGE OF ENGINEERING & MANAGEMENT',
    organizingLabel: 'Organizing',
    subLabel: "The Largest Gathering of Pune's Tech Innovators",
    mainTitlePart1: 'TECHNOFEST',
    mainTitlePart2: '2026',
    scrambleText: 'THE ULTIMATE TECH ARENA',
    buttonText: 'INITIATE CONNECTION',
    countdownDate: '2026-03-14T09:00:00'
  },
  events: DEFAULT_EVENTS,
  socialLinks: {
    instagram: '#',
    twitter: '#',
    linkedin: '#'
  }
};

const SITE_CONFIG_STORAGE_KEY = 'nexus_site_config';

interface SiteContextProps {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetToDefault: () => void;
}

const SiteContext = createContext<SiteContextProps | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const mergedHero = {
          ...DEFAULT_CONFIG.hero,
          ...(parsed.hero || {})
        };
        // Remove deprecated key so it doesn't show up in Admin Dashboard
        if ('mainTitle' in mergedHero) {
          delete (mergedHero as any).mainTitle;
        }

        // Upgrade from older split "TECHNO" "FEST" or missing ones
        if ((mergedHero.mainTitlePart1 === 'TECHNO' && mergedHero.mainTitlePart2 === 'FEST') || !mergedHero.mainTitlePart1) {
            mergedHero.mainTitlePart1 = 'TECHNOFEST';
            mergedHero.mainTitlePart2 = '2026';
        }

        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          hero: mergedHero,
          socialLinks: {
            ...DEFAULT_CONFIG.socialLinks,
            ...(parsed.socialLinks || {})
          }
        };
      }
    } catch (e) {
      console.error('Failed to parse Site Config from local storage:', e);
    }
    return DEFAULT_CONFIG;
  });

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
  };

  return (
    <SiteContext.Provider value={{ config, updateConfig, resetToDefault }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteProvider');
  }
  return context;
};

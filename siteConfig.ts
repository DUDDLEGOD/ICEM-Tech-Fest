import {
  AboutPageConfig,
  AboutStatConfig,
  AnnouncementConfig,
  BrochureVisibility,
  ContactConfig,
  Department,
  EventConfig,
  EventID,
  EventRound,
  HeroConfig,
  RegistrationSettings,
  SiteConfig,
  SocialLinksConfig,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getString = (value: unknown, fallback: string) =>
  typeof value === 'string' ? value : fallback;

const getBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const getNumberOrString = (value: unknown, fallback: number | string) =>
  typeof value === 'number' || typeof value === 'string' ? value : fallback;

const getStringArray = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) return fallback;
  const next = value.filter((item): item is string => typeof item === 'string');
  return next.length > 0 ? next : fallback;
};

const getDepartment = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback;

const createDefaultBrochureVisibility = (): BrochureVisibility => ({
  [EventID.VAC]: false,
  [EventID.CODEVERSE]: false,
  [EventID.AGENTS]: false,
  [EventID.ROBO]: false,
  [EventID.BRIDGE]: false,
  [EventID.VIBE]: false,
});

const DEFAULT_EVENT_ROUNDS: Record<EventID, EventRound[]> = {
  [EventID.VAC]: [
    { title: 'Conceptualization', desc: 'Submit your character design abstract and lore.' },
    { title: 'The Nexus Arena', desc: 'Live presentation of your 3D avatar.' },
  ],
  [EventID.CODEVERSE]: [
    { title: 'The Matrix', desc: 'Rapid fire algorithmic challenges.' },
    { title: 'Project Architect', desc: 'Full-stack module development.' },
  ],
  [EventID.AGENTS]: [
    { title: 'The Prompt Engineering', desc: 'Optimizing AI outputs for complex tasks.' },
    { title: 'Agent Deployment', desc: 'Solving real-world scenarios with autonomous agents.' },
  ],
  [EventID.ROBO]: [
    { title: 'Circuit Race', desc: 'Navigate the obstacle-filled track.' },
    { title: 'Death Match', desc: 'The last bot standing wins.' },
  ],
  [EventID.BRIDGE]: [
    { title: 'Construction Phase', desc: 'On-site bridge building (3 hours).' },
    { title: 'Load Test', desc: 'Point load application until structural failure.' },
  ],
  [EventID.VIBE]: [
    { title: 'Visual Symphony', desc: 'Build the most visually stunning UI.' },
    { title: 'Creative Logic', desc: 'Add interactivity that wows the judges.' },
  ],
};

export const DEFAULT_EVENTS: EventConfig[] = [
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
    isRegistrationOpen: true,
    rules: [
      'Character must be original',
      'Idea abstract must be submitted in text',
      'Real-time rendering required in Final Round',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.VAC],
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
    isRegistrationOpen: true,
    rules: [
      'Exact team size protocols active',
      'No internet access during rounds',
      'Languages: C++, Java, Python',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.CODEVERSE],
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
    isRegistrationOpen: true,
    rules: [
      'Use of any LLM allowed',
      'Must build a functional agentic workflow',
      'Focus on automation and problem solving',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.AGENTS],
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
    isRegistrationOpen: true,
    rules: [
      'Robot weight limit: 15kg',
      'Combat and Racing categories',
      'Remote control only (No wired)',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.ROBO],
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
    isRegistrationOpen: true,
    rules: [
      'Only popsicles and glue allowed',
      'Maximum span: 1.5 meters',
      'Aesthetics carry 30% weightage',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.BRIDGE],
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
    isRegistrationOpen: true,
    rules: [
      'Creative synergy required',
      'Creativity > Complexity',
      "Live 'Vibing' while coding is encouraged",
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.VIBE],
  },
];

const DEFAULT_HERO_CONFIG: HeroConfig = {
  institution: 'INDIRA COLLEGE OF ENGINEERING & MANAGEMENT',
  organizingLabel: 'Organizing',
  subLabel: "The Largest Gathering of Pune's Tech Innovators",
  mainTitlePart1: 'TECHNOFEST',
  mainTitlePart2: '2026',
  scrambleText: 'THE ULTIMATE TECH ARENA',
  buttonText: 'INITIATE CONNECTION',
  countdownDate: '2026-03-14T09:00:00',
};

const DEFAULT_SOCIAL_LINKS: SocialLinksConfig = {
  instagram: '#',
  twitter: '#',
  linkedin: '#',
};

const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  address: 'Parandwadi, Pune, MH 410506',
  email: 'icem@indiraicem.ac.in',
  phone: '+91 88559 77815',
  institutionSiteUrl: 'https://indiraicem.ac.in/',
  footerBlurb: 'Official technical wing of SCES. Focusing on Engineering & Management excellence.',
};

const DEFAULT_ANNOUNCEMENT_CONFIG: AnnouncementConfig = {
  enabled: false,
  label: 'Live Update',
  message: 'Registrations are now open for all TechnoFest 2026 events.',
  ctaText: 'View Events',
  ctaHref: '#events-section',
};

const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  isOpen: true,
  closedMessage: 'Registrations are currently paused. Please check back later or contact the organizing team.',
};

const DEFAULT_ABOUT_STATS: AboutStatConfig[] = [
  { label: 'Uplink Est.', value: '2007', sub: 'EST. YEAR' },
  { label: 'Competitions', value: '12+', sub: 'TECH EVENTS' },
  { label: 'Participation', value: '2.5K+', sub: 'ANNUAL REACH' },
  { label: 'Reward Pool', value: '\u20B91.5L+', sub: 'TOTAL PRIZES' },
];

const DEFAULT_ABOUT_CONFIG: AboutPageConfig = {
  eventBadge: 'Live Event Briefing',
  eventHeadline: 'THE FESTIVAL OF',
  eventHighlight: 'FUTURE TECHNOLOGY',
  eventQuote:
    'TechnoFest 2026 is the premier platform where technical proficiency meets innovative application. We convene the most ambitious engineering minds for a showcase of high-level competition.',
  technicalFrameworkText: 'Adhering to professional industry standards in hackathons and robotics.',
  industryLinkageText: 'Direct engagement between students and corporate technical leadership.',
  eventImageUrl: 'https://images.shiksha.com/mediadata/images/1552471453phpAHMSjf.jpeg',
  institutionBadge: 'Institutional Data',
  institutionTitle: 'INDIRA',
  institutionHighlight: 'CAMPUS_PROFILE',
  institutionDescription:
    'Founded in 2007 under the SCES, ICEM is a leading engineering institute in Pune. We merge theoretical foundations with practical industrial exposure to foster holistic development.',
  visionText: 'Global leaders in technology through comprehensive academic research.',
  missionText: 'Equipping students with professional skillsets for technical innovation.',
  campusImageUrl: 'https://images.shiksha.com/mediadata/images/1571490951phpBvvHa3.jpeg',
  campusLocationLabel: 'Parandwadi / Pune / MH',
  campusSiteUrl: 'https://indiraicem.ac.in/',
  stats: DEFAULT_ABOUT_STATS,
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: DEFAULT_HERO_CONFIG,
  events: DEFAULT_EVENTS,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  contact: DEFAULT_CONTACT_CONFIG,
  announcement: DEFAULT_ANNOUNCEMENT_CONFIG,
  registration: DEFAULT_REGISTRATION_SETTINGS,
  brochureVisibility: createDefaultBrochureVisibility(),
  about: DEFAULT_ABOUT_CONFIG,
};

const normalizeRounds = (value: unknown, fallback: EventRound[]) => {
  if (!Array.isArray(value)) return fallback;

  const next = value
    .filter(isRecord)
    .map((round, index) => ({
      title: getString(round.title, fallback[index]?.title || `Round ${index + 1}`),
      desc: getString(round.desc, fallback[index]?.desc || ''),
    }))
    .filter((round) => round.title || round.desc);

  return next.length > 0 ? next : fallback;
};

const normalizeStats = (value: unknown, fallback: AboutStatConfig[]) => {
  if (!Array.isArray(value)) return fallback;

  const next = value
    .filter(isRecord)
    .map((stat, index) => ({
      label: getString(stat.label, fallback[index]?.label || `Stat ${index + 1}`),
      value: getString(stat.value, fallback[index]?.value || ''),
      sub: getString(stat.sub, fallback[index]?.sub || ''),
    }))
    .filter((stat) => stat.label || stat.value || stat.sub);

  return next.length > 0 ? next : fallback;
};

const normalizeEvent = (value: unknown, fallback: EventConfig): EventConfig => {
  if (!isRecord(value)) return { ...fallback };

  return {
    ...fallback,
    name: getString(value.name, fallback.name),
    tagline: getString(value.tagline, fallback.tagline),
    description: getString(value.description, fallback.description),
    department: getDepartment(value.department, fallback.department),
    minTeam: typeof value.minTeam === 'number' ? value.minTeam : fallback.minTeam,
    maxTeam: typeof value.maxTeam === 'number' ? value.maxTeam : fallback.maxTeam,
    fee: getNumberOrString(value.fee, fallback.fee),
    requiresUpload: getBoolean(value.requiresUpload, fallback.requiresUpload),
    prizePool: getString(value.prizePool, fallback.prizePool),
    eventDateLabel: getString(value.eventDateLabel, fallback.eventDateLabel),
    eventTimeLabel: getString(value.eventTimeLabel, fallback.eventTimeLabel),
    venueLabel: getString(value.venueLabel, fallback.venueLabel),
    coordinatorName: getString(value.coordinatorName, fallback.coordinatorName),
    coordinatorEmail: getString(value.coordinatorEmail, fallback.coordinatorEmail),
    coordinatorPhone: getString(value.coordinatorPhone, fallback.coordinatorPhone),
    isRegistrationOpen: getBoolean(value.isRegistrationOpen, fallback.isRegistrationOpen),
    rules: getStringArray(value.rules, fallback.rules),
    rounds: normalizeRounds(value.rounds, fallback.rounds),
  };
};

const createFallbackEvent = (eventId: string, index: number): EventConfig => {
  const template = DEFAULT_SITE_CONFIG.events[index] ?? DEFAULT_SITE_CONFIG.events[0];
  return {
    ...template,
    id: eventId,
  };
};

const normalizeEvents = (value: unknown): EventConfig[] => {
  const fallbackEvents = DEFAULT_SITE_CONFIG.events;
  if (!Array.isArray(value)) {
    return fallbackEvents.map((fallbackEvent) => normalizeEvent(undefined, fallbackEvent));
  }

  const seenIds = new Set<string>();
  const normalized = value
    .map((event, index) => {
      if (!isRecord(event)) return null;

      const eventId = getString(event.id, '').trim();
      if (!eventId || seenIds.has(eventId)) return null;
      seenIds.add(eventId);

      const fallback =
        fallbackEvents.find((fallbackEvent) => fallbackEvent.id === eventId) ??
        createFallbackEvent(eventId, index);

      return normalizeEvent(event, fallback);
    })
    .filter((event): event is EventConfig => event !== null);

  return normalized.length > 0
    ? normalized
    : fallbackEvents.map((fallbackEvent) => normalizeEvent(undefined, fallbackEvent));
};

const normalizeHero = (value: unknown): HeroConfig => {
  const fallback = DEFAULT_SITE_CONFIG.hero;
  if (!isRecord(value)) return { ...fallback };

  const mainTitlePart1 = getString(value.mainTitlePart1, fallback.mainTitlePart1);
  const mainTitlePart2 = getString(value.mainTitlePart2, fallback.mainTitlePart2);

  return {
    institution: getString(value.institution, fallback.institution),
    organizingLabel: getString(value.organizingLabel, fallback.organizingLabel),
    subLabel: getString(value.subLabel, fallback.subLabel),
    mainTitlePart1:
      mainTitlePart1 === 'TECHNO' && mainTitlePart2 === 'FEST' ? fallback.mainTitlePart1 : mainTitlePart1,
    mainTitlePart2:
      mainTitlePart1 === 'TECHNO' && mainTitlePart2 === 'FEST' ? fallback.mainTitlePart2 : mainTitlePart2,
    scrambleText: getString(value.scrambleText, fallback.scrambleText),
    buttonText: getString(value.buttonText, fallback.buttonText),
    countdownDate: getString(value.countdownDate, fallback.countdownDate),
  };
};

const normalizeSocialLinks = (value: unknown): SocialLinksConfig => {
  const fallback = DEFAULT_SITE_CONFIG.socialLinks;
  if (!isRecord(value)) return { ...fallback };

  return {
    instagram: getString(value.instagram, fallback.instagram),
    twitter: getString(value.twitter, fallback.twitter),
    linkedin: getString(value.linkedin, fallback.linkedin),
  };
};

const normalizeContact = (value: unknown): ContactConfig => {
  const fallback = DEFAULT_SITE_CONFIG.contact;
  if (!isRecord(value)) return { ...fallback };

  return {
    address: getString(value.address, fallback.address),
    email: getString(value.email, fallback.email),
    phone: getString(value.phone, fallback.phone),
    institutionSiteUrl: getString(value.institutionSiteUrl, fallback.institutionSiteUrl),
    footerBlurb: getString(value.footerBlurb, fallback.footerBlurb),
  };
};

const normalizeAnnouncement = (value: unknown): AnnouncementConfig => {
  const fallback = DEFAULT_SITE_CONFIG.announcement;
  if (!isRecord(value)) return { ...fallback };

  return {
    enabled: getBoolean(value.enabled, fallback.enabled),
    label: getString(value.label, fallback.label),
    message: getString(value.message, fallback.message),
    ctaText: getString(value.ctaText, fallback.ctaText),
    ctaHref: getString(value.ctaHref, fallback.ctaHref),
  };
};

const normalizeRegistrationSettings = (value: unknown): RegistrationSettings => {
  const fallback = DEFAULT_SITE_CONFIG.registration;
  if (!isRecord(value)) return { ...fallback };

  return {
    isOpen: getBoolean(value.isOpen, fallback.isOpen),
    closedMessage: getString(value.closedMessage, fallback.closedMessage),
  };
};

const normalizeBrochureVisibility = (value: unknown): BrochureVisibility => {
  const fallback = createDefaultBrochureVisibility();
  if (!isRecord(value)) return fallback;

  const normalized: BrochureVisibility = { ...fallback };
  Object.keys(value).forEach((key) => {
    normalized[key] = getBoolean(value[key], normalized[key] ?? false);
  });

  return normalized;
};

const normalizeAbout = (value: unknown): AboutPageConfig => {
  const fallback = DEFAULT_SITE_CONFIG.about;
  if (!isRecord(value)) return cloneAboutConfig(fallback);

  return {
    eventBadge: getString(value.eventBadge, fallback.eventBadge),
    eventHeadline: getString(value.eventHeadline, fallback.eventHeadline),
    eventHighlight: getString(value.eventHighlight, fallback.eventHighlight),
    eventQuote: getString(value.eventQuote, fallback.eventQuote),
    technicalFrameworkText: getString(value.technicalFrameworkText, fallback.technicalFrameworkText),
    industryLinkageText: getString(value.industryLinkageText, fallback.industryLinkageText),
    eventImageUrl: getString(value.eventImageUrl, fallback.eventImageUrl),
    institutionBadge: getString(value.institutionBadge, fallback.institutionBadge),
    institutionTitle: getString(value.institutionTitle, fallback.institutionTitle),
    institutionHighlight: getString(value.institutionHighlight, fallback.institutionHighlight),
    institutionDescription: getString(value.institutionDescription, fallback.institutionDescription),
    visionText: getString(value.visionText, fallback.visionText),
    missionText: getString(value.missionText, fallback.missionText),
    campusImageUrl: getString(value.campusImageUrl, fallback.campusImageUrl),
    campusLocationLabel: getString(value.campusLocationLabel, fallback.campusLocationLabel),
    campusSiteUrl: getString(value.campusSiteUrl, fallback.campusSiteUrl),
    stats: normalizeStats(value.stats, fallback.stats),
  };
};

const cloneAboutConfig = (about: AboutPageConfig): AboutPageConfig => ({
  ...about,
  stats: about.stats.map((stat) => ({ ...stat })),
});

export const cloneSiteConfig = (config: SiteConfig): SiteConfig => ({
  hero: { ...config.hero },
  events: config.events.map((event) => ({
    ...event,
    rules: [...event.rules],
    rounds: event.rounds.map((round) => ({ ...round })),
  })),
  socialLinks: { ...config.socialLinks },
  contact: { ...config.contact },
  announcement: { ...config.announcement },
  registration: { ...config.registration },
  brochureVisibility: { ...config.brochureVisibility },
  about: cloneAboutConfig(config.about),
});

export const normalizeSiteConfig = (value: unknown): SiteConfig => {
  if (!isRecord(value)) {
    return cloneSiteConfig(DEFAULT_SITE_CONFIG);
  }

  return {
    hero: normalizeHero(value.hero),
    events: normalizeEvents(value.events),
    socialLinks: normalizeSocialLinks(value.socialLinks),
    contact: normalizeContact(value.contact),
    announcement: normalizeAnnouncement(value.announcement),
    registration: normalizeRegistrationSettings(value.registration),
    brochureVisibility: normalizeBrochureVisibility(value.brochureVisibility),
    about: normalizeAbout(value.about),
  };
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseJsonBlock = (markdown: string, blockName: string) => {
  const pattern = new RegExp(
    '^```json\\s+' + escapeRegex(blockName) + '\\s*$\\r?\\n([\\s\\S]*?)\\r?\\n^```',
    'm',
  );
  const match = markdown.match(pattern);

  if (!match) {
    return undefined;
  }

  try {
    return JSON.parse(sanitizeJsonBlock(match[1]));
  } catch (error) {
    throw new Error(
      `Invalid JSON in "${blockName}" block inside content/site-config.md. ` +
        `If you use multiline text, keep it inside quotes and the parser will convert line breaks automatically.`,
    );
  }
};

const sanitizeJsonBlock = (block: string) => {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < block.length; index += 1) {
    const character = block[index];

    if (inString && character === '\r') {
      if (block[index + 1] === '\n') {
        index += 1;
      }
      result += '\\n';
      isEscaped = false;
      continue;
    }

    if (inString && character === '\n') {
      result += '\\n';
      isEscaped = false;
      continue;
    }

    result += character;

    if (character === '"' && !isEscaped) {
      inString = !inString;
    }

    if (character === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }
  }

  return result;
};

export const buildSiteConfigFromMarkdown = (markdown: string): SiteConfig => {
  const partialConfig = {
    hero: parseJsonBlock(markdown, 'hero'),
    announcement: parseJsonBlock(markdown, 'announcement'),
    registration: parseJsonBlock(markdown, 'registration'),
    socialLinks: parseJsonBlock(markdown, 'socialLinks'),
    contact: parseJsonBlock(markdown, 'contact'),
    brochureVisibility: parseJsonBlock(markdown, 'brochureVisibility'),
    about: parseJsonBlock(markdown, 'about'),
    events: parseJsonBlock(markdown, 'events'),
  };

  return normalizeSiteConfig(partialConfig);
};

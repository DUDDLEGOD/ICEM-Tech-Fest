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
    SponsorConfig,
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
  [EventID.CHAKRAVYUH]: false,
  [EventID.NEUROAVATAR]: false,
  [EventID.DATA_DASH]: false,
  [EventID.CYBER_SHIELD]: false,
  [EventID.BRIDGE]: false,
  [EventID.FAST_FURIOUS]: false,
  [EventID.CIRCUIT_CRAFTERS]: false,
  [EventID.WEB_WIZARDS]: false,
  [EventID.LAUNCHPAD]: false,
});

const DEFAULT_EVENT_ROUNDS: Record<EventID, EventRound[]> = {
  [EventID.CHAKRAVYUH]: [
    { title: 'Round 1: The Drona Gate', desc: 'Physical + mental challenge including short physical activity and solving logical, programming, and debugging questions.' },
    { title: 'Round 2: The Archer Wall', desc: 'A technical treasure hunt challenge where teams solve technology-based puzzles hidden within programming, cybersecurity, and logical clues.' },
    { title: 'Final Round: The Core', desc: 'The Rapid Prototyping Challenge is the final stage of the competition where teams transform their ideas into a working technological solution.' },
  ],
  [EventID.NEUROAVATAR]: [
    { title: 'Project Showcase', desc: 'Demonstrate your MVP and refine it based on the theme.' },
  ],
  [EventID.DATA_DASH]: [
    { title: 'Data Challenge', desc: 'Analyze provided datasets and build comprehensive visualizations.' },
  ],
  [EventID.CYBER_SHIELD]: [
    { title: 'Security Challenge', desc: 'Solve ethical hacking tasks and bypass security challenges.' },
  ],
  [EventID.BRIDGE]: [
    { title: 'Construction Phase', desc: 'On-site bridge building for approximately 2 hours.' },
    { title: 'Load Test', desc: 'Incremental weights added to the geometric center until failure.' },
  ],
  [EventID.FAST_FURIOUS]: [
    { title: 'Qualification', desc: 'Initial heat to filter top performers.' },
    { title: 'Semi-Final', desc: 'Advanced assembly tasks for qualifiers.' },
    { title: 'Final', desc: 'Head-to-head race for the fastest correct assembly.' },
  ],
  [EventID.CIRCUIT_CRAFTERS]: [
    { title: 'Circuit Implementation', desc: 'Design, build, and test circuits based on provided challenges.' },
  ],
  [EventID.WEB_WIZARDS]: [
    { title: 'Web Development', desc: 'Develop and design a functional website based on the given theme.' },
  ],
  [EventID.LAUNCHPAD]: [
    { title: 'Business Model Pitch', desc: 'Present your innovative startup idea and financial viability.' },
  ],
};

export const DEFAULT_EVENTS: EventConfig[] = [
  {
    id: EventID.CHAKRAVYUH,
    name: 'Chakravyuh',
    tagline: 'Break through the challenge, innovate, and conquer the core!',
    description: 'Chakravyuh 2026 is a multistage technical challenge inspired by breaking through layers of complexity. Participants must demonstrate teamwork, logic, creativity, and innovation to advance through three rounds.',
    department: Department.FIRST_YEAR,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Trupti Kethale',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 7841994889',
    isRegistrationOpen: true,
    rules: [
      'Team size: 3-5 MEMBERS',
      'Registration: 250 per team',
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.CHAKRAVYUH],
  },
  {
    id: EventID.NEUROAVATAR,
    name: 'NeuroAvatar Arena',
    tagline: 'The 4-Hour Challenge',
    description: 'An exclusive, fast-paced project showcase and refinement competition. Focused on the theme of "Digital Avatar, Virtual Avatar, and Virtual Persona," this event requires teams to arrive with a ready-to-demonstrate MVP.',
    department: Department.COMPS,
    minTeam: 3,
    maxTeam: 5,
    fee: 300,
    requiresUpload: true,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Minal Patil',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9145616101',
    isRegistrationOpen: true,
    rules: [
      'Teams must arrive with a ready-to-demonstrate MVP',
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.NEUROAVATAR],
  },
  {
    id: EventID.DATA_DASH,
    name: 'Data Dash',
    tagline: 'Data analysis and visualization contest',
    description: 'A high-level competition focused on deep data analysis and effective visualization techniques.',
    department: Department.AIDS,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: true,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Organizing Team',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 88559 77815',
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.DATA_DASH],
  },
  {
    id: EventID.CYBER_SHIELD,
    name: 'Cyber Shield Challenge',
    tagline: 'The Ultimate Defensive Gauntlet',
    description: 'A competition focused on cybersecurity, ethical hacking, and digital defense strategies.',
    department: Department.IT,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: true,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Organizing Team',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 88559 77815',
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.CYBER_SHIELD],
  },
  {
    id: EventID.BRIDGE,
    name: 'The Gravity Game.... Bridge Making',
    tagline: 'Structural Elegance & Strength',
    description: 'A hands-on engineering competition designed to test structural design, load distribution, and material efficiency by constructing a model bridge.',
    department: Department.CIVIL,
    minTeam: 2,
    maxTeam: 5,
    fee: 500,
    requiresUpload: false,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: '09:30 AM - 03:30 PM',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Vijay Kumar Saini',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9819298069',
    isRegistrationOpen: true,
    rules: [
      'Provided Kit: 150 Ice Cream Sticks and Rubber Bands',
      'Participant-Supplied: Members must bring their own Hot Glue Gun',
      'No electronic devices allowed',
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.BRIDGE],
  },
  {
    id: EventID.FAST_FURIOUS,
    name: 'Fast & Furious',
    tagline: 'Mechanical Intuition & Memory',
    description: 'A high-octane individual competition where participants identify and assemble mechanical systems blindfolded using touch and memory.',
    department: Department.MECH,
    minTeam: 2,
    maxTeam: 2,
    fee: 0,
    requiresUpload: false,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Pranali Knatake',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 7083597073',
    isRegistrationOpen: true,
    rules: [
      'Blindfold Protocol: Removing blindfold results in instant disqualification.',
      'Hands-Only identification and assembly.',
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.FAST_FURIOUS],
  },
  {
    id: EventID.CIRCUIT_CRAFTERS,
    name: 'Circuit Crafters',
    tagline: 'Precision Hardware Design',
    description: 'Challenge your ability to design and implement complex electronic circuits effectively.',
    department: Department.ENTC,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Balu Tandale',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 8805048185',
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.CIRCUIT_CRAFTERS],
  },
  {
    id: EventID.WEB_WIZARDS,
    name: 'Web Wizards Challenge',
    tagline: 'Full-Stack Design & Development',
    description: 'Showcase your web development skills in this high-speed design and deployment competition.',
    department: Department.MCA_BCA,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: true,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Organizing Team',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 88559 77815',
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.WEB_WIZARDS],
  },
  {
    id: EventID.LAUNCHPAD,
    name: 'LaunchPad Business Plan Challenge',
    tagline: 'The Entrepreneurial Pitch',
    description: 'Present your innovative startup idea, develop a feasible business model, and showcase market potential.',
    department: Department.MBA,
    minTeam: 1,
    maxTeam: 5,
    fee: 500,
    requiresUpload: true,
    prizePool: '\u20B940,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'Indira Global School of Business',
    coordinatorName: 'Prof. Aditee Huparikar & Anirudha Thuse',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9823459833 / 9850901315',
    isRegistrationOpen: true,
    rules: [
      'Registration deadline: 23rd March 2026',
      'Prize Distribution: 1st - \u20B925K, 2nd - \u20B910K, 3rd - \u20B95K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.LAUNCHPAD],
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
  countdownDate: '2026-03-27T09:00:00',
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
  paymentUpiIds: ['ashishpdng@okicici'],
  payeeName: 'TechnoFest 2026',
};

const DEFAULT_SPONSORS: SponsorConfig[] = [
];

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
  sponsors: DEFAULT_SPONSORS,
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
    imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : fallback.imageUrl,
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

  return {
    institution: getString(value.institution, fallback.institution),
    organizingLabel: getString(value.organizingLabel, fallback.organizingLabel),
    subLabel: getString(value.subLabel, fallback.subLabel),
    mainTitlePart1: getString(value.mainTitlePart1, fallback.mainTitlePart1),
    mainTitlePart2: getString(value.mainTitlePart2, fallback.mainTitlePart2),
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
  if (!isRecord(value)) return { ...fallback, paymentUpiIds: [...(fallback.paymentUpiIds || [])] };

  let paymentUpiIds = fallback.paymentUpiIds;
  if (Array.isArray(value.paymentUpiIds)) {
    const ids = value.paymentUpiIds.map(v => String(v).trim()).filter(Boolean);
    if (ids.length > 0) paymentUpiIds = ids;
  }

  return {
    isOpen: getBoolean(value.isOpen, fallback.isOpen),
    closedMessage: getString(value.closedMessage, fallback.closedMessage),
    paymentUpiIds,
    payeeName: getString(value.payeeName, fallback.payeeName),
    bankAccountNo: typeof value.bankAccountNo === 'string' ? value.bankAccountNo : fallback.bankAccountNo,
    bankIfsc: typeof value.bankIfsc === 'string' ? value.bankIfsc : fallback.bankIfsc,
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

const normalizeSponsors = (value: unknown): SponsorConfig[] => {
  const fallback = DEFAULT_SPONSORS;
  if (!Array.isArray(value)) return fallback;

  const valid = value
    .filter(isRecord)
    .map((s) => ({
      name: getString(s.name, ''),
      logo: getString(s.logo, ''),
    }))
    .filter((s) => s.name && s.logo);

  return valid.length > 0 ? valid : fallback;
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
  registration: {
    ...config.registration,
    paymentUpiIds: config.registration.paymentUpiIds ? [...config.registration.paymentUpiIds] : undefined
  },
  sponsors: config.sponsors.map(s => ({ ...s })),
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
    sponsors: normalizeSponsors(value.sponsors),
    brochureVisibility: normalizeBrochureVisibility(value.brochureVisibility),
    about: normalizeAbout(value.about),
  };
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

const parseJsonBlock = (markdown: string, blockName: string) => {
  const pattern = new RegExp(
    '^```json[ \\t]+' + escapeRegex(blockName) + '[ \\t]*\\r?\\n([\\s\\S]*?)\\n```',
    'im'
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
        `If you use multiline text, keep it inside quotes and the parser will convert line breaks automatically.`
    );
  }
};

const sanitizeJsonBlock = (block: string) => {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < block.length; index += 1) {
    const character = block[index];

    if (inString && character === '\\r') {
      if (block[index + 1] === '\\n') {
        index += 1;
      }
      result += '\\\\n';
      isEscaped = false;
      continue;
    }

    if (inString && character === '\\n') {
      result += '\\\\n';
      isEscaped = false;
      continue;
    }

    result += character;

    if (character === '"' && !isEscaped) {
      inString = !inString;
    }

    if (character === '\\\\' && !isEscaped) {
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
    sponsors: parseJsonBlock(markdown, 'sponsors'),
    socialLinks: parseJsonBlock(markdown, 'socialLinks'),
    contact: parseJsonBlock(markdown, 'contact'),
    brochureVisibility: parseJsonBlock(markdown, 'brochureVisibility'),
    about: parseJsonBlock(markdown, 'about'),
    events: parseJsonBlock(markdown, 'events'),
  };

  return normalizeSiteConfig(partialConfig);
};

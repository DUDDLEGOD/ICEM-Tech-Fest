import {
    AboutPageConfig,
    AboutStatConfig,
    AnnouncementConfig,
    BrochureVisibility,
    ContactConfig,
    CoordinatorContact,
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

const createCoordinatorContact = (
  name: string,
  phone: string,
  email?: string,
): CoordinatorContact => ({
  name,
  phone,
  email,
});

const cloneCoordinatorContacts = (contacts?: CoordinatorContact[]) =>
  contacts?.map((contact) => ({ ...contact }));

const getDepartment = (value: unknown, fallback: string) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  const normalizedValue = value.trim();
  return normalizedValue === 'First-Year' ? Department.FIRST_YEAR : normalizedValue;
};

const createDefaultBrochureVisibility = (): BrochureVisibility => ({
  [EventID.CHAKRAVYUH]: false,
  [EventID.NEUROAVATAR]: false,
  [EventID.ORCHESTRON]: false,
  [EventID.CODEVERSE]: false,
  [EventID.BRIDGE]: false,
  [EventID.BLIND_ASSEMBLY]: false,
  [EventID.ROBONEX]: false,
  [EventID.VIBEASTRA]: false,
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
  [EventID.ORCHESTRON]: [
    { title: 'Round 1', desc: 'Project presentation with PPT or demo.' },
    { title: 'Round 2', desc: 'Q&A and scenario-based evaluation.' },
  ],
  [EventID.CODEVERSE]: [
    { title: 'Round 1', desc: 'Predict the output.' },
    { title: 'Round 2', desc: 'Solve DSA problems.' },
    { title: 'Round 3', desc: 'Debug and fix program issues.' },
  ],
  [EventID.BRIDGE]: [
    {
      title: 'Round 1: Bridge Construction',
      desc: 'Build the bridge on site within the allotted time while staying within the span, width, height, and support constraints.',
    },
    {
      title: 'Round 2: Stability and Roadway Check',
      desc: 'The bridge is checked for alignment, symmetry, free-standing stability, and roadway readiness for the RC testing car/static load.',
    },
    {
      title: 'Round 3: Central Load Test',
      desc: 'Weights are applied incrementally at the exact geometric center until failure, with scoring based on load carrying capacity and structural efficiency.',
    },
  ],
  [EventID.BLIND_ASSEMBLY]: [
    { title: 'Blind Assembly', desc: 'Identify and assemble components blindfolded using touch and mechanical intuition.' },
  ],
  [EventID.ROBONEX]: [
    { title: 'Robo Race', desc: 'Race a manually controlled robot through turns, ramps, and hurdles in the shortest possible time.' },
  ],
  [EventID.VIBEASTRA]: [
    { title: 'Creative Coding', desc: 'Solve logic-driven coding challenges in a gamified format focused on creativity and problem solving.' },
  ],
  [EventID.LAUNCHPAD]: [
    { title: 'Business Model Pitch', desc: 'Present your startup idea, business model, and market viability.' },
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
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Trupti Kethale',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 7841994889',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Trupti Kethale', '+91 7841994889', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Sampada Katageri', '+91 8668955724'),
      createCoordinatorContact('Sujal Dhumal', '+91 9028820220'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Team size: 3-5 MEMBERS',
      'Registration: 250 per team',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
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
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Minal Patil',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9145616101',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Minal Patil', '+91 9145616101', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Advait Kende', '+91 9552637352'),
      createCoordinatorContact('Suraj Prajapati', '+91 8767291440'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Teams must arrive with a ready-to-demonstrate MVP',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.NEUROAVATAR],
  },
  {
    id: EventID.ORCHESTRON,
    name: 'Orchestron - Agentic AI',
    tagline: 'Agentic AI Innovation Challenge',
    description: 'Showcase AI systems capable of planning, reasoning, and solving real-world problems.',
    department: Department.AIDS,
    minTeam: 3,
    maxTeam: 5,
    fee: 250,
    requiresUpload: true,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: '10am',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Pallavi Chavan',
    coordinatorEmail: 'pallavichavan@indiraicem.ac.in',
    coordinatorPhone: '+91 9175151731',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Pallavi Chavan', '+91 9175151731', 'pallavichavan@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Soham Kate', '+91 7385504133'),
      createCoordinatorContact('Vedant Padmawar', '+91 9561258843'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.ORCHESTRON],
  },
  {
    id: EventID.CODEVERSE,
    name: 'CodeVerse',
    tagline: 'Programming Battle Arena',
    description: 'Multi-round coding event including output prediction, DSA problems, and debugging.',
    department: Department.IT,
    minTeam: 3,
    maxTeam: 3,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Ashwini Wankhade',
    coordinatorEmail: 'ashwini.wankhade@indiraicem.ac.in',
    coordinatorPhone: '+91 7066230348',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Ashwini Wankhade', '+91 7066230348', 'ashwini.wankhade@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Dharmesh Bhatt', '+91 7249452498'),
      createCoordinatorContact('Shubham Shinde', '+91 9689650744'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Team size fixed at 3',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.CODEVERSE],
  },
  {
    id: EventID.BRIDGE,
    name: 'The Gravity Game.... Bridge Making',
    tagline: 'Structural Design Challenge',
    description: 'Build a bridge using limited materials and test load capacity.',
    department: Department.CIVIL,
    minTeam: 2,
    maxTeam: 5,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: '09:30 AM - 03:30 PM',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Vijay Kumar Saini',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9819298069',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Vijay Kumar Saini', '+91 9819298069', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Yash Mhatre', '+91 9322044906'),
      createCoordinatorContact('Neel Bodade', '+91 9975836063'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Provided Kit: 150 Ice Cream Sticks and Rubber Bands',
      'Participant-Supplied: Members must bring their own Hot Glue Gun',
      'No electronic devices or unauthorized materials allowed',
      'Bridge must satisfy span, width, height, and mid-span load requirements',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
      'Trophy for winner and runner-up; certificates for all participants',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.BRIDGE],
  },
  {
    id: EventID.BLIND_ASSEMBLY,
    name: 'Blind Assembly',
    tagline: 'Mechanical Intuition Test',
    description: 'Identify and assemble components blindfolded using touch.',
    department: Department.MECH,
    minTeam: 2,
    maxTeam: 2,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Pranali Khatake',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 7083597073',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Pranali Khatake', '+91 7083597073', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Ritesh Supekar', '+91 9730920512'),
      createCoordinatorContact('Keval Salunke', '+91 9313449805'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Blindfold Protocol: Removing the blindfold results in disqualification',
      'Use touch and memory to identify and assemble components',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.BLIND_ASSEMBLY],
  },
  {
    id: EventID.ROBONEX,
    name: 'RoboNex',
    tagline: 'Robotics Combat & Race',
    description: 'Robo Race is a fast-paced robotics competition in Robonex where teams design manually controlled robots to race through a challenging track. The robots must navigate obstacles such as turns, ramps, and hurdles while completing the track in the shortest possible time, testing participants\' skills in robot design, control, and speed.',
    department: Department.ENTC,
    minTeam: 2,
    maxTeam: 4,
    fee: '200/250',
    requiresUpload: false,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Prof. Balu Tandale',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 8805048185',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Balu Tandale', '+91 8805048185', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Soham Kulkarni', '+91 8623990668'),
      createCoordinatorContact('Atharv Kulkarni', '+91 7219536282'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Fee: \u20B9200 without robot / \u20B9250 with your own robot',
      'Manually controlled robots only',
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.ROBONEX],
  },
  {
    id: EventID.VIBEASTRA,
    name: 'VibeAstra',
    tagline: 'Creative Coding Experience',
    description: 'Gamified coding event focused on logic and creativity.',
    department: Department.MCA_BCA,
    minTeam: 1,
    maxTeam: 1,
    fee: 250,
    requiresUpload: false,
    prizePool: '\u20B925,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'ICEM Campus',
    coordinatorName: 'Dr. Dhanashree Patil',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 7972308184',
    facultyCoordinators: [
      createCoordinatorContact('Dr. Dhanashree Patil', '+91 7972308184', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Aditya Agarwal', '+91 7076525693'),
      createCoordinatorContact('Stanley James', '+91 8408077248'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.VIBEASTRA],
  },
  {
    id: EventID.LAUNCHPAD,
    name: 'LaunchPad Business Plan Challenge',
    tagline: 'Startup Pitch Arena',
    description: 'Present startup ideas and business models.',
    department: Department.MBA,
    minTeam: 1,
    maxTeam: 5,
    fee: 500,
    requiresUpload: true,
    prizePool: '\u20B915,000',
    eventDateLabel: 'March 27, 2026',
    eventTimeLabel: 'To Be Announced',
    venueLabel: 'Indira Global School of Business',
    coordinatorName: 'Prof. Aditee Huparikar & Dr. Aniruddha Thuse',
    coordinatorEmail: 'icem@indiraicem.ac.in',
    coordinatorPhone: '+91 9823459833 / 9850901315',
    facultyCoordinators: [
      createCoordinatorContact('Prof. Aditee Huparikar', '+91 9823459833', 'icem@indiraicem.ac.in'),
      createCoordinatorContact('Dr. Aniruddha Thuse', '+91 9850901315', 'icem@indiraicem.ac.in'),
    ],
    studentCoordinators: [
      createCoordinatorContact('Rajveer Gil', '+91 7587227100'),
      createCoordinatorContact('Radhika Nannaware', '+91 8956717423'),
      createCoordinatorContact('Atharv Salunke / Rajveer Preet Gill', '+91 7888106167'),
    ],
    isRegistrationOpen: true,
    rules: [
      'Prize Distribution: 1st - \u20B97K, 2nd - \u20B95K, 3rd - \u20B93K',
    ],
    rounds: DEFAULT_EVENT_ROUNDS[EventID.LAUNCHPAD],
  },
];

const DEFAULT_HERO_CONFIG: HeroConfig = {
  institution: 'INDIRA COLLEGE OF ENGINEERING & MANAGEMENT, INDIRA GLOBAL SCHOOL OF BUSINESS',
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
  payeeName: 'TechnoFest 2026',
  bankAccountNo: '201025452641',
  bankIfsc: 'INDB0000999',
  departmentPayments: {
    [Department.FIRST_YEAR]: {
      upiId: 'truptikathale@ybl',
      payeeName: 'ICEM First Year Dept',
      bankAccountNo: '4040010100057655',
      bankIfsc: 'UTIB0000404',
    },
    [Department.COMPS]: {
      upiId: '9145616101@ibl',
      payeeName: 'ICEM Computer Dept',
      bankAccountNo: '50100351881924',
      bankIfsc: 'HDFC0004884',
    },
    [Department.AIDS]: {
      upiId: 'pallavichavan1707@oksbi',
      payeeName: 'ICEM AIDS Dept',
      bankAccountNo: '922010060640068',
      bankIfsc: 'UTIB0000110',
    },
    [Department.IT]: {
      upiId: 'wankhade81@okhdfcbank',
      payeeName: 'ICEM IT Dept',
      bankAccountNo: '50100391133848',
      bankIfsc: 'HDFC0002524',
    },
    [Department.CIVIL]: {
      upiId: '9819298069@yescred',
      payeeName: 'ICEM Civil Dept',
      bankAccountNo: '30724368718',
      bankIfsc: 'SBIN0000569',
    },
    [Department.MECH]: {
      upiId: 'pranali.khatake@okicici',
      payeeName: 'ICEM Mech Dept',
      bankAccountNo: '169701500487',
      bankIfsc: 'ICOC0001697',
    },
    [Department.ENTC]: {
      upiId: 'psmrpatil-4@okhdfcbank',
      payeeName: 'ICEM ENTC Dept',
      bankAccountNo: '50100754250032',
      bankIfsc: 'HDFC0007247',
    },
    [Department.MCA_BCA]: {
      upiId: 'dhanashree.patil89-1@oksbi',
      payeeName: 'ICEM MCA/BCA Dept',
      bankAccountNo: '201025452648',
      bankIfsc: 'INDB0000999',
    },
    [Department.MBA]: {
      upiId: 'ashishpdng@okicici',
      payeeName: 'IGSB MBA Dept',
      bankAccountNo: '201025452649',
      bankIfsc: 'INDB0000999',
    },
  },
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

const normalizeCoordinatorContacts = (
  value: unknown,
  fallback?: CoordinatorContact[],
) => {
  const fallbackContacts = cloneCoordinatorContacts(fallback) || [];
  if (!Array.isArray(value)) return fallbackContacts;

  const next = value
    .filter(isRecord)
    .map((contact, index) => ({
      name: getString(contact.name, fallbackContacts[index]?.name || ''),
      phone: getString(contact.phone, fallbackContacts[index]?.phone || ''),
      email: typeof contact.email === 'string'
        ? contact.email
        : fallbackContacts[index]?.email,
    }))
    .filter((contact) => contact.name || contact.phone || contact.email);

  return next.length > 0 ? next : fallbackContacts;
};

const cloneEventConfig = (event: EventConfig): EventConfig => ({
  ...event,
  rules: [...event.rules],
  rounds: event.rounds.map((round) => ({ ...round })),
  facultyCoordinators: cloneCoordinatorContacts(event.facultyCoordinators),
  studentCoordinators: cloneCoordinatorContacts(event.studentCoordinators),
});

const normalizeEvent = (value: unknown, fallback: EventConfig): EventConfig => {
  if (!isRecord(value)) return cloneEventConfig(fallback);

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
    facultyCoordinators: normalizeCoordinatorContacts(value.facultyCoordinators, fallback.facultyCoordinators),
    studentCoordinators: normalizeCoordinatorContacts(value.studentCoordinators, fallback.studentCoordinators),
    isRegistrationOpen: getBoolean(value.isRegistrationOpen, fallback.isRegistrationOpen),
    rules: getStringArray(value.rules, fallback.rules),
    rounds: normalizeRounds(value.rounds, fallback.rounds),
    imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : fallback.imageUrl,
  };
};

const createFallbackEvent = (eventId: string, index: number): EventConfig => {
  const template = DEFAULT_SITE_CONFIG.events[index] ?? DEFAULT_SITE_CONFIG.events[0];
  return {
    ...cloneEventConfig(template),
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
    paymentUpiIds = ids.length > 0 ? ids : undefined;
  }

  let departmentPayments: Record<string, import('./types').DepartmentPaymentInfo> | undefined;
  if (isRecord(value.departmentPayments)) {
    const entries = Object.entries(value.departmentPayments)
      .filter(([, v]) => isRecord(v))
      .map(([key, v]) => {
        const rec = v as Record<string, unknown>;
        return [key, {
          upiId: typeof rec.upiId === 'string' ? rec.upiId : undefined,
          payeeName: typeof rec.payeeName === 'string' ? rec.payeeName : undefined,
          bankAccountNo: typeof rec.bankAccountNo === 'string' ? rec.bankAccountNo : undefined,
          bankIfsc: typeof rec.bankIfsc === 'string' ? rec.bankIfsc : undefined,
        }] as const;
      });
    if (entries.length > 0) {
      departmentPayments = Object.fromEntries(entries);
    }
  }

  return {
    isOpen: getBoolean(value.isOpen, fallback.isOpen),
    closedMessage: getString(value.closedMessage, fallback.closedMessage),
    paymentUpiIds,
    payeeName: getString(value.payeeName, fallback.payeeName),
    bankAccountNo: typeof value.bankAccountNo === 'string' ? value.bankAccountNo : fallback.bankAccountNo,
    bankIfsc: typeof value.bankIfsc === 'string' ? value.bankIfsc : fallback.bankIfsc,
    departmentPayments,
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
  events: config.events.map(cloneEventConfig),
  socialLinks: { ...config.socialLinks },
  contact: { ...config.contact },
  announcement: { ...config.announcement },
  registration: {
    ...config.registration,
    paymentUpiIds: config.registration.paymentUpiIds ? [...config.registration.paymentUpiIds] : undefined,
    departmentPayments: config.registration.departmentPayments
      ? Object.fromEntries(
          Object.entries(config.registration.departmentPayments).map(([k, v]) => [k, { ...v }])
        )
      : undefined,
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
        `If you use multiline text, keep it inside quotes. The parser also accepts // comments and slash fee values like 200/250.`
    );
  }
};

// Allow lightweight authoring comments without breaking URLs inside strings.
const stripJsonLineComments = (block: string) => {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < block.length; index += 1) {
    const character = block[index];
    const nextCharacter = block[index + 1];

    if (!inString && character === '/' && nextCharacter === '/') {
      while (index < block.length && block[index] !== '\n' && block[index] !== '\r') {
        index += 1;
      }
      index -= 1;
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

// Support bare config values like "fee": 200/250 by converting them into strings before JSON parsing.
const quoteSlashDelimitedValues = (block: string) =>
  block.replace(/(:\s*)(\d+\s*\/\s*\d+)(\s*[,}\]])/g, '$1"$2"$3');

const sanitizeJsonBlock = (block: string) => {
  const preprocessedBlock = quoteSlashDelimitedValues(stripJsonLineComments(block));
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < preprocessedBlock.length; index += 1) {
    const character = preprocessedBlock[index];

    if (inString && character === '\\r') {
      if (preprocessedBlock[index + 1] === '\\n') {
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

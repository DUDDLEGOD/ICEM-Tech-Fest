
export enum Department {
  FIRST_YEAR = 'First-Year Dept.',
  COMPS = 'Computer Dept.',
  AIDS = 'AIDS Dept.',
  IT = 'IT Dept.',
  CIVIL = 'Civil Dept.',
  MECH = 'Mech Dept.',
  ENTC = 'ENTC Dept.',
  MCA_BCA = 'MCA/BCA Dept.',
  MBA = 'MBA Dept. (IGSB+ICEM)'
}

export enum EventID {
  CHAKRAVYUH = 'CHAKRAVYUH',
  NEUROAVATAR = 'NEUROAVATAR',
  DATA_DASH = 'DATA_DASH',
  CYBER_SHIELD = 'CYBER_SHIELD',
  BRIDGE = 'BRIDGE',
  FAST_FURIOUS = 'FAST_FURIOUS',
  CIRCUIT_CRAFTERS = 'CIRCUIT_CRAFTERS',
  WEB_WIZARDS = 'WEB_WIZARDS',
  LAUNCHPAD = 'LAUNCHPAD'
}

export type AppView = 'home' | 'register' | 'about';

export interface EventRound {
  title: string;
  desc: string;
}

export interface EventConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  department: string;
  minTeam: number;
  maxTeam: number;
  fee: number | string;
  requiresUpload: boolean;
  prizePool: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueLabel: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  isRegistrationOpen: boolean;
  rules: string[];
  rounds: EventRound[];
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  college: string;
  phone: string;
}

export interface Registration {
  id: string;
  teamName: string;
  eventId: string;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderCollege: string;
  members: { name: string; email: string; college: string }[];
  abstractText?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  qrHash: string;
  timestamp: number;
  feePaid?: number;
  hasPaid?: boolean;
  hasRobot?: boolean;
  paymentScreenshotUrl?: string;
  verifiedAt?: number;
}

export interface RegistrationApiResult {
  status: 'confirmed' | 'duplicate' | 'queued' | 'failed';
  registrationId?: string;
  message?: string;
}

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

export interface SocialLinksConfig {
  instagram: string;
  twitter: string;
  linkedin: string;
}

export interface ContactConfig {
  address: string;
  email: string;
  phone: string;
  institutionSiteUrl: string;
  footerBlurb: string;
}

export interface AnnouncementConfig {
  enabled: boolean;
  label: string;
  message: string;
  ctaText: string;
  ctaHref: string;
}

export interface DepartmentPaymentInfo {
  upiId?: string;
  payeeName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
}

export interface RegistrationSettings {
  isOpen: boolean;
  closedMessage: string;
  paymentUpiIds?: string[];
  payeeName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  departmentPayments?: Record<string, DepartmentPaymentInfo>;
}

export interface SponsorConfig {
  name: string;
  logo: string;
}

export interface AboutStatConfig {
  label: string;
  value: string;
  sub: string;
}

export interface AboutPageConfig {
  eventBadge: string;
  eventHeadline: string;
  eventHighlight: string;
  eventQuote: string;
  technicalFrameworkText: string;
  industryLinkageText: string;
  eventImageUrl: string;
  institutionBadge: string;
  institutionTitle: string;
  institutionHighlight: string;
  institutionDescription: string;
  visionText: string;
  missionText: string;
  campusImageUrl: string;
  campusLocationLabel: string;
  campusSiteUrl: string;
  stats: AboutStatConfig[];
}

export type BrochureVisibility = Record<string, boolean>;

export interface SiteConfig {
  hero: HeroConfig;
  events: EventConfig[];
  socialLinks: SocialLinksConfig;
  contact: ContactConfig;
  announcement: AnnouncementConfig;
  registration: RegistrationSettings;
  sponsors: SponsorConfig[];
  brochureVisibility: BrochureVisibility;
  about: AboutPageConfig;
}

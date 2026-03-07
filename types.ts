
export enum Department {
  COMPS = 'Computer Engineering',
  IT = 'Information Technology',
  AIDS = 'AI & Data Science',
  MECH = 'Mechanical / E&TC',
  CIVIL = 'Civil Engineering',
  BCA = 'BCA / BCS'
}

export enum EventID {
  VAC = 'VAC',
  CODEVERSE = 'CODEVERSE',
  AGENTS = 'AGENTS',
  ROBO = 'ROBO',
  BRIDGE = 'BRIDGE',
  VIBE = 'VIBE'
}

export type AppView = 'home' | 'register' | 'about';

export interface EventRound {
  title: string;
  desc: string;
}

export interface EventConfig {
  id: EventID;
  name: string;
  tagline: string;
  description: string;
  department: Department;
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
  eventId: EventID;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderCollege: string;
  members: { name: string; email: string; college: string }[];
  abstractText?: string;
  status: 'Pending' | 'Confirmed';
  qrHash: string;
  timestamp: number;
  feePaid: number;
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

export interface RegistrationSettings {
  isOpen: boolean;
  closedMessage: string;
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

export type BrochureVisibility = Record<EventID, boolean>;

export interface SiteConfig {
  hero: HeroConfig;
  events: EventConfig[];
  socialLinks: SocialLinksConfig;
  contact: ContactConfig;
  announcement: AnnouncementConfig;
  registration: RegistrationSettings;
  brochureVisibility: BrochureVisibility;
  about: AboutPageConfig;
}

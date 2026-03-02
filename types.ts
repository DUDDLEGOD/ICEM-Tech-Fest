
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
  rules: string[];
  rounds: { title: string; desc: string }[];
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
  members: { name: string; email: string }[];
  abstractText?: string;
  status: 'Pending' | 'Confirmed';
  qrHash: string;
  timestamp: number;
  feePaid: number;
}

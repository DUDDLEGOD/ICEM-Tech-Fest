
import React, { useState } from 'react';
import { EventID, Registration, RegistrationApiResult } from '../types';
import { EVENTS } from '../constants';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  PlusCircle, 
  Database, 
  User as UserIcon, 
  Lightbulb, 
  Users as UsersIcon, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRegistration } from '../services/registrationApi';

interface RegistrationFormProps {
  onSuccess: (reg: Registration, toastMessage?: string) => void;
  initialEventId: string | null;
}

type Step = 'leader' | 'team' | 'abstract' | 'members' | 'confirm';
type LeaderField = 'name' | 'email' | 'phone' | 'college';

interface LeaderInfo {
  name: string;
  email: string;
  phone: string;
  college: string;
}

const isEventId = (value: string | null): value is EventID => {
  return value !== null && Object.values(EventID).includes(value as EventID);
};

const createToken = (size: number) => Math.random().toString(36).slice(2, 2 + size).toUpperCase();
const DEFAULT_CONFIRMED_TOAST = 'Cloud sync complete. Check your email for further instructions.';
const DEFAULT_QUEUED_TOAST = 'Registration submitted successfully. Confirmation email may take a few minutes.';

const resolveFailureMessage = (result: RegistrationApiResult) =>
  result.message ?? 'Submission failed. Please verify your network and try again.';

const resolveDuplicateMessage = (result: RegistrationApiResult) => {
  if (result.message) return result.message;
  if (result.registrationId) {
    return `A registration already exists for this event (Ref: ${result.registrationId}).`;
  }
  return 'A registration already exists for this event with the same leader email.';
};

const leaderInputs: Array<{ label: string; key: LeaderField; type: string; placeholder: string }> = [
  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Major John Doe' },
  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@indiraicem.ac.in' },
  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 00000 00000' },
  { label: 'Institution', key: 'college', type: 'text', placeholder: 'ICEM Pune' }
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, initialEventId }) => {
  const [selectedEventId, setSelectedEventId] = useState<EventID>(isEventId(initialEventId) ? initialEventId : EventID.VAC);
  const [teamName, setTeamName] = useState('');
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo>({
    name: '',
    email: '',
    phone: '',
    college: 'Indira College of Engineering and Management'
  });
  const [members, setMembers] = useState<{ name: string; email: string }[]>([]);
  const [abstractText, setAbstractText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('leader');
  const [error, setError] = useState('');

  const currentEvent = EVENTS.find((event) => event.id === selectedEventId) ?? EVENTS[0];

  const addMember = () => {
    if (members.length + 1 < currentEvent.maxTeam) {
      setMembers([...members, { name: '', email: '' }]);
    } else {
      setError(`Maximum team size for ${currentEvent.name} is ${currentEvent.maxTeam} (including leader).`);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    setError('');
  };

  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    setMembers((previousMembers) =>
      previousMembers.map((member, memberIndex) => {
        if (memberIndex !== index) return member;
        return { ...member, [field]: value };
      })
    );
  };

  const validateLeader = () => {
    if (!leaderInfo.name || !leaderInfo.email || !leaderInfo.phone) return setError('All leader fields are required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderInfo.email)) return setError('Invalid email address');
    setError('');
    setStep('team');
  };

  const validateTeam = () => {
    if (!teamName) return setError('Team name is required');
    setError('');
    setStep('abstract');
  };

  const validateAbstract = () => {
    if (abstractText.length < 50) return setError('Abstract must be at least 50 characters to satisfy technical review.');
    setError('');
    setStep('members');
  };

  const validateMembers = () => {
    const totalMembers = members.length + 1;
    if (totalMembers < currentEvent.minTeam) {
      return setError(`This event requires at least ${currentEvent.minTeam} members. Add ${currentEvent.minTeam - totalMembers} more.`);
    }
    for (const m of members) {
      if (!m.name || !m.email) return setError('All member names and emails must be provided.');
    }
    setError('');
    setStep('confirm');
  };

  const handleFinalSubmission = async () => {
    setIsSubmitting(true);
    setError('');
    
    const registration: Registration = {
      id: createToken(9),
      teamName,
      eventId: selectedEventId,
      leaderId: `LEAD_${createToken(5)}`,
      leaderName: leaderInfo.name,
      leaderEmail: leaderInfo.email,
      leaderPhone: leaderInfo.phone,
      members,
      abstractText,
      status: 'Confirmed',
      qrHash: btoa(JSON.stringify({ team: teamName, event: selectedEventId, leader: leaderInfo.name })),
      timestamp: Date.now(),
      feePaid: 0
    };

    try {
      const result = await submitRegistration({
        registration,
        eventName: currentEvent.name,
        eventDateLabel: currentEvent.eventDateLabel,
        eventTimeLabel: currentEvent.eventTimeLabel,
        venueLabel: currentEvent.venueLabel
      });

      if (result.status === 'duplicate') {
        setError(resolveDuplicateMessage(result));
        setIsSubmitting(false);
        return;
      }

      if (result.status === 'failed') {
        setError(resolveFailureMessage(result));
        setIsSubmitting(false);
        return;
      }

      const finalizedRegistration: Registration = {
        ...registration,
        id: result.registrationId ?? registration.id,
        status: result.status === 'queued' ? 'Pending' : 'Confirmed'
      };

      setIsSubmitting(false);
      onSuccess(
        finalizedRegistration,
        result.message ?? (result.status === 'queued' ? DEFAULT_QUEUED_TOAST : DEFAULT_CONFIRMED_TOAST)
      );
    } catch (err) {
      console.error("Submission error:", err);
      setError('Unexpected submission error. Please retry in a moment.');
      setIsSubmitting(false);
    }
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'leader', label: 'Identity' },
    { id: 'team', label: 'Arena' },
    { id: 'abstract', label: 'Intel' },
    { id: 'members', label: 'Squad' },
    { id: 'confirm', label: 'Review' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-futuristic font-black uppercase tracking-tighter text-amber-500 italic">Registration</h2>
          <p className="text-slate-500 mt-2 font-bold text-[10px] uppercase tracking-widest">Secure Entry Point // Official TechnoFest '26 Registry</p>
        </div>
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div 
              key={i} 
              title={s.label}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                (step === s.id) ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-125' : 
                steps.findIndex(x => x.id === step) > i ? 'bg-teal-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="glass p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Database size={150} />
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 flex items-center gap-3"
            >
              <AlertTriangle size={20} className="shrink-0" /> 
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'leader' && (
            <motion.div 
              key="leader"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Leader Identity</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commanding Officer of the Squad</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {leaderInputs.map((input) => (
                  <div key={input.key} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">{input.label}</label>
                    <input 
                      type={input.type}
                      placeholder={input.placeholder}
                      value={leaderInfo[input.key]}
                      onChange={(e) => setLeaderInfo({ ...leaderInfo, [input.key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-white text-sm"
                    />
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={validateLeader}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-white/5 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4"
              >
                ESTABLISH UPLINK <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 'team' && (
            <motion.div 
              key="team"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Arena Selection</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry is currently 100% Free of Cost</p>
                </div>
              </div>
              <div className="grid gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Target Battleground</label>
                  <select 
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value as EventID);
                      setError('');
                    }}
                    className="w-full bg-stone-950 border border-white/10 p-5 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold appearance-none cursor-pointer text-white"
                  >
                    {EVENTS.map(ev => <option key={ev.id} value={ev.id} className="bg-stone-900">{ev.name} ({ev.department})</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Squad Designation (Team Name)</label>
                  <input 
                    type="text"
                    placeholder="e.g. ALPHA_OMEGA"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-white uppercase tracking-widest"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('leader')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> BACK
                </button>
                <button 
                  onClick={validateTeam}
                  className="flex-[2] py-5 bg-amber-500 text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  CONFIRM SECTOR <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'abstract' && (
            <motion.div 
              key="abstract"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-500/20">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Project Intel</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical abstract for mission briefing</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Technical Abstract / Idea</label>
                  <span className={`text-[9px] font-black ${abstractText.length < 50 ? 'text-red-500' : 'text-teal-500'}`}>
                    {abstractText.length} / 50 MIN
                  </span>
                </div>
                <textarea 
                  rows={8}
                  placeholder="Provide a detailed overview of your project, implementation stack, and core objectives..."
                  value={abstractText}
                  onChange={(e) => setAbstractText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-amber-500 transition-all font-medium text-white text-sm leading-relaxed resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('team')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> BACK
                </button>
                <button 
                  onClick={validateAbstract}
                  className="flex-[2] py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  DECODE PROJECT <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'members' && (
            <motion.div 
              key="members"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <UsersIcon size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Squad Manifest</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {currentEvent.name} REQUIRES {currentEvent.minTeam}-{currentEvent.maxTeam} MEMBERS
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Team Leader (Auto)</span>
                    <span className="text-sm font-bold text-white">{leaderInfo.name || 'Anonymous Leader'}</span>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[9px] font-black uppercase tracking-tighter">
                    Confirmed
                  </div>
                </div>

                {members.map((member, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl"
                  >
                    <button 
                      onClick={() => removeMember(idx)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-stone-900 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-20"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-slate-600">Member {idx + 2} Name</label>
                      <input 
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        placeholder="Name"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-slate-600">Member {idx + 2} Email</label>
                      <input 
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </motion.div>
                ))}

                {members.length + 1 < currentEvent.maxTeam && (
                  <button 
                    onClick={addMember}
                    className="w-full py-4 border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-amber-500 transition-all group"
                  >
                    <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Squad Member</span>
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('abstract')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> BACK
                </button>
                <button 
                  onClick={validateMembers}
                  className="flex-[2] py-5 bg-purple-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  ASSEMBLE TEAM <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                  <Send size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Final Review</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verify mission data before launch</p>
                </div>
              </div>

              <div className="glass p-6 md:p-8 rounded-3xl border-white/10 space-y-6">
                <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Arena</span>
                    <p className="font-futuristic font-black text-amber-500 text-lg leading-tight">{currentEvent.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Squad Name</span>
                    <p className="font-futuristic font-black text-white text-lg leading-tight">{teamName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Squad Leader</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{leaderInfo.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{leaderInfo.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Personnel Count</span>
                    <p className="font-bold text-white text-sm">{members.length + 1} Members Enrolled</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <span className="text-[8px] uppercase tracking-widest font-black text-slate-600 block mb-2">Technical Abstract Snippet</span>
                   <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed">"{abstractText}"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('members')} 
                  disabled={isSubmitting}
                  className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ChevronLeft size={16} /> REVISE
                </button>
                <button 
                  onClick={handleFinalSubmission}
                  disabled={isSubmitting}
                  className="flex-[2] py-5 bg-green-500 text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      SYNCING TO CLOUD...
                    </>
                  ) : (
                    <>
                      INITIALIZE ENTRY <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

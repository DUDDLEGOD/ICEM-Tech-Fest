
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  Lightbulb,
  PlusCircle,
  Send,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  Users as UsersIcon
} from 'lucide-react';

import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSiteConfig } from '../contexts/useSiteConfig';
import { submitRegistration } from '../services/registrationApi';
import { Department, EventConfig, Registration, RegistrationApiResult } from '../types';

interface RegistrationFormProps {
  onSuccess: (reg: Registration, toastMessage?: string) => void;
  initialEventId: string | null;
}

type Step = 'leader' | 'team' | 'abstract' | 'members' | 'payment' | 'confirm';
type LeaderField = 'name' | 'email' | 'phone' | 'college';

interface LeaderInfo {
  name: string;
  email: string;
  phone: string;
  college: string;
}

type MemberInfo = { name: string; email: string; college: string };

const resolveInitialEventId = (value: string | null, events: EventConfig[]): string => {
  if (value && events.some((event) => event.id === value)) {
    return value;
  }

  const firstLiveEvent = events.find((event) => event.isRegistrationOpen) ?? events[0];
  return firstLiveEvent?.id ?? '';
};

const createToken = (size: number) => Math.random().toString(36).slice(2, 2 + size).toUpperCase();
const DEFAULT_CONFIRMED_TOAST = 'Cloud sync complete. Check your email for further instructions.';
const DEFAULT_QUEUED_TOAST = 'Registration submitted successfully. Confirmation email may take a few minutes.';
const collapseWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ');
const parseRobotFeeOptions = (fee: number | string) => {
  if (typeof fee !== 'string') return null;

  const match = fee.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) return null;

  return {
    withoutRobot: parseInt(match[1], 10),
    withRobot: parseInt(match[2], 10),
  };
};
const getNumericFee = (fee: number | string) => {
  if (typeof fee === 'number') return fee;

  const robotFeeOptions = parseRobotFeeOptions(fee);
  if (robotFeeOptions) {
    return robotFeeOptions.withoutRobot;
  }

  return parseInt(String(fee).replace(/[^0-9]/g, ''), 10) || 0;
};
const formatFee = (fee: number) => (fee > 0 ? `Rs. ${fee}` : 'Free');

const DEPARTMENT_QR_ALIASES: Record<string, string[]> = {
  [Department.FIRST_YEAR]: ['first-year', 'fy'],
  [Department.COMPS]: ['computer', 'comps', 'computer-dept'],
  [Department.AIDS]: ['aids', 'ai-ds', 'ai-data-science'],
  [Department.IT]: ['it', 'information-technology', 'it-dept'],
  [Department.CIVIL]: ['civil', 'civil-dept'],
  [Department.MECH]: ['mech', 'mechanical', 'mechanical-dept'],
  [Department.ENTC]: ['entc', 'electronics-telecommunication', 'electronics-telecom'],
  [Department.MCA_BCA]: ['mca-bca', 'mca', 'bca'],
  [Department.MBA]: ['mba', 'igsb', 'mba-igsb-icem'],
};

const normalizeDepartmentKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/department/g, '')
    .replace(/dept\.?/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getDepartmentQrCandidates = (department: string) => {
  const aliases = DEPARTMENT_QR_ALIASES[department] ?? [];
  const slugs = Array.from(new Set([...aliases, normalizeDepartmentKey(department)].filter(Boolean)));
  const extensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

  return slugs.flatMap((slug) => extensions.map((extension) => `/qr/${slug}.${extension}`));
};

const getExpectedDepartmentQrFile = (department: string) => {
  const aliases = DEPARTMENT_QR_ALIASES[department] ?? [normalizeDepartmentKey(department)];
  const slug = aliases.find(Boolean) ?? 'department';
  return `${slug}.png`;
};

const getUpiPaymentLink = (upiId: string, payeeName: string, amount: number) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}${
    amount > 0 ? `&am=${amount}` : ''
  }&cu=INR`;

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
  const { config } = useSiteConfig();
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>(() =>
    resolveInitialEventId(initialEventId, config.events),
  );
  const [teamName, setTeamName] = useState('');
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo>({
    name: '',
    email: '',
    phone: '',
    college: 'Indira College of Engineering and Management'
  });
  const [members, setMembers] = useState<{ name: string; email: string; college: string }[]>([]);
  const [abstractText, setAbstractText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('leader');
  const [error, setError] = useState('');
  const [hasPaid, setHasPaid] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [hasRobot, setHasRobot] = useState(false);
  const [paymentQrSrc, setPaymentQrSrc] = useState<string | null>(null);
  const [isDepartmentQrMissing, setIsDepartmentQrMissing] = useState(false);

  const currentEvent = useMemo(
    () => config.events.find((event) => event.id === selectedEventId) ?? config.events[0],
    [config.events, selectedEventId],
  );
  const robotFeeOptions = useMemo(
    () => currentEvent.department === Department.ENTC ? parseRobotFeeOptions(currentEvent.fee) : null,
    [currentEvent.department, currentEvent.fee],
  );
  const numericFee = useMemo(
    () => robotFeeOptions ? (hasRobot ? robotFeeOptions.withRobot : robotFeeOptions.withoutRobot) : getNumericFee(currentEvent.fee),
    [currentEvent.fee, hasRobot, robotFeeOptions],
  );
  const primaryUpiId = config.registration.paymentUpiIds?.map((value) => value.trim()).find(Boolean) ?? '';
  const paymentQrCandidates = useMemo(
    () => getDepartmentQrCandidates(currentEvent.department),
    [currentEvent.department],
  );
  const expectedDepartmentQrFile = useMemo(
    () => getExpectedDepartmentQrFile(currentEvent.department),
    [currentEvent.department],
  );
  const visibleStepIds = useMemo<Step[]>(() => {
    const next: Step[] = ['leader', 'team'];
    if (currentEvent.requiresUpload) {
      next.push('abstract');
    }
    next.push('members');
    if (numericFee > 0) {
      next.push('payment');
    }
    next.push('confirm');
    return next;
  }, [currentEvent.requiresUpload, numericFee]);

  useEffect(() => {
    const scrollToForm = () => {
      if (!formRef.current) return;

      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      const firstInput = formRef.current.querySelector('input');
      (firstInput as HTMLInputElement | null)?.focus();
    };

    requestAnimationFrame(() => {
      setTimeout(scrollToForm, 100);
    });
  }, []);

  useEffect(() => {
    setMembers((previousMembers) => previousMembers.slice(0, Math.max(currentEvent.maxTeam - 1, 0)));
  }, [currentEvent.maxTeam]);

  useEffect(() => {
    setHasPaid(false);
    setTransactionId('');
    setHasRobot(false);
    setError('');
  }, [selectedEventId]);

  useEffect(() => {
    if (step === 'abstract' && !currentEvent.requiresUpload) {
      setStep('members');
      return;
    }

    if (step === 'payment' && numericFee === 0) {
      setHasPaid(true);
      setStep('confirm');
    }
  }, [currentEvent.requiresUpload, numericFee, step]);

  useEffect(() => {
    let isCancelled = false;

    setPaymentQrSrc(null);
    setIsDepartmentQrMissing(false);

    if (paymentQrCandidates.length === 0) {
      setIsDepartmentQrMissing(true);
      return;
    }

    const loadCandidate = (index: number) => {
      if (isCancelled) return;

      if (index >= paymentQrCandidates.length) {
        setIsDepartmentQrMissing(true);
        return;
      }

      const probe = new Image();
      probe.onload = () => {
        if (isCancelled) return;
        setPaymentQrSrc(paymentQrCandidates[index]);
        setIsDepartmentQrMissing(false);
      };
      probe.onerror = () => loadCandidate(index + 1);
      probe.src = paymentQrCandidates[index];
    };

    loadCandidate(0);

    return () => {
      isCancelled = true;
    };
  }, [paymentQrCandidates]);

  const fallbackOpenEvent = config.events.find((event) => event.isRegistrationOpen);
  const isRegistrationClosed = !config.registration.isOpen || !currentEvent.isRegistrationOpen;
  const stepLabels: Record<Step, string> = {
    leader: 'Identity',
    team: 'Arena',
    abstract: 'Brief',
    members: 'Squad',
    payment: 'Payment',
    confirm: 'Review',
  };
  const steps = visibleStepIds.map((id) => ({ id, label: stepLabels[id] }));
  const feeSummaryLabel = robotFeeOptions
    ? `${formatFee(robotFeeOptions.withoutRobot)} without robot / ${formatFee(robotFeeOptions.withRobot)} with robot`
    : formatFee(numericFee);
  const goToNextVisibleStep = (current: Step) => {
    const currentIndex = visibleStepIds.indexOf(current);
    const nextStep = visibleStepIds[currentIndex + 1];
    if (nextStep) {
      setStep(nextStep);
    }
  };
  
  const addMember = () => {
    if (members.length + 1 < currentEvent.maxTeam) {
      setMembers([...members, { name: '', email: '', college: '' }]);
    } else {
      setError(`Maximum team size for ${currentEvent.name} is ${currentEvent.maxTeam} (including leader).`);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    setError('');
  };

  const updateMember = (index: number, field: 'name' | 'email' | 'college', value: string) => {
    setMembers((previousMembers) =>
      previousMembers.map((member, memberIndex) => {
        if (memberIndex !== index) return member;
        return { ...member, [field]: value };
      })
    );
  };

const validateLeader = () => {
  const normalizedLeader = {
    name: collapseWhitespace(leaderInfo.name),
    email: leaderInfo.email.trim().toLowerCase(),
    phone: leaderInfo.phone.replace(/\s/g, ''),
    college: collapseWhitespace(leaderInfo.college),
  };

  setLeaderInfo(normalizedLeader);

  if (!normalizedLeader.name || !normalizedLeader.email || !normalizedLeader.phone || !normalizedLeader.college)
    return setError('All leader fields are required');

  if (!emailRegex.test(normalizedLeader.email))
    return setError('Invalid email address');

  if (!phoneRegex.test(normalizedLeader.phone))
    return setError('Enter a valid Indian phone number');

  setError('');
  goToNextVisibleStep('leader');

};

  const validateTeam = () => {
    const normalizedTeamName = collapseWhitespace(teamName);
    setTeamName(normalizedTeamName);

    if (!normalizedTeamName) return setError('Team name is required');
    setError('');
    goToNextVisibleStep('team');
  };

  const validateAbstract = () => {
    const normalizedAbstract = abstractText.trim();
    setAbstractText(normalizedAbstract);

    if (normalizedAbstract.length < 50) {
      return setError('Abstract must be at least 50 characters to satisfy technical review.');
    }
    setError('');
    goToNextVisibleStep('abstract');
  };

const validateMembers = () => {
  const normalizedMembers = members.map((member) => ({
    name: collapseWhitespace(member.name),
    email: member.email.trim().toLowerCase(),
    college: collapseWhitespace(member.college),
  }));

  setMembers(normalizedMembers);

  const totalMembers = normalizedMembers.length + 1;

  if (totalMembers < currentEvent.minTeam) {
    return setError(
      `This event requires at least ${currentEvent.minTeam} members.`
    );
  }

  for (const m of normalizedMembers) {
    if (!m.name || !m.email || !m.college)
      return setError('All member details must be provided.');
  }

  const emails = [leaderInfo.email.trim().toLowerCase(), ...normalizedMembers.map((member) => member.email)];

  const duplicates = emails.filter(
    (email, index) => emails.indexOf(email) !== index
  );

  if (duplicates.length > 0) {
    return setError('Each member must use a unique email.');
  }

  setError('');

  if (numericFee > 0) {
    goToNextVisibleStep('members');
  } else {
    setHasPaid(true);
    goToNextVisibleStep('members');
  }

};
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const utrRegex = /^(?=.*\d)(?!([0-9])\1{11,})[A-Za-z0-9]{12,22}$/;
  const handleFinalSubmission = async () => {
    setIsSubmitting(true);
    setError('');

    const normalizedLeader = {
      name: collapseWhitespace(leaderInfo.name),
      email: leaderInfo.email.trim().toLowerCase(),
      phone: leaderInfo.phone.replace(/\s/g, ''),
      college: collapseWhitespace(leaderInfo.college),
    };
    const normalizedMembers: MemberInfo[] = members.map((member) => ({
      name: collapseWhitespace(member.name),
      email: member.email.trim().toLowerCase(),
      college: collapseWhitespace(member.college),
    }));
    const normalizedTeamName = collapseWhitespace(teamName);
    const normalizedAbstractText = abstractText.trim();
    const robotStatusNote = robotFeeOptions
      ? `Robot Status: ${hasRobot ? 'Team is bringing a robot' : 'Team is not bringing a robot'}`
      : '';
    const submissionAbstractText = [robotStatusNote, normalizedAbstractText].filter(Boolean).join('\n\n');

    const registration: Registration = {
      id: createToken(9),
      teamName: normalizedTeamName,
      eventId: selectedEventId,
      leaderId: `LEAD_${createToken(5)}`,
      leaderName: normalizedLeader.name,
      leaderEmail: normalizedLeader.email,
      leaderPhone: normalizedLeader.phone,
      leaderCollege: normalizedLeader.college,
      members: normalizedMembers,
      abstractText: submissionAbstractText,
      status: 'Confirmed',
      qrHash: btoa(JSON.stringify({
        team: normalizedTeamName,
        event: selectedEventId,
        department: currentEvent.department,
        leader: normalizedLeader.name,
      })),
      timestamp: Date.now(),
      feePaid: numericFee,
      hasPaid,
      hasRobot: robotFeeOptions ? hasRobot : undefined,
      transactionId: transactionId.trim(),
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

  if (isRegistrationClosed) {
    const closedMessage = config.registration.isOpen
      ? `${currentEvent.name} registrations are currently paused. Please select another live event or contact the organizers.`
      : config.registration.closedMessage;

    return (
      <div
  ref={formRef}
  id="registration-form"
  className="max-w-4xl mx-auto px-6 py-12 md:py-20 scroll-mt-32"
>
        <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle size={26} />
            </div>
            <div>
              <h2 className="text-3xl font-futuristic font-black uppercase tracking-tighter text-white">Registration Closed</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-300 mt-2">Live status update from the command center</p>
            </div>
          </div>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">{closedMessage}</p>

          {config.registration.isOpen && fallbackOpenEvent && fallbackOpenEvent.id !== currentEvent.id && (
            <button
              onClick={() => {
                setSelectedEventId(fallbackOpenEvent.id);
                setError('');
              }}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all shadow-xl shadow-white/5 hover:scale-[1.01] active:scale-95"
            >
              Switch to {fallbackOpenEvent.name}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      id="registration-form"
      className="max-w-4xl mx-auto px-6 py-12 md:py-20 scroll-mt-32"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-futuristic font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-purple-400">
            Registration
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-[10px] uppercase tracking-widest">
            Guided Entry Flow // Official TechnoFest '26 Registry
          </p>
        </div>
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div
              key={i}
              title={s.label}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                step === s.id
                  ? 'bg-[#06b6d4] shadow-[0_0_18px_rgba(6,182,212,0.8)] scale-125'
                  : steps.findIndex(x => x.id === step) > i
                    ? 'bg-purple-400'
                    : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-8 glass rounded-[2rem] border-white/10 p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500">Selected Event</p>
            <h3 className="font-futuristic text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              {currentEvent.name}
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              {currentEvent.department} • {currentEvent.eventDateLabel} • {currentEvent.venueLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[22rem]">
            {[
              { label: 'Team Size', value: `${currentEvent.minTeam}-${currentEvent.maxTeam}` },
              { label: 'Entry Fee', value: feeSummaryLabel },
              { label: 'Abstract', value: currentEvent.requiresUpload ? 'Required' : 'Not Needed' },
              { label: robotFeeOptions ? 'Robot' : 'Status', value: robotFeeOptions ? (hasRobot ? 'Bringing robot' : 'Using event robot') : (currentEvent.isRegistrationOpen ? 'Open' : 'Paused') },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
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
                <div className="w-12 h-12 bg-[#06b6d4]/10 rounded-2xl flex items-center justify-center text-[#06b6d4] border border-[#06b6d4]/20">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Leader Identity</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Capture the lead contact exactly as it should appear in confirmations.
                  </p>
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
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#06b6d4] transition-all font-bold text-white text-sm"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={validateLeader}
                className="w-full py-5 bg-gradient-to-r from-[#06b6d4] to-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-[#06b6d4]/20 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4"
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
                <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center text-purple-300 border border-purple-400/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Arena Selection</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {currentEvent.department} | {robotFeeOptions ? feeSummaryLabel : formatFee(numericFee)} | {currentEvent.minTeam}-{currentEvent.maxTeam} members
                  </p>
                </div>
              </div>
              <div className="grid gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Selected Battleground</label>
                  <div className="rounded-[1.75rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(6,182,212,0.08),rgba(15,23,42,0.7))] px-5 py-5 shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <p className="text-lg font-black text-white">{currentEvent.name}</p>
                        <p className="text-sm font-medium text-slate-300">{currentEvent.tagline}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
                          {currentEvent.department}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 px-4 py-3 text-left md:max-w-[18rem] md:text-right">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-200">Event Locked</p>
                        <p className="mt-2 text-xs font-bold text-slate-200">
                          To change the event, go back to the Events section and start registration from that card.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { label: 'Date', value: currentEvent.eventDateLabel },
                    { label: 'Venue', value: currentEvent.venueLabel },
                    { label: 'Abstract Step', value: currentEvent.requiresUpload ? 'Included' : 'Skipped' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                {robotFeeOptions && (
                  <label className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5 flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRobot}
                      onChange={(e) => setHasRobot(e.target.checked)}
                      className="mt-1 h-5 w-5 accent-[#06b6d4]"
                    />
                    <div className="space-y-2">
                      <span className="block text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
                        Robot Status
                      </span>
                      <p className="text-sm font-bold text-white">
                        Check this if your team is bringing its own robot.
                      </p>
                      <p className="text-xs text-slate-400">
                        Unchecked: {formatFee(robotFeeOptions.withoutRobot)} without robot. Checked: {formatFee(robotFeeOptions.withRobot)} with robot.
                      </p>
                    </div>
                  </label>
                )}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Squad Designation (Team Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. ALPHA_OMEGA"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-400 transition-all font-bold text-white uppercase tracking-widest"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('leader')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> BACK
                </button>
                <button
                  onClick={validateTeam}
                  className="flex-[2] py-5 bg-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-purple-400/15 flex items-center justify-center gap-2"
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
                <div className="w-12 h-12 bg-[#06b6d4]/10 rounded-2xl flex items-center justify-center text-[#67e8f9] border border-[#06b6d4]/20">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Project Intel</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    This step appears only for events that need a concept brief or MVP summary.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Technical Abstract / Idea</label>
                  <span className={`text-[9px] font-black ${abstractText.length < 50 ? 'text-red-500' : 'text-[#67e8f9]'}`}>
                    {abstractText.length} / 50 MIN
                  </span>
                </div>
                <textarea
  rows={8}
  maxLength={300}
  placeholder="Provide a detailed overview of your project..."
  value={abstractText}
  onChange={(e) => setAbstractText(e.target.value)}
  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-[#06b6d4] transition-all font-medium text-white text-sm leading-relaxed resize-none"
/>
                <div className="h-[3px] bg-white/10 rounded-full overflow-hidden mt-2">
  <motion.div
    className="h-full bg-gradient-to-r from-[#06b6d4] to-purple-400"
    animate={{
      width: `${Math.min((abstractText.length / 300) * 100, 100)}%`
    }}
  />
</div>

<p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
  {abstractText.length} / 300
</p>
              </div>
	
              <div className="flex gap-4">
                <button onClick={() => setStep('team')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> BACK
                </button>
                <button
                  onClick={validateAbstract}
                  className="flex-[2] py-5 bg-gradient-to-r from-[#06b6d4] to-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
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
                <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center text-purple-300 border border-purple-400/20">
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
                    <span className="text-[10px] font-black text-[#06b6d4] uppercase tracking-widest">Team Leader (Auto)</span>
                    <span className="text-sm font-bold text-white">{leaderInfo.name || 'Anonymous Leader'}</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-400/10 border border-purple-400/20 rounded-full text-purple-300 text-[9px] font-black uppercase tracking-tighter">
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
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-400 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-slate-600">Member {idx + 2} Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-400 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-slate-600">Member {idx + 2} Institution</label>
                      <input
                        type="text"
                        value={member.college}
                        onChange={(e) => updateMember(idx, 'college', e.target.value)}
                        placeholder="College Name"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-400 transition-all text-sm font-bold"
                      />
                    </div>
                  </motion.div>
                ))}

                {members.length + 1 < currentEvent.maxTeam && (
                  <button
                    onClick={addMember}
                    className="w-full py-4 border-2 border-dashed border-white/10 hover:border-[#06b6d4]/50 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-[#67e8f9] transition-all group"
                  >
                    <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Squad Member</span>
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(currentEvent.requiresUpload ? 'abstract' : 'team')}
                  className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={16} /> BACK
                </button>
                <button
                  onClick={validateMembers}
                  className="flex-[2] py-5 bg-gradient-to-r from-[#06b6d4] to-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-[#06b6d4]/15 flex items-center justify-center gap-2"
                >
                  ASSEMBLE TEAM <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (() => {
            const bankAccountNo = config.registration.bankAccountNo;
            const bankIfsc = config.registration.bankIfsc;
            const payeeName = config.registration.payeeName || 'TechnoFest 2026';
            const fallbackUpiLink = primaryUpiId ? getUpiPaymentLink(primaryUpiId, payeeName, numericFee) : '';

            return (
              <motion.div
                key="payment"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#06b6d4]/10 rounded-2xl flex items-center justify-center text-[#67e8f9] border border-[#06b6d4]/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Registration Fee</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Department-aware payment flow for {currentEvent.department}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
                  {/* Bank Details & QR Card */}
                  {paymentQrSrc || fallbackUpiLink || bankAccountNo || bankIfsc || primaryUpiId ? (
                    <div className="w-full flex flex-col items-center space-y-6">
                      
                      {/* Scan to Pay */}
                      <div className="flex flex-col items-center space-y-3">
                        <span className="text-[10px] font-black text-[#67e8f9] uppercase tracking-widest text-center">
                          Scan {currentEvent.department} QR
                        </span>
                        <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center min-h-[192px] min-w-[192px]">
                          {paymentQrSrc ? (
                            <img
                              src={paymentQrSrc}
                              alt={`${currentEvent.department} payment QR`}
                              className="w-40 h-40 object-contain"
                            />
                          ) : fallbackUpiLink ? (
                            <QRCodeSVG
                              value={fallbackUpiLink}
                              size={160}
                              bgColor="#ffffff"
                              fgColor="#0f172a"
                              level="M"
                              includeMargin={false}
                            />
                          ) : (
                            <div className="px-4 text-center text-slate-700">
                              <p className="text-xs font-black uppercase tracking-[0.2em]">QR unavailable</p>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pt-2">
                          {paymentQrSrc
                            ? 'Department-specific QR loaded from the payment assets folder.'
                            : fallbackUpiLink
                              ? 'Fallback UPI QR is active until the department asset is added.'
                              : 'Contact the organizing desk for the active payment route.'}
                        </span>
                        {isDepartmentQrMissing && (
                          <span className="sr-only">Expected QR asset: {expectedDepartmentQrFile}</span>
                        )}
                      </div>

                      <div className="w-full h-px bg-white/10" />

                      {/* Manual Transfer Details */}
                      <div className="w-full">
                        <div className="text-center mb-4">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Direct Payment Details</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Name</span>
                            <span className="text-xs font-bold text-white tracking-wide">{payeeName}</span>
                          </div>
                          {primaryUpiId && (
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">UPI ID</span>
                              <span className="text-xs font-bold text-[#67e8f9] tracking-[0.16em] font-mono select-all">{primaryUpiId}</span>
                            </div>
                          )}
                          {bankAccountNo && (
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Account No.</span>
                              <span className="text-xs font-bold text-purple-300 tracking-[0.2em] font-mono select-all">{bankAccountNo}</span>
                            </div>
                          )}
                          {bankIfsc && (
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IFSC Code</span>
                              <span className="text-xs font-bold text-purple-300 tracking-[0.2em] font-mono select-all">{bankIfsc}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center">Payment details are not configured yet. Please contact the organizers for payment information.</p>
                  )}

                  <p className="text-sm font-bold text-white uppercase tracking-widest">
                    Amount Due: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-purple-300">{formatFee(numericFee)}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 text-center max-w-md leading-relaxed">
                    Pay using the department QR above or use the direct account details here. Organizers will verify your payment against the transaction reference you submit next.
                  </p>

                  <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={hasPaid}
                      onChange={(e) => setHasPaid(e.target.checked)}
                      className="w-5 h-5 accent-[#06b6d4]"
                    />
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                      I confirm that I have transferred {formatFee(numericFee)}{robotFeeOptions ? (hasRobot ? ' with our robot.' : ' without bringing a robot.') : '.'}
                    </span>
                  </label>

                  <div className="w-full mt-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 block text-left">Transaction ID / UTR</label>
                    <input
                      type="text"
                      placeholder="e.g. 312345678901"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-400 transition-all font-bold text-white text-sm tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep('members')} className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <ChevronLeft size={16} /> BACK
                  </button>
                  <button
                    onClick={() => {

			  if (!hasPaid) {
			    setError('Please confirm payment before continuing.');
			    return;
			  }

			  if (!utrRegex.test(transactionId.trim())) {
			    setError(
			      'Invalid UTR. Enter the real transaction ID from your UPI app.'
			    );
			    return;
			  }

			  setError('');
			  setStep('confirm');

			}}
                    className="flex-[2] py-5 bg-gradient-to-r from-[#06b6d4] to-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-[#06b6d4]/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    VERIFY PAYMENT <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })()}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center text-purple-300 border border-purple-400/20">
                  <Send size={24} />
                </div>
                <div>
                  <h4 className="font-futuristic text-xl text-white uppercase tracking-tighter">Final Review</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verify mission data before launch</p>
                </div>
              </div>

              <div className="glass p-6 md:p-8 rounded-3xl border-white/10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Arena</span>
                    <p className="font-futuristic font-black text-[#67e8f9] text-lg leading-tight">{currentEvent.name}</p>
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
                  <div className="space-y-3">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Department</span>
                    <p className="font-bold text-white text-sm">{currentEvent.department}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Fee Status</span>
                    <p className="font-bold text-white text-sm">
                      {numericFee > 0
                        ? `${formatFee(numericFee)} ${robotFeeOptions ? (hasRobot ? '(with robot)' : '(without robot)') : ''} marked paid`
                        : 'No payment required'}
                    </p>
                  </div>
                  {robotFeeOptions && (
                    <div className="space-y-3">
                      <span className="text-[8px] uppercase tracking-widest font-black text-slate-600">Robot Status</span>
                      <p className="font-bold text-white text-sm">{hasRobot ? 'Team is bringing a robot' : 'Team needs the event robot slot'}</p>
                    </div>
                  )}
                </div>
                {currentEvent.requiresUpload && (
                  <div className="pt-4 border-t border-white/5">
                     <span className="text-[8px] uppercase tracking-widest font-black text-slate-600 block mb-2">Technical Abstract Snippet</span>
                     <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed">"{abstractText}"</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(numericFee > 0 ? 'payment' : 'members');
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-5 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ChevronLeft size={16} /> REVISE
                </button>
                <button
                  onClick={handleFinalSubmission}
                  disabled={isSubmitting}
                  className="flex-[2] py-5 bg-gradient-to-r from-[#06b6d4] to-purple-400 text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-2xl transition-all shadow-xl shadow-[#06b6d4]/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
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

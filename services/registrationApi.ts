import { Registration, RegistrationApiResult } from '../types';

interface RegistrationSubmissionPayload {
  registration: Registration;
  eventName: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueLabel: string;
}

// Detect if we are in production on Vercel, otherwise use localhost
const BACKEND_URL = import.meta.env.PROD 
  ? '/api/register' 
  : 'http://localhost:3001/api/register';

export const submitRegistration = async (
  payload: RegistrationSubmissionPayload
): Promise<RegistrationApiResult> => {
  const body = JSON.stringify({
    registration: payload.registration,
    eventName: payload.eventName,
    eventDateLabel: payload.eventDateLabel,
    eventTimeLabel: payload.eventTimeLabel,
    venueLabel: payload.venueLabel,
    submittedAtIso: new Date(payload.registration.timestamp).toISOString()
  });

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    if (!response.ok) throw new Error('Backend error');

    const data = await response.json();
    return { status: data.status, registrationId: data.registrationId, message: data.message };
  } catch {
    return {
      status: 'queued',
      registrationId: payload.registration.id,
      message: 'Network offline. Registration saved locally.'
    };
  }
};

const GET_URL = import.meta.env.PROD 
  ? '/api/registrations' 
  : 'http://localhost:3001/api/registrations';

export const fetchRegistrations = async (): Promise<Registration[]> => {
  try {
    const response = await fetch(GET_URL);
    if (!response.ok) throw new Error('Failed to fetch registrations');
    
    const data = await response.json();
    
    // Transform DB raw data back into the frontend Registration interface
    return data.map((row: any) => ({
      id: row.registration_ref,
      teamName: row.team_name,
      eventId: row.event_id as any,
      leaderId: '', 
      leaderName: row.leader_name,
      leaderEmail: row.leader_email,
      leaderPhone: row.leader_phone,
      leaderCollege: row.leader_college,
      members: row.team_members || [],
      abstractText: row.abstract_text,
      status: row.status,
      qrHash: '',
      timestamp: new Date(row.created_at).getTime(),
      feePaid: row.fee_paid || 0,
      verifiedAt: row.verified_at ? new Date(row.verified_at).getTime() : undefined
    }));
  } catch (error) {
    console.error('Error fetching from Supabase API:', error);
    return [];
  }
};

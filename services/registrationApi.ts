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

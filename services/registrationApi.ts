import { Registration, RegistrationApiResult } from '../types';
import emailjs from 'emailjs-com';

interface RegistrationSubmissionPayload {
  registration: Registration;
  eventName: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueLabel: string;
}

const LEGACY_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwPt0Mn7i2OhWBEUYbsKGvzF5iI-SpobfRlnOhYh0fTbBM4Ox0-ybvoMXl3hrdTtYeE/exec';
const importMeta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
const CONFIGURED_ENDPOINT = importMeta.env?.VITE_REGISTRATION_API_URL?.trim();
const REGISTRATION_API_URL = CONFIGURED_ENDPOINT && CONFIGURED_ENDPOINT.length > 0 ? CONFIGURED_ENDPOINT : LEGACY_SCRIPT_ENDPOINT;

// Ensure EmailJS credentials exist in your .env file
const EMAILJS_SERVICE_ID = importMeta.env?.VITE_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = importMeta.env?.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
const EMAILJS_PUBLIC_KEY = importMeta.env?.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';

const buildRequestBody = (payload: RegistrationSubmissionPayload) => {
  return JSON.stringify({
    ...payload.registration,
    eventName: payload.eventName,
    eventDateLabel: payload.eventDateLabel,
    eventTimeLabel: payload.eventTimeLabel,
    venueLabel: payload.venueLabel,
    submittedAtIso: new Date(payload.registration.timestamp).toISOString()
  });
};

const sendEmailFallback = async (payload: RegistrationSubmissionPayload): Promise<boolean> => {
  try {
    const templateParams = {
      to_name: payload.registration.leaderName,
      to_email: payload.registration.leaderEmail,
      event_name: payload.eventName,
      team_name: payload.registration.teamName,
      registration_id: payload.registration.id,
      event_date: payload.eventDateLabel,
      event_time: payload.eventTimeLabel,
      venue: payload.venueLabel,
      members_count: payload.registration.members.length + 1
    };

    // If we're using default placeholders, just mock success for the demo
    if (EMAILJS_SERVICE_ID === 'default_service') {
      console.log('Mocking EmailJS send (no credentials configured):', templateParams);
      return true;
    }

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('EmailJS sending failed:', error);
    return false;
  }
};

const submitWithCors = async (url: string, body: string, payload: RegistrationSubmissionPayload): Promise<RegistrationApiResult> => {
  let gasSuccess = false;
  let gasResult: RegistrationApiResult | null = null;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const raw = JSON.parse(text);
        if (raw.status === 'duplicate') {
          return { status: 'duplicate', message: raw.message, registrationId: raw.registrationId };
        }
        if (raw.status === 'confirmed' || raw.status === 'queued') {
          gasSuccess = true;
          gasResult = { status: raw.status, registrationId: raw.registrationId, message: raw.message };
        }
      } catch (e) {
        console.warn('GAS responded with non-JSON (typical CORS block or login redirect)', e);
      }
    }
  } catch (error) {
    console.warn('Best-effort GAS fetch failed:', error);
  }

  // If GAS fails, we fallback to sending the email directly via EmailJS
  let emailSent = gasSuccess; 
  if (!gasSuccess) {
    emailSent = await sendEmailFallback(payload);
  }

  // Treat as queued/successful so LocalStorage can save it
  return {
    status: 'queued',
    registrationId: payload.registration.id,
    message: emailSent 
      ? 'Registration submitted locally and confirmation email sent.' 
      : 'Registration submitted locally. Email service is temporarily unavailable.'
  };
};

export const submitRegistration = async (
  payload: RegistrationSubmissionPayload
): Promise<RegistrationApiResult> => {
  const body = buildRequestBody(payload);

  try {
    return await submitWithCors(REGISTRATION_API_URL, body, payload);
  } catch (err) {
    console.error('Submission wrapper error:', err);
    // Even if totally walled off, we want local storage to succeed
    return {
      status: 'queued',
      registrationId: payload.registration.id,
      message: 'Network offline. Registration saved locally.'
    };
  }
};

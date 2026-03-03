import { Registration, RegistrationApiResult } from '../types';

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

const isRegistrationStatus = (value: unknown): value is RegistrationApiResult['status'] => {
  return value === 'confirmed' || value === 'duplicate' || value === 'queued' || value === 'failed';
};

const normalizeApiResult = (value: unknown): RegistrationApiResult | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (!isRegistrationStatus(candidate.status)) {
    return null;
  }

  return {
    status: candidate.status,
    registrationId: typeof candidate.registrationId === 'string' ? candidate.registrationId : undefined,
    message: typeof candidate.message === 'string' ? candidate.message : undefined
  };
};

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

const submitWithCors = async (url: string, body: string): Promise<RegistrationApiResult> => {
  const response = await fetch(url, {
    method: 'POST',
    body
  });

  if (!response.ok) {
    return {
      status: 'failed',
      message: `Registration API returned ${response.status}. Please try again.`
    };
  }

  const text = await response.text();

  try {
    const raw = JSON.parse(text);
    const normalized = normalizeApiResult(raw);
    if (normalized) {
      return normalized;
    }
    return {
      status: 'failed',
      message: 'Registration API returned an invalid JSON payload.'
    };
  } catch {
    const preview = text.trim().slice(0, 140);
    return {
      status: 'failed',
      message: `Registration API did not return JSON. Response preview: ${preview || 'empty response'}`
    };
  }
};


export const submitRegistration = async (
  payload: RegistrationSubmissionPayload
): Promise<RegistrationApiResult> => {
  const body = buildRequestBody(payload);

  try {
    return await submitWithCors(REGISTRATION_API_URL, body);
  } catch {
    return {
      status: 'failed',
      message: 'Unable to submit registration right now. Please check your connection and retry.'
    };
  }
};

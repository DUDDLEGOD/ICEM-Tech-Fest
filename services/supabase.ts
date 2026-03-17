import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Database integration will fail.');
}

// We use the same client for both the browser (Vite) and the Node Serverless Backend
export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      persistSession: false
    }
  }
);

const SCREENSHOT_BUCKET = 'payment-screenshots';

export const uploadPaymentScreenshot = async (
  file: File,
  registrationId: string
): Promise<string | null> => {
  const ext = file.name.split('.').pop() || 'png';
  const filePath = `${registrationId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Screenshot upload failed:', error.message);
    return null;
  }

  const { data } = supabase.storage
    .from(SCREENSHOT_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

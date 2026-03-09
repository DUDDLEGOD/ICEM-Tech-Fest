import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

if (!supabase) {
  console.warn('Missing Supabase URL or anon key. Registration API will fail until the env vars are configured.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  if (!supabase) {
    res.status(500).json({ status: 'failed', message: 'Supabase is not configured on the server.' });
    return;
  }

  try {
    const { registration, eventName, eventDateLabel, eventTimeLabel, venueLabel } = req.body;

    if (!registration || !registration.leaderEmail) {
      res.status(400).json({ status: 'failed', message: 'Missing leaderEmail in payload.' });
      return;
    }

    const { data: regInsert, error: regError } = await supabase
      .from('registrations')
      .insert({
        registration_ref: registration.id,
        team_name: registration.teamName,
        event_id: registration.eventId,
        leader_name: registration.leaderName,
        leader_email: registration.leaderEmail,
        leader_phone: registration.leaderPhone,
        leader_college: registration.leaderCollege,
        abstract_text: registration.abstractText || '',
        status: 'Confirmed',
        fee_paid: registration.feePaid || 0,
        has_paid: registration.hasPaid || false,
        transaction_id: registration.transactionId || null,
      })
      .select('id')
      .single();

    if (regError) {
      console.error('Supabase Registration Insert Error:', regError);

      if (regError.code === '23505') {
        res.status(400).json({
          status: 'duplicate',
          message: 'A registration for this team already exists in the cloud.',
        });
        return;
      }

      throw new Error(`DB Reg Insert Failed: ${regError.message}`);
    }

    const dbRegistrationId = regInsert.id;

    if (registration.members && registration.members.length > 0) {
      const memberInserts = registration.members.map((member: any) => ({
        registration_id: dbRegistrationId,
        name: member.name,
        email: member.email,
        college: member.college,
      }));

      const { error: memberError } = await supabase.from('team_members').insert(memberInserts);

      if (memberError) {
        console.error('Supabase Member Insert Error:', memberError);
      }
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'TechnoFest 2026'}" <${process.env.SMTP_USER}>`,
      to: registration.leaderEmail,
      subject: `[CONFIRMED] Technofest 2026: ${eventName} Registration`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b; text-transform: uppercase; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">MISSION SECURED</h1>

          <p style="font-size: 16px;">Agent <strong>${registration.leaderName}</strong>,</p>
          <p style="font-size: 16px;">Your squad <strong>[${registration.teamName}]</strong> has been successfully registered for <strong>${eventName}</strong>.</p>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>VENUE:</strong> ${venueLabel}</p>
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>DATE:</strong> ${eventDateLabel}</p>
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>TIME:</strong> ${eventTimeLabel}</p>
            <p style="margin: 5px 0; color: #a855f7;"><strong>TRACKING REF:</strong> ${registration.id}</p>
          </div>

          <p style="font-size: 14px; color: #9ca3af;">Prepare your equipment and brief your squad. Further intelligence will follow closer to drop day.</p>

          <br />
          <p style="font-size: 12px; color: #6b7280; font-family: monospace;">This is an automated dispatch from the TechnoFest 2026 Mainframe.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[HTTP 200] Registration stored and confirmation mailed -> ${registration.leaderEmail}`);
      res.json({ status: 'confirmed', registrationId: registration.id });
    } catch (emailError: any) {
      console.error(`[EMAIL FAIL] Could not send to ${registration.leaderEmail}:`, emailError.message);
      res.json({
        status: 'confirmed',
        registrationId: registration.id,
        message: 'Saved to database. Check spam or confirm that the email address is valid.',
      });
    }
  } catch (error: any) {
    console.error('[HTTP 500] Critical API Server Error:', error.message);
    res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => console.log('\nCloud Serverless Backend -> http://localhost:3001'));
}

export default app;

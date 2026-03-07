import express, { Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { supabase } from '../services/supabase';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      registration,
      eventName,
      eventDateLabel,
      eventTimeLabel,
      venueLabel 
    } = req.body;

    if (!registration || !registration.leaderEmail) {
      res.status(400).json({ status: 'failed', message: 'Missing leaderEmail in payload.' });
      return;
    }

    // 1. Insert into Supabase `registrations` table
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
        status: 'Confirmed'
      })
      .select('id')
      .single();

    if (regError) {
      console.error('Supabase Registration Insert Error:', regError);
      
      // Specifically handle unique constraint duplicate registrations
      if (regError.code === '23505') {
         res.status(400).json({ 
          status: 'duplicate', 
          message: 'A registration for this team already exists in the cloud.' 
        });
        return;
      }
      throw new Error(`DB Reg Insert Failed: ${regError.message}`);
    }

    const dbRegistrationId = regInsert.id;

    // 2. Insert into Supabase `team_members` table
    if (registration.members && registration.members.length > 0) {
      const memberInserts = registration.members.map((m: any) => ({
        registration_id: dbRegistrationId,
        name: m.name,
        email: m.email,
        college: m.college
      }));

      const { error: memberError } = await supabase
        .from('team_members')
        .insert(memberInserts);

      if (memberError) {
        console.error('Supabase Member Insert Error:', memberError);
      }
    }

    // 3. Build and Fire HTML Confirmation Email via Nodemailer
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'TechnoFest 2026'}" <${process.env.SMTP_USER}>`,
      to: registration.leaderEmail,
      subject: `[CONFIRMED] Technofest 2026: ${eventName} Registration`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b; text-transform: uppercase; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">MISSION SECURED</h1>
          
          <p style="font-size: 16px;">Agent <strong>${registration.leaderName}</strong>,</p>
          <p style="font-size: 16px;">Your squad <strong>[${registration.teamName}]</strong> has been successfully registered for <strong>${eventName}</strong> via Cloud DB Sync.</p>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>📍 VENUE:</strong> ${venueLabel}</p>
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>📅 SECURE DATE:</strong> ${eventDateLabel}</p>
            <p style="margin: 5px 0; color: #0ea5e9;"><strong>⏰ INFILTRATION TIME:</strong> ${eventTimeLabel}</p>
            <p style="margin: 5px 0; color: #a855f7;"><strong>🔑 TRACKING REF:</strong> ${registration.id}</p>
          </div>
          
          <p style="font-size: 14px; color: #9ca3af;">Prepare your equipment and brief your squad. Further intelligence will follow closer to drop day.</p>
          
          <br/>
          <p style="font-size: 12px; color: #6b7280; font-family: monospace;">This is an automated encrypted dispatch from the TechnoFest 2026 Mainframe.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[HTTP 200] 📩 Secured Registration & Mailed -> ${registration.leaderEmail}`);
      res.json({ status: 'confirmed', registrationId: registration.id });
    } catch (emailError: any) {
      console.error(`[EMAIL FAIL] Could not send to ${registration.leaderEmail}:`, emailError.message);
      res.json({ 
        status: 'confirmed', 
        registrationId: registration.id,
        message: 'Saved to Database. Check spam or valid email format for confirmation.'
      });
    }

  } catch (error: any) {
    console.error('[HTTP 500] Critical API Server Error:', error.message);
    res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
  }
});

// GET endpoint for Admin Dashboard to securely pull raw data instantly
app.get('/api/registrations', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        team_members (
          name,
          email,
          college
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching registrations:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => console.log('\n🚀 Cloud Serverless Backend → http://localhost:3001'));
}

export default app;

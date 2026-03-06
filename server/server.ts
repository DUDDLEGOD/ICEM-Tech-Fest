import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/register', async (req, res) => {
  const payload = req.body;
  console.log('\n--- NEW REGISTRATION REQUEST ---');
  console.log('Incoming Payload:', JSON.stringify(payload, null, 2));

  try {
    if (!payload || !payload.registration) {
      throw new Error('Invalid payload structure: missing "registration" object');
    }

    if (!payload.registration.leaderEmail) {
      throw new Error(`Invalid payload structure: missing leaderEmail. Found: ${JSON.stringify(payload.registration)}`);
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'TechnoFest 2026'}" <${process.env.SMTP_USER}>`,
      to: payload.registration.leaderEmail,
      subject: `Registration Confirmed: ${payload.eventName} - TechnoFest 2026`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#050505;color:#fff;border:1px solid #06b6d4;border-radius:10px">
          <h2 style="color:#06b6d4">Registration Confirmed</h2>
          <p>Hello <strong>${payload.registration.leaderName}</strong>,</p>
          <p>Your team <strong>${payload.registration.teamName}</strong> is registered for <strong>${payload.eventName}</strong>.</p>
          <div style="background:#111;padding:15px;border-left:4px solid #f59e0b;margin:20px 0">
            <p>📅 ${payload.eventDateLabel} &nbsp; ⏰ ${payload.eventTimeLabel} &nbsp; 📍 ${payload.venueLabel}</p>
          </div>
          <p>ID: <span style="color:#f59e0b;font-family:monospace">${payload.registration.id}</span></p>
        </div>
      `
    });
    console.log(`✅ Email sent successfully to ${payload.registration.leaderEmail} | Message ID: ${info.messageId}`);
    res.json({ status: 'confirmed', registrationId: payload.registration.id, message: 'Email sent.' });
  } catch (err: any) {
    console.error('❌ SMTP Error inside /api/register:', err.message || err);
    res.status(500).json({ 
      status: 'queued', 
      registrationId: payload?.registration?.id || 'UNKNOWN', 
      message: 'Email delivery failed. Saved locally.' 
    });
  }
});

app.listen(3001, () => console.log('\n🚀 SMTP Backend → http://localhost:3001'));

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('❌ ERROR: Missing SMTP credentials in .env file!');
  console.error('Make sure SMTP_USER and SMTP_PASS are set.');
  process.exit(1);
}

// Create the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

async function testEmail() {
  console.log(`\n⏳ Attempting to connect to Gmail as: ${SMTP_USER}...`);
  
  try {
    // 1. Verify the connection configuration
    await transporter.verify();
    console.log('✅ Connection successful. Credentials are valid!');

    // 2. Send a test email
    console.log(`\n📤 Sending test email to ${SMTP_USER}...`);
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'TechnoFest 2026 Test'}" <${SMTP_USER}>`,
      to: SMTP_USER, // Send it to yourself for testing
      subject: '✅ TechnoFest 2026: Successful Email Test',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#050505;color:#fff;border:1px solid #06b6d4;border-radius:10px">
          <h2 style="color:#06b6d4">It works!</h2>
          <p>If you are reading this, your Nodemailer Gmail connection is perfectly configured.</p>
          <p>Your backend registration server is ready to send automated emails.</p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log('\n🎉 You are good to go! Check your inbox.');

  } catch (error: any) {
    console.error('\n❌ FAILED TO SEND EMAIL:');
    console.error(error.message);
    
    // Provide helpful debugging tips based on the error
    if (error.message.includes('Username and Password not accepted')) {
      console.log('\n💡 TIPS TO FIX:');
      console.log('1. Are you using a normal Gmail password? You MUST use an "App Password".');
      console.log('2. Go to your Google Account -> Security -> 2-Step Verification.');
      console.log('3. Scroll down to "App Passwords" and generate a new one for "Mail".');
      console.log('4. Copy that 16-letter password into your .env file as SMTP_PASS without spaces.');
    }
  }
}

testEmail();

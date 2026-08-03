import { env } from './src/config/env.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function test() {
  try {
    console.log('Testing SMTP connection with:');
    console.log('HOST:', env.SMTP_HOST);
    console.log('PORT:', env.SMTP_PORT);
    console.log('USER:', env.SMTP_USER);
    console.log('PASS:', env.SMTP_PASS ? '***' + env.SMTP_PASS.slice(-4) : 'MISSING');
    
    await transporter.verify();
    console.log('Server is ready to take our messages');
    
    const info = await transporter.sendMail({
      from: env.FROM_EMAIL,
      to: env.SMTP_USER, // Send to self
      subject: 'Test Email',
      text: 'This is a test email from the Mhatre Traders backend.'
    });
    console.log('Test email sent successfully!', info.messageId);
  } catch (err) {
    console.error('SMTP Error:', err);
  }
}

test().catch(console.error).finally(() => process.exit(0));

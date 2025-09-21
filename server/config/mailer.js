// config/mailer.js
const nodemailer = require('nodemailer');

// Create transporter with Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App password for Gmail
    }
  });
};

// Generate 4-digit alphanumeric OTP
const generateOTP = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
};

// Send verification email
const sendVerificationEmail = async (email, otp, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Odyssey Authority Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification - Odyssey Authority Portal',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a, #1e1b4b); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #60a5fa; margin-bottom: 10px;">🛡️ Odyssey Authority Portal</h1>
          <h2 style="color: white; margin: 0;">Email Verification</h2>
        </div>

        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0;">Hello <strong>${fullName}</strong>,</p>
          <p style="margin: 0 0 15px 0;">Thank you for registering with the Odyssey Authority Portal. To complete your registration, please verify your email address.</p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 15px 30px; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-size: 14px; color: #e2e8f0;">Your verification code is:</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: white;">${otp}</p>
            </div>
          </div>

          <p style="margin: 15px 0 0 0; color: #cbd5e1;">This code will expire in 10 minutes for security purposes.</p>
        </div>

        <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #93c5fd; font-size: 14px;">
            ⚠️ If you didn't request this verification, please ignore this email.
          </p>
        </div>

        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">© 2024 Odyssey Authority Portal. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendVerificationEmail
};
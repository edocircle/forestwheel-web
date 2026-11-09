import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false, // TLS
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send user activation email
 */
export async function sendActivationEmail(email, fullName, activationToken) {
  const activationUrl = `${env.ADMIN_URL}/activate/${activationToken}`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #F68E13; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Forest Wheel</h1>
        <p style="color: #857365; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;">Management Portal</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 40px; border: 1px solid #e5e2e1;">
        <h2 style="color: #1c1b1b; font-size: 24px; margin-bottom: 16px;">Welcome, ${fullName}!</h2>
        <p style="color: #554335; font-size: 16px; line-height: 1.6;">
          You've been invited to join the Forest Wheel Management Portal. Click the button below to activate your account and set your password.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${activationUrl}" style="display: inline-block; background: #F68E13; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
            Activate Account
          </a>
        </div>
        <p style="color: #857365; font-size: 12px; line-height: 1.6;">
          This link will expire in 48 hours. If you didn't expect this invitation, please ignore this email.
        </p>
      </div>
      <p style="text-align: center; color: #857365; font-size: 11px; margin-top: 24px;">
        © ${new Date().getFullYear()} Forest Wheel. All rights reserved.
      </p>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Activate Your Forest Wheel Account',
      html,
    });
    console.log(`Activation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send activation email:', error.message);
    // In development, log the activation URL so you can still test
    if (env.NODE_ENV === 'development') {
      console.log(`[DEV] Activation URL: ${activationUrl}`);
    }
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, fullName, resetToken) {
  const resetUrl = `${env.ADMIN_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #F68E13; font-size: 28px; font-weight: 900;">Forest Wheel</h1>
      </div>
      <div style="background: white; border-radius: 12px; padding: 40px; border: 1px solid #e5e2e1;">
        <h2 style="color: #1c1b1b; font-size: 24px; margin-bottom: 16px;">Password Reset</h2>
        <p style="color: #554335; font-size: 16px; line-height: 1.6;">
          Hi ${fullName}, we received a request to reset your password. Click below to set a new one.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #F68E13; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
            Reset Password
          </a>
        </div>
        <p style="color: #857365; font-size: 12px;">This link expires in 1 hour.</p>
      </div>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Forest Wheel Password',
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    if (env.NODE_ENV === 'development') {
      console.log(`[DEV] Reset URL: ${resetUrl}`);
    }
    return false;
  }
}

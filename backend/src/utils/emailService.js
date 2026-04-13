const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

// Mailgun configuration (lazy initialization)
let transporter = null;
const isMailgunConfigured = () => !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);

function getTransporter() {
  if (transporter) return transporter;
  if (!isMailgunConfigured()) return null;

  transporter = nodemailer.createTransport(
    mailgunTransport({
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
    })
  );
  return transporter;
}

/**
 * Sends a password reset email to an admin.
 * @param {string} email - The admin's email address.
 * @param {string} resetToken - The unique reset token.
 */
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;
  console.log(`[DEBUG] emailService: Preparing reset link for ${email}`);
  const mailgun = getTransporter();

  if (!mailgun) {
    console.log(`[DEBUG] emailService: No Mailgun config found. Falling back to MOCK MODE.`);
    console.log('\n--- 🔑 PASSWORD RESET LINK (MOCK MODE) ---');
    console.log(`To: ${email}`);
    console.log(`URL: ${resetUrl}`);
    console.log('-------------------------------------------\n');
    return { mock: true, messageId: 'mock-id' };
  }

  const mailOptions = {
    from: `"Ufedmill Admin" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: 'Password Reset Request — Ufedmill',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
        <h2 style="color: #0c1b4d;">Password Reset Request</h2>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the button below, or paste the link into your browser to complete the process within one hour of receiving it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #ffb400; color: #0c1b4d; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 11px; color: #666;">This is an automated message from the Ufedmill Logistics Platform.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Failed to send password reset email:', err);
    throw new Error('Email delivery failed.');
  }
}

module.exports = { sendPasswordResetEmail };

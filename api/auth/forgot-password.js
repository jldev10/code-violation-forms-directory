import { query } from '../db.js';
import crypto from 'crypto';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@jldev.10'; // Placeholder
const SENDER_NAME = 'Code Violation Forms Directory';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // 1. Check if user exists
    const userResult = await query('SELECT id, first_name FROM user_profiles WHERE email = $1', [email.toLowerCase()]);
    const user = userResult.rows[0];

    // Standard security: don't reveal if user exists
    const successMsg = { message: 'If an account exists with that email, a password reset link has been sent.' };

    if (!user) {
      return res.status(200).json(successMsg);
    }

    // 2. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // 3. Store token
    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // 4. Send email via Brevo
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

    const emailBody = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email, name: user.first_name || 'User' }],
      subject: 'Reset Your Password - Code Violation Forms Directory',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #10b981; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              margin: 20px 0;
            }
            .footer { font-size: 12px; color: #94a3b8; margin-top: 40px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #0f172a;">Password Reset Request</h1>
            </div>
            <p>Hello ${user.first_name || 'there'},</p>
            <p>We received a request to reset your password for the Code Violation Forms Directory. Click the button below to choose a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <div class="footer">
              <p>&copy; 2026 Code Violation Forms Directory. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('Attempting to send email via Brevo...');
    console.log('Sender:', SENDER_EMAIL);
    console.log('API Key present:', !!BREVO_API_KEY);

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailBody)
    });

    const responseData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('Brevo Error:', responseData);
      // If it's a 401 from Brevo (invalid API key), we return it as a 500 to the frontend
      // to avoid triggering the global 401 -> redirect-to-home logic in apiClient.js
      const status = brevoResponse.status === 401 ? 500 : brevoResponse.status;
      return res.status(status).json({ 
        error: 'Brevo API Error', 
        details: responseData,
        sender: SENDER_EMAIL
      });
    }

    console.log('Brevo Email Sent successfully:', responseData);
    return res.status(200).json({ ...successMsg, brevoId: responseData.messageId });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
  }
}

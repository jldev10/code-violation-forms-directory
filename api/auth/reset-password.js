import { query } from '../db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // 1. Verify token
    const tokenResult = await query(
      'SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = $1',
      [token]
    );
    const resetToken = tokenResult.rows[0];

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (resetToken.used) {
      return res.status(400).json({ error: 'Token has already been used' });
    }

    if (new Date() > new Date(resetToken.expires_at)) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // 2. Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Update user password and mark token as used in a transaction
    // Using simple queries for now, but we'll run them sequentially
    await query('BEGIN');
    try {
      await query(
        'UPDATE user_profiles SET password_hash = $1, updated_date = NOW() WHERE id = $2',
        [passwordHash, resetToken.user_id]
      );
      await query(
        'UPDATE password_reset_tokens SET used = TRUE WHERE id = $1',
        [resetToken.id]
      );
      await query('COMMIT');
    } catch (e) {
      await query('ROLLBACK');
      throw e;
    }

    return res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

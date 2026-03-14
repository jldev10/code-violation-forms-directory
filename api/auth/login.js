import { query } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await query('SELECT * FROM user_profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.approval_status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending approval. We are reviewing your details and will email you once access is granted.' });
    }
    if (user.approval_status === 'declined') {
      return res.status(403).json({ error: 'Access declined. To log in, you must first enroll in Gov List Millionaire at Wholesailors Academy on Skool.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Don't send the password hash back
    const { password_hash, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { userId: user.id, email: user.email, admin: user.admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

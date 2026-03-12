import { query } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { first_name, last_name, email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Valid email and password (min 6 chars) are required' });
  }

  try {
    // Check if user exists
    const existing = await query('SELECT id FROM user_profiles WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await query(
      'INSERT INTO user_profiles (id, first_name, last_name, email, admin, password_hash) VALUES (gen_random_uuid(), $1, $2, $3, 0, $4) RETURNING id, first_name, last_name, email, admin',
      [first_name, last_name, email, passwordHash]
    );

    const user = result.rows[0];

    // Auto-login
    const token = jwt.sign(
      { userId: user.id, email: user.email, admin: user.admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

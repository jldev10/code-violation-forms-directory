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
    // Check if email is banned
    const bannedRes = await query('SELECT email FROM banned_emails WHERE email = $1', [email]);
    if (bannedRes.rows.length > 0) {
      return res.status(403).json({ error: 'Account can not be created at this time' });
    }

    // Check if user exists
    const existing = await query('SELECT id FROM user_profiles WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user with default pending status
    const result = await query(
      'INSERT INTO user_profiles (id, first_name, last_name, email, admin, password_hash, approval_status) VALUES (gen_random_uuid(), $1, $2, $3, 0, $4, \'pending\') RETURNING id, first_name, last_name, email, admin, approval_status',
      [first_name, last_name, email, passwordHash]
    );

    const user = result.rows[0];

    // Auto-login is removed because standard users need admin approval first
    res.status(201).json({ 
      message: 'Account created successfully. It is pending admin approval.', 
      user 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

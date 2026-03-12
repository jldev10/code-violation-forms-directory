import { query } from '../../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// Middleware to verify admin status
async function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.admin !== 1) {
      res.status(403).json({ error: 'Admin access required' });
      return null;
    }
    return decoded;
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

export default async function handler(req, res) {
  const adminUser = await verifyAdmin(req, res);
  if (!adminUser) return;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT id, first_name, last_name, email, admin FROM user_profiles ORDER BY first_name ASC');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'POST') {
    const { first_name, last_name, email, admin, password = 'password' } = req.body; // Default password if none provided
    
    try {
      // Basic validation
      if (!email) return res.status(400).json({ error: 'Email is required' });

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const result = await query(
        'INSERT INTO user_profiles (id, first_name, last_name, email, admin, password_hash) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, admin',
        [first_name, last_name, email, admin || 0, passwordHash]
      );
      
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') { // postgres unique violation
         return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

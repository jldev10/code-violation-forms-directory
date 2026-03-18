import { query } from '../db.js';
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
      const result = await query('SELECT email, created_at FROM banned_emails ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching banned emails:', error);
      return res.status(500).json({ error: 'Failed to fetch banned emails' });
    }
  }

  if (req.method === 'DELETE') {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const result = await query('DELETE FROM banned_emails WHERE email = $1 RETURNING email', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Email not found in ban list' });
      }
      return res.status(200).json({ success: true, email: result.rows[0].email });
    } catch (error) {
      console.error('Error unbanning email:', error);
      return res.status(500).json({ error: 'Failed to unban email' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

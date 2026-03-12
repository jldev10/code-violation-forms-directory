import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

  const id = req.query.id; // Extract ID from URL path (e.g., /api/users/123 -> req.query.id)
  
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'PUT') {
    const { first_name, last_name, email, admin, password } = req.body;
    
    try {
      let result;
      
      if (password) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
         result = await query(
          'UPDATE user_profiles SET first_name = $1, last_name = $2, email = $3, admin = $4, password_hash = $5 WHERE id = $6 RETURNING id, first_name, last_name, email, admin',
          [first_name, last_name, email, admin, passwordHash, id]
        );
      } else {
        result = await query(
          'UPDATE user_profiles SET first_name = $1, last_name = $2, email = $3, admin = $4 WHERE id = $5 RETURNING id, first_name, last_name, email, admin',
          [first_name, last_name, email, admin, id]
        );
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
       console.error('Error updating user:', error);
       if (error.code === '23505') { 
         return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Prevent deleting yourself to avoid lockouts
      if (id === adminUser.userId) {
         return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const result = await query('DELETE FROM user_profiles WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

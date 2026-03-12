import { query } from '../../db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

async function verifyUser(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

export default async function handler(req, res) {
  const user = await verifyUser(req, res);
  if (!user) return;

  const id = req.query.id; 
  
  if (!id) {
    return res.status(400).json({ error: 'Lead ID is required' });
  }

  if (req.method === 'DELETE') {
    try {
      const result = await query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Error deleting lead:', error);
      return res.status(500).json({ error: 'Failed to delete lead' });
    }
  }

  // Add PUT/UPDATE here in the future if Lead editing becomes a feature

  return res.status(405).json({ error: 'Method not allowed' });
}

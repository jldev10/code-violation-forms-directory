import { query } from '../../db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// Middleware to verify user is authenticated (regular user or admin)
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

  if (req.method === 'GET') {
    try {
      // In a real app, you'd want pagination (limit/offset) from req.query
      // For this migration, we'll return all and let the frontend paginate like it currently does for simplicity,
      // or implement basic DB-level pagination if the list gets too large.
      const result = await query('SELECT * FROM leads ORDER BY created_date DESC');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  if (req.method === 'POST') {
    // Handle both single lead creation and batch creation
    const data = req.body;
    
    try {
      if (Array.isArray(data)) {
        // Batch insert
        // Using a transaction for batch inserts
         const client = await (await import('../../db.js')).getPool().connect();
         try {
           await client.query('BEGIN');
           
           const results = [];
           for (const lead of data) {
               const { address, city, market, tags } = lead;
               const result = await client.query(
                   'INSERT INTO leads (id, address, city, market, tags, created_date) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()) RETURNING *',
                   [address, city, market, JSON.stringify(tags || [])]
               );
               results.push(result.rows[0]);
           }
           
           await client.query('COMMIT');
           return res.status(201).json(results);
         } catch (e) {
           await client.query('ROLLBACK');
           throw e;
         } finally {
           client.release();
         }
      } else {
        // Single insert
        const { address, city, market, tags } = data;
        const result = await query(
          'INSERT INTO leads (id, address, city, market, tags, created_date) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()) RETURNING *',
          [address, city, market, JSON.stringify(tags || [])] // Store tags as JSON array
        );
        return res.status(201).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error creating lead(s):', error);
      return res.status(500).json({ error: 'Failed to create lead(s)' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

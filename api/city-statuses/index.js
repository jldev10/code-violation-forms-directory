import { query } from '../db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// Ensure the city_statuses table exists
async function ensureTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS city_statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        state_id INTEGER NOT NULL,
        city_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'neutral',
        status_timestamp TIMESTAMP WITH TIME ZONE,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, state_id, city_name)
      );
    `);
  } catch (e) {
    // Table likely already exists or foreign key ref issue; 
    // log but don't block
    console.warn('[city-statuses] ensureTable warning:', e.message);
  }
}

// Middleware to verify user is authenticated
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

  // Auto-create table on first request
  await ensureTable();

  if (req.method === 'GET') {
    try {
      console.log('[city-statuses] GET request from user:', user.id);
      const result = await query(
        'SELECT * FROM city_statuses WHERE user_id = $1 ORDER BY updated_date DESC',
        [user.id]
      );
      console.log('[city-statuses] Returning', result.rows.length, 'rows');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching city statuses:', error);
      return res.status(500).json({ error: 'Failed to fetch city statuses', details: error.message });
    }
  }

  if (req.method === 'POST') {
    const data = req.body;
    
    try {
      if (Array.isArray(data)) {
        // Bulk upsert (used for initial migration from localStorage)
        const client = await (await import('../db.js')).getPool().connect();
        try {
          await client.query('BEGIN');
          
          const results = [];
          for (const item of data) {
            const { state_id, city_name, status, status_timestamp } = item;
            const result = await client.query(
              `INSERT INTO city_statuses (id, user_id, state_id, city_name, status, status_timestamp, created_date, updated_date) 
               VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) 
               ON CONFLICT (user_id, state_id, city_name) 
               DO UPDATE SET status = EXCLUDED.status, status_timestamp = EXCLUDED.status_timestamp, updated_date = NOW() 
               RETURNING *`,
              [user.id, state_id, city_name, status, status_timestamp || null]
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
        // Single update
        const { state_id, city_name, status, status_timestamp } = data;
        console.log('[city-statuses] POST single update:', { user_id: user.id, state_id, city_name, status });
        
        let result;
        if (status === 'neutral') {
          // If returning to neutral, clear it to save space (or delete it)
          result = await query(
            'DELETE FROM city_statuses WHERE user_id = $1 AND state_id = $2 AND city_name = $3 RETURNING *',
            [user.id, state_id, city_name]
          );
          console.log('[city-statuses] Deleted neutral status');
        } else {
          result = await query(
            `INSERT INTO city_statuses (id, user_id, state_id, city_name, status, status_timestamp, created_date, updated_date) 
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) 
             ON CONFLICT (user_id, state_id, city_name) 
             DO UPDATE SET status = EXCLUDED.status, status_timestamp = EXCLUDED.status_timestamp, updated_date = NOW() 
             RETURNING *`,
            [user.id, state_id, city_name, status, status_timestamp || null]
          );
          console.log('[city-statuses] Upserted:', result.rows[0]?.id);
        }
        return res.status(200).json(result.rows[0] || { deleted: true });
      }
    } catch (error) {
      console.error('Error saving city status:', error);
      return res.status(500).json({ error: 'Failed to save city status', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

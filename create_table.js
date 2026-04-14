import { query } from './api/db.js';

async function createTable() {
  try {
    const tableSql = `
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
      CREATE INDEX IF NOT EXISTS idx_city_statuses_user_id ON city_statuses(user_id);
    `;
    await query(tableSql);
    console.log('Table city_statuses created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

createTable();

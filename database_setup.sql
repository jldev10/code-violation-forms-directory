-- ============================================================
-- Neon Database Setup Script
-- Code Violation Forms Directory
-- Run this once in your Neon SQL Editor to set up all tables
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- TABLE: user_profiles
-- Stores admin and regular users with hashed passwords
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    admin INTEGER DEFAULT 0,        -- 1 = admin, 0 = regular user
    password_hash VARCHAR(255) NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by email (used in login)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);


-- ============================================================
-- TABLE: leads
-- Stores property leads with addresses, tags, and tag dates
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address VARCHAR(500) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(100),
    zip VARCHAR(20),
    market VARCHAR(255),
    tags TEXT[],            -- Array of tag strings e.g. ['Code Violations', 'Tax Liens']
    tag_dates JSONB,        -- Map of tag -> date e.g. {"Code Violations": "2025-01-15"}
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast address lookups (used in dedup during CSV upload)
CREATE INDEX IF NOT EXISTS idx_leads_address ON leads(lower(address));
CREATE INDEX IF NOT EXISTS idx_leads_market ON leads(market);
CREATE INDEX IF NOT EXISTS idx_leads_created_date ON leads(created_date DESC);


-- ============================================================
-- OPTIONAL: Create your first admin user
-- Replace these values with real credentials before running
-- NOTE: The password_hash below is a bcrypt hash of 'changeme123'
--       You should use the Admin Dashboard to set a proper password
--       OR use the /api/auth/register endpoint to create the first user
--       and then manually update admin = 1 for that user.
-- ============================================================

-- Example: Manually insert an admin user (uncomment and edit before running)
-- INSERT INTO user_profiles (first_name, last_name, email, admin, password_hash)
-- VALUES (
--     'Admin',
--     'User',
--     'admin@yourdomain.com',
--     1,
--     '$2b$10$Xt9i8.SrVAFMqSwWvT/Kc.aDVPX9vl2HYqT5G3rNxPz0.VcM2JuQ2'  -- bcrypt of 'changeme123'
-- );

-- After inserting, immediately log into the Admin Dashboard and change the password!

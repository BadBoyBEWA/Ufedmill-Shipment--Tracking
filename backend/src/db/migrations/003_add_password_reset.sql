-- ============================================================
-- Kinetic Authority Shipment Tracker — Password Reset Migration
-- Run: psql -d shipment_db -f src/db/migrations/003_add_password_reset.sql
-- ============================================================

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_admins_reset_token ON admins(reset_password_token);

-- ============================================================
-- Kinetic Authority — Add Customer Details and Chat System
-- ============================================================

-- 1. Add sender_name and receiver_name to shipments
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_name VARCHAR(255);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255);

-- 2. Create messages table for live chat
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR(50) NOT NULL, -- The chat identifier (user_id)
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'admin')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexing for chat performance
CREATE INDEX IF NOT EXISTS idx_messages_tracking_id ON messages(tracking_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

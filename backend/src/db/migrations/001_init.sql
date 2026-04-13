-- ============================================================
-- Kinetic Authority Shipment Tracker — Initial Migration
-- Run: psql -d shipment_db -f src/db/migrations/001_init.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SHIPMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    reference_number VARCHAR(100),
    shipping_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'in_transit',
    -- Each history entry: {"status":"in_transit","timestamp":"2024-01-01T00:00:00Z","location":"Warehouse A"}
    status_history JSONB DEFAULT '[]',
    estimated_delivery_date DATE,
    created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ADMIN SESSIONS (refresh tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ADMIN ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id     ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_reference_number ON shipments(reference_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status           ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_shipping_type    ON shipments(shipping_type);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at       ON shipments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token       ON admin_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires     ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_admin         ON admin_activity_log(admin_id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

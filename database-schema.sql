-- Supabase Database Schema for Goldmine Pro

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    total_invested DECIMAL(15, 2) DEFAULT 0.00,
    total_withdrawn DECIMAL(15, 2) DEFAULT 0.00,
    referred_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(20) PRIMARY KEY,  -- Using a simple ID instead of UUID
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    daily_income DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Plans table (to track purchased plans)
CREATE TABLE IF NOT EXISTS user_plans (
    id VARCHAR(20) PRIMARY KEY,  -- Using a simple ID instead of UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(20) NOT NULL REFERENCES plans(id),
    plan_name VARCHAR(255) NOT NULL,
    plan_price DECIMAL(10, 2) NOT NULL,
    daily_income DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(20) PRIMARY KEY,  -- Using a simple ID instead of UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- plan_purchase, recharge, withdrawal, daily_income
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference_id VARCHAR(20), -- ID of the related record (plan, recharge, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recharges table
CREATE TABLE IF NOT EXISTS recharges (
    id VARCHAR(20) PRIMARY KEY,  -- Using a simple ID instead of UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    utr VARCHAR(100) NOT NULL, -- Unique Transaction Reference
    payment_method VARCHAR(20) DEFAULT 'upi',
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id VARCHAR(20) PRIMARY KEY,  -- Using a simple ID instead of UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL, -- original amount before GST
    net_amount DECIMAL(10, 2) NOT NULL, -- amount after GST
    gst_amount DECIMAL(10, 2) NOT NULL, -- GST amount (18%)
    method VARCHAR(20) NOT NULL, -- bank, upi
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    ifsc_code VARCHAR(50),
    account_number VARCHAR(50),
    upi_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_status ON user_plans(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_recharges_user_id ON recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_recharges_status ON recharges(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Insert default investment plans
INSERT INTO plans (id, name, price, daily_income, duration_days, total_return) VALUES
('plan1', 'Starter Plan', 500.00, 50.00, 10, 650.00),
('plan2', 'Growth Plan', 1000.00, 120.00, 10, 2200.00),
('plan3', 'Premium Plan', 5000.00, 700.00, 15, 15500.00),
('plan4', 'Elite Plan', 10000.00, 1600.00, 20, 42000.00)
ON CONFLICT (id) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recharges_updated_at BEFORE UPDATE ON recharges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
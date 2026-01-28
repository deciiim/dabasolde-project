-- Create Recharge Configuration Table
-- This table stores availability settings for operators and their recharge types

CREATE TABLE IF NOT EXISTS "RechargeConfig" (
  id SERIAL PRIMARY KEY,
  operator VARCHAR(50) NOT NULL,           -- 'inwi' or 'orange'
  "rechargeCode" VARCHAR(50),              -- '*1', '*3', etc. NULL means entire operator
  "isAvailable" BOOLEAN DEFAULT true,      -- true = available, false = disabled
  "disabledReason" TEXT,                   -- Optional reason for disabling
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "updatedBy" VARCHAR(255),                -- Admin who made the change
  
  -- Ensure unique combinations
  UNIQUE(operator, "rechargeCode")
);

-- Create index for faster queries
CREATE INDEX idx_recharge_config_operator ON "RechargeConfig"(operator);
CREATE INDEX idx_recharge_config_available ON "RechargeConfig"("isAvailable");

-- Insert default configurations (all available by default)
-- Operator-level configs (NULL rechargeCode means entire operator)
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
VALUES 
  ('inwi', NULL, true),
  ('orange', NULL, true)
ON CONFLICT (operator, "rechargeCode") DO NOTHING;

-- Inwi recharge types
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
VALUES 
  ('inwi', '*1', true),
  ('inwi', '*2', true),
  ('inwi', '*3', true),
  ('inwi', '*4', true),
  ('inwi', '*5', true),
  ('inwi', '*6', true),
  ('inwi', '*7', true),
  ('inwi', '*8', true),
  ('inwi', '*33', true),
  ('inwi', '*77', true)
ON CONFLICT (operator, "rechargeCode") DO NOTHING;

-- Orange recharge types
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
VALUES 
  ('orange', '*1', true),
  ('orange', '*3', true),
  ('orange', '*4', true),
  ('orange', '*5', true),
  ('orange', '*6', true),
  ('orange', '*8', true),
  ('orange', 'x25', true)
ON CONFLICT (operator, "rechargeCode") DO NOTHING;

COMMENT ON TABLE "RechargeConfig" IS 'Stores availability configuration for recharge operators and types';
COMMENT ON COLUMN "RechargeConfig"."rechargeCode" IS 'NULL means entire operator, specific code means individual recharge type';

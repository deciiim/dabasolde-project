-- ====================================================================
-- MASTER DATABASE INITIALIZATION SCRIPT FOR DABASOLDE
-- This script creates all tables and inserts initial data.
-- Run this in your Neon SQL Editor to set up the entire database from scratch.
-- ====================================================================

-- ============================================
-- 1. DROP EXISTING TABLES (OPTIONAL - Uncomment if you want a fresh start)
-- WARNING: THIS WILL DELETE ALL DATA
-- ============================================
-- DROP TABLE IF EXISTS "RechargeConfig";
-- DROP TABLE IF EXISTS "Order";
-- DROP TABLE IF EXISTS "Plan";

-- ============================================
-- 2. CREATE PLAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS "Plan" (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL,
  "discountPercent" NUMERIC DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Plan
CREATE INDEX IF NOT EXISTS idx_plan_active ON "Plan"("isActive");
CREATE INDEX IF NOT EXISTS idx_plan_amount ON "Plan"(amount);

-- Insert default plans with 12% discount
INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 100, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 100);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 200, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 200);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 300, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 300);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 500, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 500);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 1000, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 1000);

-- Update existing plans to 12% just in case they exist with old values
UPDATE "Plan" SET "discountPercent" = 12 WHERE "discountPercent" != 12;


-- ============================================
-- 3. CREATE ORDER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS "Order" (
  id SERIAL PRIMARY KEY,
  "shortRef" VARCHAR(20) UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  phone VARCHAR(20) NOT NULL,
  "recipientPhone" VARCHAR(20),
  "fullName" VARCHAR(100) NOT NULL,
  "paymentMethod" VARCHAR(20) NOT NULL,
  bank VARCHAR(50),
  "receiptImage" VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING',
  "productType" VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Order
CREATE INDEX IF NOT EXISTS idx_order_shortref ON "Order"("shortRef");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);
CREATE INDEX IF NOT EXISTS idx_order_createdat ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_order_producttype ON "Order"("productType");
CREATE INDEX IF NOT EXISTS idx_order_recipientphone ON "Order"("recipientPhone");


-- ============================================
-- 4. CREATE RECHARGE CONFIG TABLE
-- ============================================
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

-- Indexes for RechargeConfig
CREATE INDEX IF NOT EXISTS idx_recharge_config_operator ON "RechargeConfig"(operator);
CREATE INDEX IF NOT EXISTS idx_recharge_config_available ON "RechargeConfig"("isAvailable");

-- Clean up any potential duplicates before seeding (if table exists and has data)
DELETE FROM "RechargeConfig" a 
USING "RechargeConfig" b 
WHERE a.id < b.id 
  AND a.operator = b.operator 
  AND (
      (a."rechargeCode" = b."rechargeCode") 
      OR 
      (a."rechargeCode" IS NULL AND b."rechargeCode" IS NULL)
  );

-- Insert Operator Level Configs (Safe Insert using WHERE NOT EXISTS)
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable")
SELECT 'inwi', NULL, true
WHERE NOT EXISTS (SELECT 1 FROM "RechargeConfig" WHERE operator = 'inwi' AND "rechargeCode" IS NULL);

INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable")
SELECT 'orange', NULL, true
WHERE NOT EXISTS (SELECT 1 FROM "RechargeConfig" WHERE operator = 'orange' AND "rechargeCode" IS NULL);

-- Insert Inwi Recharge Types
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable")
SELECT 'inwi', code, true 
FROM (VALUES 
  ('*1'), ('*2'), ('*3'), ('*4'), ('*5'), ('*6'), 
  ('*7'), ('*8'), ('*9'), ('*22'), ('*33'), ('*77')
) AS t(code)
WHERE NOT EXISTS (SELECT 1 FROM "RechargeConfig" WHERE operator = 'inwi' AND "rechargeCode" = t.code);

-- Insert Orange Recharge Types
INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable")
SELECT 'orange', code, true 
FROM (VALUES 
  ('*1'), ('*2'), ('*3'), ('*4'), ('*5'), ('*6'), 
  ('*7'), ('*8'), ('*22'), ('*33'), ('*77'), ('Multiple X25'), ('x25')
) AS t(code)
WHERE NOT EXISTS (SELECT 1 FROM "RechargeConfig" WHERE operator = 'orange' AND "rechargeCode" = t.code);

-- ============================================
-- 5. VERIFICATION
-- ============================================
SELECT 'Tables Created:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

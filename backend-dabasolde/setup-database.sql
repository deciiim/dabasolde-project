-- Complete Database Setup for DabaSolde Application
-- Run this in your Neon database console (https://console.neon.tech)

-- ============================================
-- 1. CREATE PLAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS "Plan" (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL,
  "discountPercent" NUMERIC DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans (if they don't exist)
INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 100, 5, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 100);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 200, 7, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 200);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 500, 10, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 500);

INSERT INTO "Plan" (amount, "discountPercent", "isActive")
SELECT 1000, 12, true WHERE NOT EXISTS (SELECT 1 FROM "Plan" WHERE amount = 1000);

-- ============================================
-- 2. CREATE ORDER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS "Order" (
  id SERIAL PRIMARY KEY,
  "shortRef" VARCHAR(20) UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  phone VARCHAR(20) NOT NULL,
  "fullName" VARCHAR(100) NOT NULL,
  "paymentMethod" VARCHAR(20) NOT NULL,
  bank VARCHAR(50),
  "receiptImage" VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING',
  "productType" VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Plan table indexes
CREATE INDEX IF NOT EXISTS idx_plan_active ON "Plan"("isActive");
CREATE INDEX IF NOT EXISTS idx_plan_amount ON "Plan"(amount);

-- Order table indexes
CREATE INDEX IF NOT EXISTS idx_order_shortref ON "Order"("shortRef");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);
CREATE INDEX IF NOT EXISTS idx_order_createdat ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_order_producttype ON "Order"("productType");

-- ============================================
-- 4. VERIFY TABLES WERE CREATED
-- ============================================

-- Check Plan table
SELECT 'Plan Table Columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Plan'
ORDER BY ordinal_position;

-- Check Order table
SELECT 'Order Table Columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Order'
ORDER BY ordinal_position;

-- Check data
SELECT 'Plans Count:' as info, COUNT(*) as count FROM "Plan";
SELECT 'Orders Count:' as info, COUNT(*) as count FROM "Order";

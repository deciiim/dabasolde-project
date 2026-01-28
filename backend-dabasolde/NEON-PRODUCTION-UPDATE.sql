-- ===================================================
-- NEON PRODUCTION UPDATE SCRIPT
-- Run this entire script in your Neon SQL Editor
-- ===================================================

-- 1. Add 'recipientPhone' column to Order table
-- Matches the change in add-recipient-phone.sql
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "recipientPhone" VARCHAR(20);

-- 2. Fix Operator Duplicates (CRITICAL FIX)
-- This removes the duplicate entries that were preventing you from turning off operators
DELETE FROM "RechargeConfig" a 
USING "RechargeConfig" b 
WHERE a.id < b.id 
  AND a.operator = b.operator 
  AND (
      (a."rechargeCode" = b."rechargeCode") 
      OR 
      (a."rechargeCode" IS NULL AND b."rechargeCode" IS NULL)
  );

-- 3. Update Plans to 15% Discount
-- Matches update-discount-percent.sql
UPDATE "Plan"
SET "discountPercent" = 15
WHERE "discountPercent" = 12;

-- 4. Verification Queries
SELECT 'Order Column Check' as check_name, COUNT(*) as count FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'recipientPhone';
SELECT 'Remaining Duplicates' as check_name, COUNT(*) as count FROM "RechargeConfig" a JOIN "RechargeConfig" b ON a.operator = b.operator AND (a."rechargeCode" = b."rechargeCode" OR (a."rechargeCode" IS NULL AND b."rechargeCode" IS NULL)) AND a.id < b.id;

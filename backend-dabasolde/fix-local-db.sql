-- Fix local database schema
-- Add recipientPhone column and fix decimal types

-- 1. Add recipientPhone column
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "recipientPhone" VARCHAR(20);

-- 2. Fix decimal types for amount and price
ALTER TABLE "Order" ALTER COLUMN amount TYPE NUMERIC;
ALTER TABLE "Order" ALTER COLUMN price TYPE NUMERIC;

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name IN ('amount', 'price', 'recipientPhone', 'phone')
ORDER BY column_name;

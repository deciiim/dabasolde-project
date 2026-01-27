-- Fix the Order table to support decimal prices
-- Run this in your Neon database console

-- Change amount and price columns from INTEGER to NUMERIC to support decimals
ALTER TABLE "Order" ALTER COLUMN amount TYPE NUMERIC;
ALTER TABLE "Order" ALTER COLUMN price TYPE NUMERIC;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name IN ('amount', 'price');

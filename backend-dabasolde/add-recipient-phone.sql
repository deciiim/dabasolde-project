-- Add recipientPhone column to Order table
-- This will store the phone number that receives the recharge
-- The existing 'phone' column will be the payer's phone

ALTER TABLE "Order" ADD COLUMN "recipientPhone" VARCHAR(20);

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
AND column_name IN ('phone', 'recipientPhone');

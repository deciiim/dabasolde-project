-- Create Order table for DabaSolde application
-- Run this in your Neon database console

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

-- Create index on shortRef for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_shortref ON "Order"("shortRef");

-- Create index on status for admin dashboard filtering
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

-- Create index on createdAt for sorting
CREATE INDEX IF NOT EXISTS idx_order_createdat ON "Order"("createdAt" DESC);

-- Verify the table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Order'
ORDER BY ordinal_position;

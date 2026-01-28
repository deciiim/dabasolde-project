-- Update all plans to 15% discount
-- This will recalculate the discounted price for each plan

-- Update 1000 DH plan: 1000 - 15% = 850 DH
UPDATE "Plan"
SET "discountedPrice" = 850
WHERE "originalPrice" = 1000;

-- Update 500 DH plan: 500 - 15% = 425 DH
UPDATE "Plan"
SET "discountedPrice" = 425
WHERE "originalPrice" = 500;

-- Update 200 DH plan (if exists): 200 - 15% = 170 DH
UPDATE "Plan"
SET "discountedPrice" = 170
WHERE "originalPrice" = 200;

-- Update 100 DH plan (if exists): 100 - 15% = 85 DH
UPDATE "Plan"
SET "discountedPrice" = 85
WHERE "originalPrice" = 100;

-- Verify the updates
SELECT id, name, "originalPrice", "discountedPrice", 
       ROUND((("originalPrice" - "discountedPrice")::numeric / "originalPrice" * 100), 2) as "discountPercent"
FROM "Plan"
ORDER BY "originalPrice" DESC;

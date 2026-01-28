-- Update discount percentage from 12% to 15% for all plans in production

UPDATE "Plan"
SET "discountPercent" = 15
WHERE "discountPercent" = 12;

-- Verify the update
SELECT id, name, "originalPrice", "discountedPrice", "discountPercent"
FROM "Plan"
ORDER BY "originalPrice" DESC;

// Run this script to create the RechargeConfig table
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting migration...');

        // Create table
        await client.query(`
      CREATE TABLE IF NOT EXISTS "RechargeConfig" (
        id SERIAL PRIMARY KEY,
        operator VARCHAR(50) NOT NULL,
        "rechargeCode" VARCHAR(50),
        "isAvailable" BOOLEAN DEFAULT true,
        "disabledReason" TEXT,
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "updatedBy" VARCHAR(255),
        UNIQUE(operator, "rechargeCode")
      );
    `);
        console.log('✅ Table created');

        // Create indexes
        await client.query(`CREATE INDEX IF NOT EXISTS idx_recharge_config_operator ON "RechargeConfig"(operator);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_recharge_config_available ON "RechargeConfig"("isAvailable");`);
        console.log('✅ Indexes created');

        // Insert operator-level configs
        await client.query(`
      INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
      VALUES 
        ('inwi', NULL, true),
        ('orange', NULL, true)
      ON CONFLICT (operator, "rechargeCode") DO NOTHING;
    `);
        console.log('✅ Operator configs inserted');

        // Insert Inwi recharge types
        await client.query(`
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
    `);
        console.log('✅ Inwi recharge types inserted');

        // Insert Orange recharge types
        await client.query(`
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
    `);
        console.log('✅ Orange recharge types inserted');

        // Verify
        const result = await client.query('SELECT COUNT(*) FROM "RechargeConfig"');
        console.log(`\n🎉 Migration complete! Total records: ${result.rows[0].count}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function addOrangeTypes() {
    try {
        await pool.query(`
      INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
      VALUES 
        ('orange', '*2', true),
        ('orange', '*7', true),
        ('orange', '*22', true),
        ('orange', '*33', true),
        ('orange', '*77', true)
      ON CONFLICT (operator, "rechargeCode") DO NOTHING
    `);
        console.log('✅ Added missing Orange recharge types (*2, *7, *22, *33, *77)');

        // Verify count
        const result = await pool.query('SELECT COUNT(*) FROM "RechargeConfig" WHERE operator = \'orange\'');
        console.log(`📊 Total Orange configs: ${result.rows[0].count}`);

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
    }
}

addOrangeTypes();

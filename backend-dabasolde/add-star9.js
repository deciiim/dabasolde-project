const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function addStar9() {
    try {
        await pool.query(`
      INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable") 
      VALUES ('inwi', '*9', true) 
      ON CONFLICT (operator, "rechargeCode") DO NOTHING
    `);
        console.log('✅ Added *9 to Inwi recharge types');
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
    }
}

addStar9();

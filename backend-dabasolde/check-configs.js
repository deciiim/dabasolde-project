const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkAllConfigs() {
    try {
        console.log('📊 Checking all recharge configurations...\n');

        // Get all configs
        const result = await pool.query(`
      SELECT operator, "rechargeCode", "isAvailable" 
      FROM "RechargeConfig" 
      ORDER BY operator, "rechargeCode"
    `);

        // Group by operator
        const inwi = result.rows.filter(r => r.operator === 'inwi');
        const orange = result.rows.filter(r => r.operator === 'orange');

        console.log('🔵 INWI CONFIGS:');
        console.log('================');
        inwi.forEach(row => {
            const code = row.rechargeCode || 'OPERATOR';
            const status = row.isAvailable ? '✅' : '❌';
            console.log(`${status} ${code.padEnd(15)} - ${row.isAvailable ? 'Available' : 'Disabled'}`);
        });
        console.log(`Total: ${inwi.length}\n`);

        console.log('🟠 ORANGE CONFIGS:');
        console.log('==================');
        orange.forEach(row => {
            const code = row.rechargeCode || 'OPERATOR';
            const status = row.isAvailable ? '✅' : '❌';
            console.log(`${status} ${code.padEnd(15)} - ${row.isAvailable ? 'Available' : 'Disabled'}`);
        });
        console.log(`Total: ${orange.length}\n`);

        console.log('📈 SUMMARY:');
        console.log('===========');
        console.log(`Total Inwi configs: ${inwi.length}`);
        console.log(`Total Orange configs: ${orange.length}`);
        console.log(`Grand Total: ${result.rows.length}`);

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
    }
}

checkAllConfigs();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function fixLocalDatabase() {
    try {
        console.log('🔧 Fixing local database schema...\n');

        // 1. Add recipientPhone column
        try {
            await pool.query('ALTER TABLE "Order" ADD COLUMN "recipientPhone" VARCHAR(20)');
            console.log('✅ Added recipientPhone column');
        } catch (e) {
            if (e.code === '42701') {
                console.log('ℹ️  recipientPhone column already exists');
            } else {
                throw e;
            }
        }

        // 2. Fix amount type
        await pool.query('ALTER TABLE "Order" ALTER COLUMN amount TYPE NUMERIC');
        console.log('✅ Changed amount to NUMERIC');

        // 3. Fix price type
        await pool.query('ALTER TABLE "Order" ALTER COLUMN price TYPE NUMERIC');
        console.log('✅ Changed price to NUMERIC');

        // Verify changes
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Order' 
            AND column_name IN ('amount', 'price', 'recipientPhone', 'phone')
            ORDER BY column_name
        `);

        console.log('\n📋 Updated columns:');
        result.rows.forEach(r => {
            console.log(`  ${r.column_name.padEnd(20)} ${r.data_type}`);
        });

        console.log('\n✅ Local database updated successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixLocalDatabase();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        console.log('Running migration...');
        const client = await pool.connect();
        try {
            // Check if column exists
            const checkRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='Order' AND column_name='productType';
      `);

            if (checkRes.rows.length === 0) {
                console.log('Adding productType column...');
                await client.query(`ALTER TABLE "Order" ADD COLUMN "productType" VARCHAR(50);`);
                console.log('Column added successfully.');
            } else {
                console.log('Column productType already exists.');
            }
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();

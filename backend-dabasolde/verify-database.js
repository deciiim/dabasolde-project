const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');
const connectionString = isLocal
    ? process.env.DATABASE_URL
    : `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}sslmode=require`;

const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function verifyDatabase() {
    try {
        console.log('🔍 Verifying database schema...\n');
        const client = await pool.connect();

        try {
            // Check if Order table exists
            const tableCheck = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'Order'
                );
            `);

            if (!tableCheck.rows[0].exists) {
                console.log('❌ Order table does not exist!');
                console.log('\nTo create it, run this SQL:');
                console.log(`
CREATE TABLE "Order" (
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
                `);
                return;
            }

            console.log('✅ Order table exists\n');

            // Get all columns
            const columnsResult = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'Order'
                ORDER BY ordinal_position;
            `);

            console.log('📋 Table columns:');
            console.log('─'.repeat(80));
            columnsResult.rows.forEach(col => {
                const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
                const defaultVal = col.column_default ? `[default: ${col.column_default}]` : '';
                console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(20)} ${nullable} ${defaultVal}`);
            });
            console.log('─'.repeat(80));

            // Check for required columns
            const requiredColumns = [
                'id', 'shortRef', 'amount', 'price', 'phone',
                'fullName', 'paymentMethod', 'status', 'productType'
            ];

            const existingColumns = columnsResult.rows.map(row => row.column_name);
            const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

            if (missingColumns.length > 0) {
                console.log('\n⚠️  Missing required columns:', missingColumns.join(', '));
                console.log('\nTo add missing columns, run:');
                missingColumns.forEach(col => {
                    if (col === 'productType') {
                        console.log(`ALTER TABLE "Order" ADD COLUMN "${col}" VARCHAR(50);`);
                    }
                });
            } else {
                console.log('\n✅ All required columns are present');
            }

            // Count records
            const countResult = await client.query('SELECT COUNT(*) FROM "Order"');
            console.log(`\n📊 Total orders in database: ${countResult.rows[0].count}`);

            // Test database connection
            console.log('\n✅ Database connection is working correctly');

        } finally {
            client.release();
        }
    } catch (err) {
        console.error('❌ Database verification failed:', err.message);
        console.error('\nFull error:', err);
    } finally {
        await pool.end();
    }
}

verifyDatabase();

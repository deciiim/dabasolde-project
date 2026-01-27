# How to Set Up Your Neon Database

## The Problem
Your production database on Neon doesn't have the required tables (`Plan` and `Order`), which is causing the 500 error when submitting orders.

## Solution: Run the Database Setup Script

### Step 1: Access Neon Console
1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Log in to your account
3. Select your `dabasolde` project (or whatever you named it)

### Step 2: Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar
2. You should see a query editor interface

### Step 3: Run the Setup Script
1. Open the file: [setup-database.sql](file:///c:/Users/ULTRA%20PC/Desktop/decim/backend-dabasolde/setup-database.sql)
2. Copy **ALL** the SQL code from that file
3. Paste it into the Neon SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`

### Step 4: Verify Success
After running the script, you should see output showing:
- ✅ Plan Table Columns (with columns: id, amount, discountPercent, isActive, createdAt)
- ✅ Order Table Columns (with columns: id, shortRef, amount, price, phone, fullName, etc.)
- ✅ Plans Count: 4 (the default plans)
- ✅ Orders Count: 0 (no orders yet)

## What This Script Does

1. **Creates the Plan table** - Stores your pricing plans
2. **Inserts 4 default plans** - 100DH, 200DH, 500DH, 1000DH with discounts
3. **Creates the Order table** - Stores customer orders
4. **Creates indexes** - For better performance
5. **Verifies everything** - Shows you what was created

## After Running the Script

1. Your database will be fully set up
2. Go back to your website: [https://www.dabasolde.com](https://www.dabasolde.com)
3. Try submitting an order again
4. It should work now! ✅

## Troubleshooting

### If you get an error about tables already existing
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- It won't overwrite existing data

### If you get a permission error
- Make sure you're logged into the correct Neon account
- Make sure you selected the correct database/project

### If the order submission still fails
- Check the Render logs (as described in the walkthrough)
- The enhanced error logging will now show the exact issue

## Alternative: Run from Command Line

If you prefer, you can also run this from your local machine:

```bash
cd backend-dabasolde

# Make sure your .env has the production DATABASE_URL from Neon
# Then run:
node -e "const {Pool} = require('pg'); const fs = require('fs'); require('dotenv').config(); const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); const sql = fs.readFileSync('setup-database.sql', 'utf8'); pool.query(sql).then(() => {console.log('✅ Database setup complete!'); pool.end();}).catch(e => {console.error('❌ Error:', e); pool.end();});"
```

**Note**: This requires your production `DATABASE_URL` to be in your `.env` file temporarily.

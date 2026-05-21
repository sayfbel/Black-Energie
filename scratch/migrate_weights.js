const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const db = require('../server/config/db');

async function migrate() {
    try {
        console.log('Adding weights column to products table...');
        // MariaDB 10.2.7+ supports JSON which is an alias for LONGTEXT with a CHECK constraint
        await db.query('ALTER TABLE products ADD COLUMN weights JSON DEFAULT NULL AFTER description');
        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('Duplicate column name')) {
            console.log('Column already exists, proceeding...');
            process.exit(0);
        }
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();

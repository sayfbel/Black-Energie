const db = require('./config/db');

async function test() {
    try {
        console.log("Testing connection...");
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log("Connection OK, result:", rows[0].result);
        
        console.log("Checking products table...");
        const [products] = await db.query('SHOW TABLES LIKE "products"');
        console.log("Products table exists:", products.length > 0);
        
        if (products.length > 0) {
            const [cols] = await db.query('DESCRIBE products');
            console.log("Columns in products:");
            console.table(cols);
        }
        
        process.exit(0);
    } catch (err) {
        console.error("TEST FAILED:", err.message);
        console.error(err.stack);
        process.exit(1);
    }
}

test();

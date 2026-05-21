const db = require('./config/db');

async function test() {
    try {
        console.log("Testing connection...");
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log("Connection OK, result:", rows[0].result);
        
        const tables = ['products', 'offers', 'coupons'];
        for (const table of tables) {
            console.log(`Checking ${table} table...`);
            const [exists] = await db.query(`SHOW TABLES LIKE "${table}"`);
            console.log(`${table} table exists:`, exists.length > 0);
            
            if (exists.length > 0) {
                const [cols] = await db.query(`DESCRIBE ${table}`);
                console.log(`Columns in ${table}:`);
                console.table(cols);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error("TEST FAILED:", err.message);
        console.error(err.stack);
        process.exit(1);
    }
}

test();

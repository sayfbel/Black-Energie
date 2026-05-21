const db = require('./config/db');

async function checkSchema() {
    try {
        console.log("Checking tables...");
        const [tables] = await db.query('SHOW TABLES');
        console.log("Tables:", tables);

        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`\nSchema for table: ${tableName}`);
            const [columns] = await db.query(`DESCRIBE ${tableName}`);
            console.table(columns);
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Error checking schema:", err);
        process.exit(1);
    }
}

checkSchema();

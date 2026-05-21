const db = require('./server/config/db');

async function checkTable() {
    try {
        const [rows] = await db.query('DESCRIBE products');
        console.log('Table structure:');
        rows.forEach(row => {
            console.log(`${row.Field} - ${row.Type}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error describing table:', err.message);
        process.exit(1);
    }
}

checkTable();

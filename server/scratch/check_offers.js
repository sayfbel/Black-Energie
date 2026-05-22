const pool = require('../config/db');

async function checkDatabase() {
    try {
        const [offers] = await pool.query('SELECT * FROM offers');
        console.log('--- OFFERS ---');
        console.log(JSON.stringify(offers, null, 2));

        const [coupons] = await pool.query('SELECT * FROM coupons');
        console.log('--- COUPONS ---');
        console.log(JSON.stringify(coupons, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDatabase();

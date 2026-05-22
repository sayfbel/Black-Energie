const pool = require('../config/db');

async function activateOffers() {
    try {
        // Update offers to make them active (from 2026-05-01 to 2026-06-30)
        await pool.query(
            "UPDATE offers SET start_date = '2026-05-01 00:00:00', end_date = '2026-06-30 23:59:59' WHERE id = 1"
        );
        console.log('Successfully activated offer #1!');

        // Update coupons to make them active
        await pool.query(
            "UPDATE coupons SET start_date = '2026-05-01 00:00:00', end_date = '2026-06-30 23:59:59' WHERE id = 1"
        );
        console.log('Successfully activated coupon #1!');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

activateOffers();

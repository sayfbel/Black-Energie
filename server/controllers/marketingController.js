const pool = require('../config/db');

// --- OFFERS ---

exports.createOffer = async (req, res) => {
    try {
        const { name, type, discount_type, discount_value, target_ids, start_date, end_date } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO offers (name, type, discount_type, discount_value, target_ids, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, type, discount_type, discount_value, JSON.stringify(target_ids), start_date, end_date]
        );
        
        res.status(201).json({ message: 'Offer created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getOffers = async (req, res) => {
    try {
        const [offers] = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
        
        // Parse target_ids from JSON string
        const parsedOffers = offers.map(offer => ({
            ...offer,
            target_ids: offer.target_ids ? JSON.parse(offer.target_ids) : []
        }));
        
        res.status(200).json(parsedOffers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM offers WHERE id = ?', [id]);
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- COUPONS ---

exports.createCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_order_amount, start_date, end_date } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
            [code, discount_type, discount_value, min_order_amount, start_date, end_date]
        );
        
        res.status(201).json({ message: 'Coupon created successfully', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Coupon code already exists' });
        }
        console.error('Error creating coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const [coupons] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
        res.status(200).json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        if (!code || orderAmount === undefined) {
            return res.status(400).json({ error: 'Coupon code and order amount are required' });
        }
        
        const [coupons] = await pool.query(
            'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW())',
            [code]
        );
        
        if (coupons.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired coupon code' });
        }
        
        const coupon = coupons[0];
        
        if (orderAmount < coupon.min_order_amount) {
            return res.status(400).json({ error: `Minimum order amount for this coupon is $${coupon.min_order_amount}` });
        }
        
        res.status(200).json({
            message: 'Coupon validated',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

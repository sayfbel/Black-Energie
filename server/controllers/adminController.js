const db = require('../config/db');
const { sendOTP } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

const otpStore = new Map();

exports.login = async (req, res) => {
    let { email } = req.body;
    
    // Validation & Sanitization
    if (!email) return res.status(400).json({ error: "Email is required" });
    email = email.toString().trim().toLowerCase();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Email not authorized' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;

        otpStore.set(email, { otp, expiry });
        await sendOTP(email, otp);
        
        res.json({ message: 'OTP sent to your email', email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);

    if (!stored || stored.otp !== otp || Date.now() > stored.expiry) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    otpStore.delete(email);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful' });
};

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Revenue
        const [revenueRows] = await db.query('SELECT SUM(total_price) as total FROM orders WHERE status != "cancelled"');
        const totalRevenue = revenueRows[0]?.total || 0;

        // 2. Total Orders
        const [orderRows] = await db.query('SELECT COUNT(*) as total FROM orders');
        const totalOrders = orderRows[0]?.total || 0;

        // 3. Total Products
        const [productRows] = await db.query('SELECT COUNT(*) as total FROM products');
        const totalProducts = productRows[0]?.total || 0;

        // 4. Product Statistics
        const [productStatsRows] = await db.query(`
            SELECT 
                o.product_name, 
                p.image_url,
                COUNT(o.id) as order_count, 
                SUM(o.quantity) as total_quantity,
                SUM(o.total_price) as total_revenue
            FROM orders o
            LEFT JOIN products p ON o.product_name = p.name
            GROUP BY o.product_name, p.image_url 
            ORDER BY order_count DESC
        `);

        // 5. Best Product
        const topProduct = productStatsRows.length > 0 ? productStatsRows[0] : null;

        // 6. Timeline Data (Weekly)
        const [weeklySalesRows] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%a') as day, COUNT(*) as orders
            FROM orders 
            WHERE created_at >= CURDATE() - INTERVAL 7 DAY
            GROUP BY day
            ORDER BY MIN(created_at)
        `);

        // 7. Timeline Data (Monthly)
        const [monthlySalesRows] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%d %b') as date, COUNT(*) as orders
            FROM orders 
            WHERE created_at >= CURDATE() - INTERVAL 30 DAY
            GROUP BY date
            ORDER BY MIN(created_at)
        `);

        // 8. Recent Activities (Last 5 orders)
        const [activityRows] = await db.query(`
            SELECT o.id, o.product_name as title, p.image_url, o.customer_name as user, o.created_at as time, o.status
            FROM orders o
            LEFT JOIN products p ON o.product_name = p.name
            ORDER BY o.created_at DESC 
            LIMIT 8
        `);

        res.json({
            stats: [
                { label: 'Total Revenue', value: `$${Number(totalRevenue).toLocaleString()}`, trend: '+12%', isUp: true },
                { label: 'Total Orders', value: totalOrders.toString(), trend: '+5%', isUp: true },
                { label: 'Active Collection', value: totalProducts.toString(), trend: '+0%', isUp: true },
                { label: 'Avg Order Value', value: `$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0}`, trend: '+2%', isUp: true }
            ],
            productStats: productStatsRows,
            topProduct: topProduct,
            charts: {
                weekly: weeklySalesRows,
                monthly: monthlySalesRows
            },
            activities: activityRows.map(row => ({
                id: row.id,
                title: `New order #${row.id}`,
                product: row.title,
                image: row.image_url,
                user: row.user,
                status: row.status,
                time: row.time
            }))
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: err.message, code: err.code });
    }
};

exports.getProductStats = async (req, res) => {
    try {
        const { productName } = req.params;

        // stats: valid (confirmed), pending, cancelled
        const [statusRows] = await db.query(`
            SELECT status, COUNT(*) as count, SUM(total_price) as total_revenue
            FROM orders
            WHERE product_name = ?
            GROUP BY status
        `, [productName]);

        const [bestCustomer] = await db.query(`
            SELECT customer_name, COUNT(*) as order_count, SUM(total_price) as total_spent
            FROM orders
            WHERE product_name = ? AND status != 'cancelled'
            GROUP BY customer_name
            ORDER BY total_spent DESC
            LIMIT 1
        `, [productName]);

        const [productInfo] = await db.query(`
            SELECT * FROM products WHERE name = ? LIMIT 1
        `, [productName]);

        res.json({
            productName,
            productInfo: productInfo[0] || null,
            statusStats: statusRows,
            bestCustomer: bestCustomer[0] || null,
        });

    } catch (err) {
        console.error("Product Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerStats = async (req, res) => {
    try {
        const { customerName } = req.params;

        const [statusRows] = await db.query(`
            SELECT status, COUNT(*) as count, SUM(total_price) as total_spent
            FROM orders
            WHERE customer_name = ?
            GROUP BY status
        `, [customerName]);

        const [biggestOrder] = await db.query(`
            SELECT id, product_name, total_price, status, created_at
            FROM orders
            WHERE customer_name = ? AND status != 'cancelled'
            ORDER BY total_price DESC
            LIMIT 1
        `, [customerName]);

        const [orderHistory] = await db.query(`
            SELECT id, product_name, total_price, status, created_at
            FROM orders
            WHERE customer_name = ?
            ORDER BY created_at DESC
        `, [customerName]);

        res.json({
            customerName,
            statusStats: statusRows,
            biggestOrder: biggestOrder[0] || null,
            orderHistory: orderHistory
        });

    } catch (err) {
        console.error("Customer Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delivery Costs CRUD
exports.getDeliveryCosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM delivery_costs ORDER BY city ASC');
        res.json(rows);
    } catch (err) {
        console.error("Get Delivery Costs Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.addDeliveryCost = async (req, res) => {
    try {
        const { city, cost } = req.body;
        if (!city || cost === undefined) return res.status(400).json({ error: "City and cost are required." });

        const [result] = await db.query(
            'INSERT INTO delivery_costs (city, cost) VALUES (?, ?)',
            [city, parseFloat(cost)]
        );
        res.json({ id: result.insertId, city, cost: parseFloat(cost) });
    } catch (err) {
        console.error("Add Delivery Cost Error:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "City already exists." });
        res.status(500).json({ error: err.message });
    }
};

exports.updateDeliveryCost = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, cost } = req.body;
        if (!city || cost === undefined) return res.status(400).json({ error: "City and cost are required." });

        await db.query(
            'UPDATE delivery_costs SET city = ?, cost = ? WHERE id = ?',
            [city, parseFloat(cost), id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Update Delivery Cost Error:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "City already exists." });
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDeliveryCost = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM delivery_costs WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error("Delete Delivery Cost Error:", err);
        res.status(500).json({ error: err.message });
    }
};

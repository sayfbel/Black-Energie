const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, p.image_url 
            FROM orders o 
            LEFT JOIN products p ON o.product_name = p.name 
            ORDER BY o.id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    let { product_name, customer_name, customer_whatsapp, customer_address, weight, quantity, total_price } = req.body;
    
    // Basic Sanitization
    customer_name = customer_name?.toString().trim().replace(/[<>]/g, '');
    customer_address = customer_address?.toString().trim().replace(/[<>]/g, '');
    
    // Validation
    if (!product_name || !customer_name || !customer_whatsapp || !customer_address) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const whatsappRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!whatsappRegex.test(customer_whatsapp)) {
        return res.status(400).json({ error: "Invalid WhatsApp number format" });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    const price = parseFloat(total_price);
    if (isNaN(price) || price < 0) {
        return res.status(400).json({ error: "Invalid total price" });
    }

    console.log("Creating secured order with data:", { product_name, customer_name, customer_whatsapp });
    
    try {
        const [result] = await db.query(
            'INSERT INTO orders (product_name, customer_name, customer_whatsapp, customer_address, weight, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [product_name, customer_name, customer_whatsapp, customer_address, weight, qty, price]
        );
        res.status(201).json({ id: result.insertId, message: 'Order placed successfully' });
    } catch (err) {
        console.error("Database Order Error:", err);
        res.status(500).json({ error: "Failed to process order. Security validation failed or database error." });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Order #${id} updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

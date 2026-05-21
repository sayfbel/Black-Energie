const db = require('../config/db');

exports.getRatingsByProduct = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ratings WHERE product_slug = ?', [req.params.product_slug]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitRating = async (req, res) => {
    let { product_slug, name, email, rating, message } = req.body;
    
    // Sanitization
    name = name?.toString().trim().replace(/[<>]/g, '');
    message = message?.toString().trim().replace(/[<>]/g, '');
    email = email?.toString().trim().toLowerCase();

    // Validation
    if (!product_slug || !name || !email || !rating) {
        return res.status(400).json({ error: "Missing required rating fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
        await db.query(
            'INSERT INTO ratings (product_slug, name, email, rating, message) VALUES (?, ?, ?, ?, ?)',
            [product_slug, name, email, r, message]
        );
        res.status(201).json({ message: 'Rating submitted' });
    } catch (err) {
        console.error("Rating Error:", err);
        res.status(500).json({ error: "Failed to submit rating. Security or database error." });
    }
};

const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT *, id as _id FROM products');
        
        // Fetch weights for each product with safety
        const productsWithWeights = await Promise.all(products.map(async (p) => {
            try {
                const [weights] = await db.query('SELECT weight_value as value, weight_unit as unit, price FROM product_weights WHERE product_id = ?', [p.id]);
                return { ...p, weights: weights || [] };
            } catch (weightErr) {
                console.warn(`Could not fetch weights for product ${p.id}:`, weightErr.message);
                return { ...p, weights: [] };
            }
        }));

        res.json(productsWithWeights);
    } catch (err) {
        console.error("Critical Product Fetch Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT *, id as _id FROM products WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        
        const product = rows[0];
        const [weights] = await db.query('SELECT weight_value as value, weight_unit as unit, price FROM product_weights WHERE product_id = ?', [product.id]);
        
        res.json({ ...product, weights });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = async (req, res) => {
    let { name, price, description, weights, product_type, intensity } = req.body;
    
    // Basic Sanitization
    name = name?.toString().trim().replace(/[<>]/g, '');
    description = description?.toString().trim().replace(/[<>]/g, '');
    
    // Validation
    if (!name || !price || !description) {
        return res.status(400).json({ error: "Missing required product fields" });
    }

    const intensityValue = parseInt(intensity) || 5;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [result] = await connection.query(
            'INSERT INTO products (name, slug, price, description, product_type, intensity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, slug, price, description, product_type || 'single', intensityValue, image_url]
        );
        const productId = result.insertId;

        if (weights) {
            const weightsArray = typeof weights === 'string' ? JSON.parse(weights) : weights;
            for (const w of weightsArray) {
                const wPrice = parseFloat(w.price);
                if (isNaN(wPrice)) continue;

                await connection.query(
                    'INSERT INTO product_weights (product_id, weight_value, weight_unit, price) VALUES (?, ?, ?, ?)',
                    [productId, w.value, w.unit, wPrice]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ id: productId, message: 'Product created successfully', slug, image_url });
    } catch (err) {
        await connection.rollback();
        console.error('Database Error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.updateProduct = async (req, res) => {
    let { name, price, description, weights, product_type, intensity } = req.body;
    const { id } = req.params;
    
    // Basic Sanitization
    name = name?.toString().trim().replace(/[<>]/g, '');
    description = description?.toString().trim().replace(/[<>]/g, '');
    
    if (!name || !price || !id) {
        return res.status(400).json({ error: "Missing required fields for update" });
    }

    const intensityValue = parseInt(intensity) || 5;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        let updateQuery, params;
        if (req.file) {
            const image_url = `http://localhost:5000/uploads/${req.file.filename}`;
            updateQuery = 'UPDATE products SET name = ?, slug = ?, price = ?, description = ?, product_type = ?, intensity = ?, image_url = ? WHERE id = ?';
            params = [name, slug, price, description, product_type, intensityValue, image_url, id];
        } else {
            updateQuery = 'UPDATE products SET name = ?, slug = ?, price = ?, description = ?, product_type = ?, intensity = ? WHERE id = ?';
            params = [name, slug, price, description, product_type, intensityValue, id];
        }

        await connection.query(updateQuery, params);

        if (weights) {
            await connection.query('DELETE FROM product_weights WHERE product_id = ?', [id]);
            const weightsArray = typeof weights === 'string' ? JSON.parse(weights) : weights;
            for (const w of weightsArray) {
                const wPrice = parseFloat(w.price);
                if (isNaN(wPrice)) continue;

                await connection.query(
                    'INSERT INTO product_weights (product_id, weight_value, weight_unit, price) VALUES (?, ?, ?, ?)',
                    [id, w.value, w.unit, wPrice]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

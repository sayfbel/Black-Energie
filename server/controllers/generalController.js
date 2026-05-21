const db = require('../config/db');
const { sendContactEmail } = require('../utils/mailer');

exports.contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await sendContactEmail({ name, email, message });
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.healthCheck = (req, res) => {
    res.send('Black Energie API is running');
};

exports.getDeliveryCosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT city, cost FROM delivery_costs ORDER BY city ASC');
        res.json(rows);
    } catch (err) {
        console.error("Get Delivery Costs Error:", err);
        res.status(500).json({ error: 'Failed to fetch delivery costs' });
    }
};

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const logger = console; // Replacing missing winston logger with console

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const generalRoutes = require('./routes/generalRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// Security Middlewares (Disabled: missing modules)
// app.use(helmet()); 
app.use(cors());

// Rate Limiting (Disabled: missing module)
/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter); 
*/

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure required directories exist
const dirs = ['uploads', 'logs'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', generalRoutes);

// Run Migrations
const runMigrations = async () => {
    try {
        const pool = require('./config/db');
        console.log('Checking database tables...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type ENUM('single', 'group', 'all') NOT NULL,
                discount_type ENUM('percentage', 'fixed') NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                target_ids TEXT, -- JSON array of product IDs
                start_date DATETIME,
                end_date DATETIME,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                discount_type ENUM('percentage', 'fixed') NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                min_order_amount DECIMAL(10, 2) DEFAULT 0,
                start_date DATETIME,
                end_date DATETIME,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        
        // Drop the table to force schema refresh with city column
        await pool.query(`DROP TABLE IF EXISTS delivery_costs;`);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS delivery_costs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                city VARCHAR(255) NOT NULL UNIQUE,
                cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        
        console.log('Database migration successful.');
    } catch (err) {
        console.error('Database migration failed:', err);
    }
};

runMigrations();

// Global Error Handler
app.use((err, req, res, next) => {
    const errorMsg = `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}\nStack: ${err.stack}\nTime: ${new Date().toISOString()}`;
    fs.appendFileSync(path.join(__dirname, 'global_errors.txt'), errorMsg + '\n\n');
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        details: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

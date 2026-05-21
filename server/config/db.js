const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.on('connection', (connection) => {
    fs.appendFileSync(path.join(__dirname, '../db_log.txt'), 'New connection established at ' + new Date().toISOString() + '\n');
});

pool.on('error', (err) => {
    fs.appendFileSync(path.join(__dirname, '../db_log.txt'), 'Pool error: ' + err.message + '\n');
});

module.exports = pool;

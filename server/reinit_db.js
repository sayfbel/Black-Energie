const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function init() {
    const logPath = path.join(__dirname, 'db_init_log.txt');
    fs.writeFileSync(logPath, 'Starting DB init...\n');

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    };

    try {
        const connection = await mysql.createConnection(config);
        fs.appendFileSync(logPath, 'Connected to MySQL server.\n');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        fs.appendFileSync(logPath, `Database ${process.env.DB_NAME} checked/created.\n`);

        await connection.query(`USE \`${process.env.DB_NAME}\``);

        const sqlPath = path.join(__dirname, '../black_energie.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await connection.query(sql);
            fs.appendFileSync(logPath, 'SQL file imported successfully.\n');
        } else {
            fs.appendFileSync(logPath, 'SQL file not found at ' + sqlPath + '\n');
        }

        await connection.end();
        fs.appendFileSync(logPath, 'Done.\n');
    } catch (err) {
        fs.appendFileSync(logPath, 'Error: ' + err.message + '\n' + err.stack + '\n');
    }
}

init();

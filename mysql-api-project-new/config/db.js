// .env file load karne ke liye
require("dotenv").config();

// MySQL2 include
const mysql = require("mysql2");

// Yahan hum MySQL ka "Connection Pool" create kar rahe hain
// Pool ka fayda: Fast queries, auto-manage connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,      // Database host
    port: process.env.DB_PORT,      // MySQL port (XAMPP me 3309)
    user: process.env.DB_USER,      // Username
    password: process.env.DB_PASS,  // Password
    database: process.env.DB_NAME,  // Database name
    waitForConnections: true,
    connectionLimit: 10,            // Max 10 connections
    queueLimit: 0
});

// Promise based pool export
module.exports = pool.promise();

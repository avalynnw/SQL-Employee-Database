const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password666',
    database: 'employee_db'
});

module.exports = db;
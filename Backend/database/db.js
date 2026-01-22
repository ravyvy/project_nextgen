const mysql = require("mysql2"); // instead of "mysql"

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "full_db",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

module.exports = db;

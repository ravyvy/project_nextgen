const mysql = require("mysql2"); // instead of "mysql"

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "full_db",
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    timezone: "+07:00" // កំណត់ឱ្យត្រូវម៉ោងកម្ពុជា
});
module.exports = db;

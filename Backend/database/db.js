// const mysql = require("mysql2"); // instead of "mysql"

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "full_db",
//     waitForConnections: true,
//     connectionLimit: 100,
//     queueLimit: 0,
//     timezone: "+07:00" // កំណត់ឱ្យត្រូវម៉ោងកម្ពុជា
// });
// module.exports = db;
require("dotenv").config();
const mysql = require("mysql2");

// Create the connection to the database
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

// Simple check to ensure connection is working
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + db.threadId);
});

module.exports = db;
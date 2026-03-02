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
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectTimeout: 30000,
  ssl: { rejectUnauthorized: false },
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err.stack);
    return;
  }

  console.log("✅ Connected to MySQL database as id " + db.threadId);

  const tables = [
    {
      name: "users",
      query: `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) DEFAULT NULL,
        email VARCHAR(100) DEFAULT NULL UNIQUE,
        password VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_code VARCHAR(6) DEFAULT NULL,
        reset_code_expire DATETIME DEFAULT NULL
      )`,
    },
    {
      name: "admin",
      query: `CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    },
    {
      name: "category",
      query: `CREATE TABLE IF NOT EXISTS category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        img TEXT DEFAULT NULL,
        imgone TEXT DEFAULT NULL,
        imgtwo TEXT DEFAULT NULL,
        title VARCHAR(150) DEFAULT NULL,
        dis VARCHAR(250) DEFAULT NULL,
        price DECIMAL(10,2) DEFAULT NULL,
        stock VARCHAR(100) DEFAULT NULL,
        description TEXT DEFAULT NULL
      )`,
    },
    {
      name: "products",
      query: `CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY,
        name VARCHAR(100) DEFAULT NULL,
        category_id INT DEFAULT NULL,
        title TEXT DEFAULT NULL,
        image TEXT DEFAULT NULL,
        price DECIMAL(10,2) DEFAULT NULL,
        description TEXT DEFAULT NULL
      )`,
    },
    {
      name: "order_store",
      query: `CREATE TABLE IF NOT EXISTS order_store (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        products TEXT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    },
    {
      name: "dborder",
      query: `CREATE TABLE IF NOT EXISTS dborder (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        products TEXT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    },
    {
      name: "alerthome",
      query: `CREATE TABLE IF NOT EXISTS alerthome (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    },
  ];

  tables.forEach(({ name, query }) => {
    db.query(query, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(name)
      }
    });
  });
});

module.exports = db;

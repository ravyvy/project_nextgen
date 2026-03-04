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
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: "nextgen-ravyfaii31-0eaa.c.aivencloud.com",
  port: 15367,
  user: "avnadmin",
  password: "AVNS_Wnx8I1RNdlSx_IBcalP",
  database: defaultdb,
  connectTimeout: 30000,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err.message);
    return;
  }
  console.log("✅ Connected to Aiven MySQL as id " + db.threadId);

});

module.exports = db;


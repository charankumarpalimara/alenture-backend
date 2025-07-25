const mysql = require("mysql2/promise");

const mySqlpool = mysql.createPool({
  host: "147.182.163.213",
  user: "alanadmin",
  password: "Alantur@123",
  database: "alantur",
  charset: 'utf8mb4', // 🔥 Important for characters like ā
});

module.exports = mySqlpool;

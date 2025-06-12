const mysql = require('mysql2/promise');

const mySqlpool = mysql.createPool({
  host: "161.35.54.196",  // Keep your actual host/IP
  user: "charan",   // Replace with actual MySQL user
  password: "Charan@786!",  // Replace with actual password
  database: "yukthitech",
});

module.exports = mySqlpool;
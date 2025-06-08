const mysql = require('mysql2/promise');

const mySqlpool = mysql.createPool({
  host: "162.243.167.71",
  user: "charan",
  password: "charan@123",
  database: "myappdb",
});


module.exports = mySqlpool;
const mysql = require('mysql2/promise');

const mySqlpool = mysql.createPool({
    host: "173.201.178.221",
    user: "yukthitech",
    password: "yukthitech@123",
    database: "yukthitech",
});

module.exports = mySqlpool;
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "groupomania",
});

module.exports.getDB = () => {
  return db;
};

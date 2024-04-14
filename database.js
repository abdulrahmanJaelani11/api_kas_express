const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kas_app",

  // host: "sql311.infinityfree.com",
  // user: "if0_36013679",
  // password: "bA1hCs3J6HoO9NL",
  // database: "if0_36013679_kas_express",
});

module.exports = db;

const mysql = require("mysql");
const db = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "kas_app",

  // host: "sql311.infinityfree.com",
  // user: "if0_36013679",
  // password: "bA1hCs3J6HoO9NL",
  // database: "if0_36013679_kas_express",

  host: "sql6.freesqldatabase.com",
  user: "sql6698860",
  password: "PAtWpNJ51G",
  database: "sql6698860",
  port: "3306",
});

module.exports = db;

const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kas_express",

  // host: "aaj.h.filess.io",
  // database: "sicakas_mustvapor",
  // port: "3307",
  // user: "sicakas_mustvapor",
  // password: "820688fef06604fd1425f7227e6dce4b5fbd5257",

  // host: "sql6.freesqldatabase.com",
  // user: "sql6698860",
  // password: "PAtWpNJ51G",
  // database: "sql6698860",
  // port: "3306",
});

module.exports = db;

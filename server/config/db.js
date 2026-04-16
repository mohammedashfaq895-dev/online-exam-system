const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || "./database.sqlite";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("SQLite connected at:", DB_PATH);
  }
});

module.exports = db;
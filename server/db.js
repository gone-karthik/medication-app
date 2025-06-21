const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('meds.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    taken_dates TEXT,
    proof_photo TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

module.exports = db;

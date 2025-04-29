const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',         // kosong kalau default XAMPP
  database: 'buku_tamu'  // nama database yang sudah dibuat di phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL Database.');
});

module.exports = db;

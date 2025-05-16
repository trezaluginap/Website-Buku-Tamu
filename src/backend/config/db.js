// config/db.js - Perbaikan Koneksi Database
const mysql = require("mysql");

// Konfigurasi koneksi dengan parameter tambahan untuk keandalan
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ganti sesuai user MySQL kamu
  password: "", // sesuaikan dengan password MySQL kamu
  database: "buku_tamu", // pastikan nama DB-nya benar
  // Parameter tambahan untuk menangani reconnect
  connectTimeout: 10000, // 10 detik timeout
  charset: "utf8mb4", // Support untuk karakter UTF-8 lengkap
});

// Function untuk mengelola koneksi database
const handleDisconnect = () => {
  db.connect((err) => {
    if (err) {
      console.error("❌ Gagal koneksi ke database:", err.message);
      console.log("⏱️ Mencoba menghubungkan kembali dalam 2 detik...");
      // Coba koneksi lagi setelah 2 detik
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("✅ Terhubung ke database MySQL");
    }
  });

  // Tangani error pada koneksi yang sudah dibuat
  db.on("error", (err) => {
    console.error("🔄 Error database:", err);

    // Jika koneksi terputus, coba hubungkan kembali
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ER_CON_COUNT_ERROR" ||
      err.code === "ECONNRESET" ||
      err.code === "ETIMEDOUT"
    ) {
      console.log("🔄 Koneksi terputus. Mencoba menghubungkan kembali...");
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

// Mulai koneksi
handleDisconnect();

// Fungsi untuk menjalankan query dengan Promise
db.queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

// Function untuk memeriksa status koneksi database
db.checkConnection = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT 1", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = db;

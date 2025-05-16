// server.js - Endpoint Diagnostik dan Validasi
const express = require("express");
const cors = require("cors");
const tamuRoutes = require("./routes/tamu");
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" })); // body parser untuk JSON dengan batas ukuran
app.use(express.urlencoded({ extended: true, limit: "1mb" })); // untuk form data

// Logging middleware untuk mencatat request
app.use((req, res, next) => {
  console.log(
    `📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
  );
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

// Endpoint untuk mengecek status server dan database
app.get("/api/status", async (req, res) => {
  try {
    // Cek koneksi database
    await db.checkConnection();
    res.json({
      status: "online",
      server: "running",
      database: "connected",
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("❌ Status check error:", err);
    res.status(500).json({
      status: "degraded",
      server: "running",
      database: "disconnected",
      error: err.message,
      timestamp: new Date(),
    });
  }
});

// Endpoint untuk validasi skema tabel
app.get("/api/schema/tamu", (req, res) => {
  db.query("DESCRIBE tamu", (err, results) => {
    if (err) {
      console.error("❌ Gagal mendapatkan skema tabel:", err);
      return res.status(500).json({ error: "Gagal mendapatkan skema tabel" });
    }

    console.log("✅ Skema tabel tamu:", results);

    // Periksa struktur yang diharapkan
    const requiredColumns = [
      "id",
      "nama_lengkap",
      "jenis_kelamin",
      "email",
      "no_hp",
      "pekerjaan",
      "alamat",
      "keperluan",
      "staff",
      "dituju",
      "tanggal_kehadiran",
    ];

    const missingColumns = [];
    requiredColumns.forEach((col) => {
      if (!results.some((r) => r.Field === col)) {
        missingColumns.push(col);
      }
    });

    res.json({
      table: "tamu",
      schema: results,
      status: missingColumns.length === 0 ? "valid" : "invalid",
      missingColumns: missingColumns.length > 0 ? missingColumns : null,
    });
  });
});

// Endpoint utama aplikasi
app.use("/api/tamu", tamuRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


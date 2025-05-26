const express = require("express");
const cors = require("cors");
const tamuRoutes = require("./routes/tamu");
const usersRoutes = require("./routes/users");

const bcrypt = require("bcrypt");
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

// Status check
app.get("/api/status", async (req, res) => {
  try {
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

// Schema check for tamu
app.get("/api/schema/tamu", (req, res) => {
  db.query("DESCRIBE tamu", (err, results) => {
    if (err) {
      console.error("❌ Gagal mendapatkan skema tabel:", err);
      return res.status(500).json({ error: "Gagal mendapatkan skema tabel" });
    }

    const requiredColumns = [
      "id", "nama_lengkap", "jenis_kelamin", "email", "no_hp",
      "pekerjaan", "alamat", "keperluan", "staff", "dituju", "tanggal_kehadiran"
    ];

    const missingColumns = requiredColumns.filter(
      (col) => !results.some((r) => r.Field === col)
    );

    res.json({
      table: "tamu",
      schema: results,
      status: missingColumns.length === 0 ? "valid" : "invalid",
      missingColumns: missingColumns.length > 0 ? missingColumns : null,
    });
  });
});

// ✅ ADMIN LOGIN
app.post("/api/admin-login", (req, res) => {
  const { nama_pengguna, password } = req.body;

  if (!nama_pengguna || !password) {
    return res.status(400).json({ error: "Data wajib tidak lengkap" });
  }

  db.query("SELECT * FROM admins WHERE nama_pengguna = ?", [nama_pengguna], async (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data admin:", err);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Admin tidak ditemukan" });
    }

    const admin = results[0];

    const isMatch = password === admin.password;

    if (!isMatch) {
      return res.status(401).json({ error: "Password salah" });
    }

    // ✅ Simpan log login
    if (admin.id) {
      db.query(
        "INSERT INTO admin_logins (admin_id) VALUES (?)",
        [admin.id],
        (err, result) => {
          if (err) {
            console.error("❌ Gagal menyimpan log login:", err);
          } else {
            console.log("✅ Log login disimpan:", result.insertId);
          }
        }
      );
    } else {
      console.warn("⚠️ admin.id tidak tersedia, log login tidak disimpan");
    }

    res.json({
      message: "Login berhasil",
      admin: { id: admin.id, nama_pengguna: admin.nama_pengguna },
    });
  });
});

// ✅ TAMBAH DATA TAMU
app.post("/api/tamu", (req, res) => {
  const {
    nama_lengkap,
    jenis_kelamin,
    email,
    no_hp,
    pekerjaan,
    alamat,
    keperluan,
    staff,
    dituju,
    tanggal_kehadiran
  } = req.body;

  if (!nama_lengkap || !jenis_kelamin || !tanggal_kehadiran) {
    return res.status(400).json({ error: "Data wajib tidak lengkap" });
  }

  const sql = `
    INSERT INTO tamu 
    (nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan, staff, dituju, tanggal_kehadiran)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nama_lengkap,
    jenis_kelamin,
    email || null,
    no_hp || null,
    pekerjaan || null,
    alamat || null,
    keperluan || null,
    staff || null,
    dituju || null,
    tanggal_kehadiran
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Gagal menyimpan data tamu:", err);
      return res.status(500).json({ error: "Gagal menyimpan data tamu" });
    }

    res.status(201).json({ message: "Data tamu berhasil disimpan", id: result.insertId });
  });
});

// ✅ Gunakan route tambahan
app.use("/api/tamu", tamuRoutes);
app.use("/api/users", usersRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
  console.log(`📊 Status endpoint: http://localhost:${port}/api/status`);
  console.log(`📋 Schema validation: http://localhost:${port}/api/schema/tamu`);
});

// Tangani proses keluar
process.on("SIGINT", () => {
  console.log("🛑 Menghentikan server...");
  db.end((err) => {
    if (err) {
      console.error("❌ Error saat menutup koneksi database:", err);
    } else {
      console.log("✅ Koneksi database ditutup dengan baik");
    }
    process.exit(0);
  });
});

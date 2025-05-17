const express = require("express");
const cors = require("cors");
const tamuRoutes = require("./routes/tamu");
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Logging Request
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Cek koneksi database saat server mulai
db.checkConnection()
  .then(() => {
    console.log("✅ Koneksi database MySQL berhasil");
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi awal ke database:", err.message);
  });

// Endpoint Status Server dan DB
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

// Endpoint untuk validasi struktur tabel tamu
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

// 🔐 Endpoint Login Admin
app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    const results = await db.queryPromise(
      "SELECT * FROM admins WHERE email = ? AND password = ?",
      [email, password]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Simpan log login ke tabel admin_logins
    await db.queryPromise(
      "INSERT INTO admin_logins (admin_email) VALUES (?)",
      [email]
    );

    // Kirim respon login sukses
    res.json({
      message: "Login berhasil",
      admin: {
        id: results[0].id,
        email: results[0].email,
      },
    });
  } catch (err) {
    console.error("❌ Gagal login admin:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat login" });
  }
});

// Rute Tamu
app.use("/api/tamu", tamuRoutes);

// Handler error global
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

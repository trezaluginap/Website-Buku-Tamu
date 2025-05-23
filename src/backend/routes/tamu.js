const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/tamu - Dengan error handling yang ditingkatkan
router.post("/", (req, res) => {
  console.log("📝 Menerima request POST ke /api/tamu:", req.body);

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
    tanggal_kehadiran,
  } = req.body;

  // Validasi data wajib
  if (!nama_lengkap || !jenis_kelamin || !no_hp || !alamat || !keperluan) {
    console.warn("❌ Validasi gagal: Data wajib tidak lengkap");
    return res.status(400).json({
      error: "Data wajib diisi tidak lengkap",
      missingFields: [
        !nama_lengkap ? "nama_lengkap" : null,
        !jenis_kelamin ? "jenis_kelamin" : null,
        !no_hp ? "no_hp" : null,
        !alamat ? "alamat" : null,
        !keperluan ? "keperluan" : null,
      ].filter((field) => field !== null),
    });
  }

  // Format tanggal jika perlu
  let formattedDate = tanggal_kehadiran;
  if (tanggal_kehadiran) {
    try {
      // Pastikan format tanggal sesuai MySQL (YYYY-MM-DD)
      formattedDate = new Date(tanggal_kehadiran).toISOString().split("T")[0];
    } catch (err) {
      console.warn("⚠️ Format tanggal tidak valid:", tanggal_kehadiran);
      // Tetap gunakan nilai asli jika parsing gagal
    }
  } else {
    // Default ke tanggal hari ini jika tidak disediakan
    formattedDate = new Date().toISOString().split("T")[0];
    console.log("ℹ️ Menggunakan tanggal default:", formattedDate);
  }

  const sql = `
    INSERT INTO tamu (
      nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan,
      alamat, keperluan, staff, dituju, tanggal_kehadiran
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nama_lengkap,
    jenis_kelamin,
    email || null,
    no_hp,
    pekerjaan || null,
    alamat,
    keperluan,
    staff || null,
    dituju || null,
    formattedDate,
  ];

  console.log("🔍 Menjalankan query:", sql.replace(/\n\s*/g, " "));
  console.log("📊 Dengan nilai:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Gagal menyimpan data tamu:", err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "Data duplikat ditemukan",
          detail: err.sqlMessage,
        });
      } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          error: "Referensi foreign key tidak valid",
          detail: err.sqlMessage,
        });
      } else if (err.code === "ER_DATA_TOO_LONG") {
        return res.status(400).json({
          error: "Data terlalu panjang untuk kolom",
          detail: err.sqlMessage,
        });
      }

      return res.status(500).json({
        error: "Gagal menyimpan data tamu",
        detail:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }

    console.log("✅ Data tamu berhasil disimpan:", result);
    res.status(201).json({
      message: "Data tamu berhasil disimpan",
      id: result.insertId,
    });
  });
});

// GET /api/tamu - Dengan error handling lebih baik
router.get("/", (req, res) => {
  console.log("📝 Menerima request GET ke /api/tamu");

  const query = "SELECT * FROM tamu ORDER BY tanggal_kehadiran DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data tamu:", err);
      return res.status(500).json({
        error: "Gagal mengambil data tamu",
        detail:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }

    console.log(`✅ Berhasil mengambil ${results.length} data tamu`);
    res.json(results);
  });
});

// PUT /api/tamu/:id - Update data tamu
router.put("/:id", (req, res) => {
  const id = req.params.id;
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
    tanggal_kehadiran,
  } = req.body;

  if (!nama_lengkap || !jenis_kelamin || !no_hp || !alamat || !keperluan) {
    return res.status(400).json({
      error: "Data wajib diisi tidak lengkap",
    });
  }

  const formattedDate = tanggal_kehadiran
    ? new Date(tanggal_kehadiran).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const sql = `
    UPDATE tamu SET
      nama_lengkap = ?, jenis_kelamin = ?, email = ?, no_hp = ?,
      pekerjaan = ?, alamat = ?, keperluan = ?, staff = ?,
      dituju = ?, tanggal_kehadiran = ?
    WHERE id = ?
  `;

  const values = [
    nama_lengkap,
    jenis_kelamin,
    email || null,
    no_hp,
    pekerjaan || null,
    alamat,
    keperluan,
    staff || null,
    dituju || null,
    formattedDate,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Gagal mengupdate data tamu:", err);
      return res.status(500).json({ error: "Gagal mengupdate data tamu" });
    }

    res.json({ message: "Data tamu berhasil diperbarui" });
  });
});

// DELETE /api/tamu/:id - Hapus data tamu
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM tamu WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Gagal menghapus data tamu:", err);
      return res.status(500).json({ error: "Gagal menghapus data tamu" });
    }

    res.json({ message: "Data tamu berhasil dihapus" });
  });
});

module.exports = router;

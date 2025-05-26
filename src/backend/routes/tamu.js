const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ POST /api/tamu - Simpan data tamu
router.post("/", (req, res) => {
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
  } = req.body;

  if (!nama_lengkap || !jenis_kelamin || !keperluan || !staff || !dituju) {
    return res.status(400).json({ error: "Data wajib tidak lengkap." });
  }

  const sql = `
    INSERT INTO tamu 
    (nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan, staff, dituju) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nama_lengkap,
    jenis_kelamin,
    email || null,
    no_hp || null,
    pekerjaan || null,
    alamat || null,
    keperluan,
    staff,
    dituju,
  ];

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

    res.status(201).json({ message: "Data tamu berhasil disimpan!" });
  });
});

// ✅ PUT /api/tamu/:id - Update data tamu
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

// ✅ DELETE /api/tamu/:id - Hapus data tamu
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

// ✅ GET /api/tamu - Ambil semua data tamu (untuk dashboard admin)
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tamu ORDER BY tanggal_kehadiran DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data tamu:", err);
      return res.status(500).json({ error: "Gagal mengambil data tamu" });
    }

    res.json({ tamu: results });
  });
});

module.exports = router;

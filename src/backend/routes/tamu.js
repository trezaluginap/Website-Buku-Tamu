// routes/tamu.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Endpoint untuk menyimpan data tamu
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

  // Validasi data yang wajib
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
      return res.status(500).json({ error: "Gagal menyimpan data tamu." });
    }

    res.status(201).json({ message: "Data tamu berhasil disimpan!" });
  });
});

module.exports = router;

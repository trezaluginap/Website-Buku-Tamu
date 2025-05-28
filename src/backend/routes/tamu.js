// routes/tamu.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Pastikan path ini benar

// GET /api/tamu - Ambil semua data tamu (Tetap sama)
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tamu ORDER BY tanggal_kehadiran DESC, id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ BACKEND: Gagal mengambil semua data tamu:", err);
      return res.status(500).json({ error: "Gagal mengambil data tamu" });
    }
    res.json(results);
  });
});

// GET /api/tamu/:id - Ambil data tamu spesifik (Tetap sama)
router.get("/:id", (req, res) => {
  const guestId = req.params.id;
  console.log(`BACKEND: Menerima permintaan GET untuk /api/tamu/${guestId}`);
  const sql = "SELECT * FROM tamu WHERE id = ?";
  db.query(sql, [guestId], (err, results) => {
    if (err) {
      /* ... handling error ... */
    }
    if (results.length === 0) {
      /* ... handling not found ... */
    }
    res.json(results[0]);
  });
});

// POST /api/tamu - Menyimpan data tamu baru
router.post("/", (req, res) => {
  const newGuestData = { ...req.body };
  const jam_submit_data = new Date(); // Waktu saat ini di server

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
    tanggal_kehadiran, // status akan di-handle di bawah
    tujuan_kunjungan,
    topik_konsultasi,
    deskripsi_kebutuhan,
    // Field baru dari form tindak lanjut mungkin belum ada saat POST awal
    // diterima_oleh, isi_pertemuan, dokumentasi
  } = newGuestData;

  const status = newGuestData.status || "Belum Diproses"; // Default status

  if (!nama_lengkap || !jenis_kelamin || !keperluan || !tanggal_kehadiran) {
    return res
      .status(400)
      .json({
        error:
          "Data wajib (Nama, Jenis Kelamin, Keperluan, Tanggal Kehadiran) tidak lengkap.",
      });
  }
  let formattedDate;
  try {
    formattedDate = new Date(tanggal_kehadiran).toISOString().split("T")[0];
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Format tanggal kehadiran tidak valid." });
  }

  const sql = `
    INSERT INTO tamu 
    (nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan, staff, dituju, 
     tanggal_kehadiran, status, tujuan_kunjungan, topik_konsultasi, deskripsi_kebutuhan, 
     jam_submit_data) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Perhatikan penambahan jam_submit_data dan placeholder '?'
  // Field lain seperti diterima_oleh, isi_pertemuan, dokumentasi biasanya diisi saat UPDATE/FollowUp

  const values = [
    nama_lengkap,
    jenis_kelamin,
    email || null,
    no_hp || null,
    pekerjaan || null,
    alamat || null,
    keperluan,
    staff || null,
    dituju || null,
    formattedDate,
    status,
    tujuan_kunjungan || null,
    topik_konsultasi || null,
    deskripsi_kebutuhan || null,
    jam_submit_data, // Tambahkan nilai jam_submit_data
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ BACKEND: Gagal menyimpan data tamu baru:", err);
      // ... (error handling spesifik Anda) ...
      return res
        .status(500)
        .json({ error: "Gagal menyimpan data tamu", detail: err.message });
    }
    console.log(
      "BACKEND: Data tamu baru berhasil disimpan, ID:",
      result.insertId
    );
    res.status(201).json({
      message: "Data tamu berhasil disimpan!",
      id: result.insertId,
      status: status,
      jam_submit_data: jam_submit_data, // Kembalikan juga jam submit jika perlu
    });
  });
});

// PUT /api/tamu/:id - Update data tamu (MODIFIKASI BESAR DI SINI)
router.put("/:id", (req, res) => {
  const guestId = req.params.id;
  const receivedFields = req.body;
  const currentTime = new Date(); // Waktu saat ini di server untuk timestamp

  console.log(`BACKEND: Menerima permintaan PUT untuk /api/tamu/${guestId}`);
  console.log("BACKEND: Data yang diterima untuk diupdate:", receivedFields);

  // 1. Ambil data tamu saat ini dari database
  const selectSql = "SELECT * FROM tamu WHERE id = ?";
  db.query(selectSql, [guestId], (errFetch, currentResults) => {
    if (errFetch) {
      console.error(
        `❌ BACKEND: Gagal mengambil data tamu ID ${guestId} sebelum update:`,
        errFetch
      );
      return res
        .status(500)
        .json({
          error: "Gagal memproses update (tidak bisa fetch data awal).",
          detail: errFetch.message,
        });
    }
    if (currentResults.length === 0) {
      return res
        .status(404)
        .json({ error: `Data tamu dengan ID ${guestId} tidak ditemukan.` });
    }
    const currentGuest = currentResults[0];

    // 2. Siapkan field yang akan diupdate
    const fieldsToUpdate = {};
    const allowedFieldsToUpdate = [
      // Field yang diizinkan diupdate dari frontend
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
      "status",
      "tujuan_kunjungan",
      "topik_konsultasi",
      "deskripsi_kebutuhan",
      "diterima_oleh",
      "isi_pertemuan",
      "dokumentasi",
    ];

    allowedFieldsToUpdate.forEach((field) => {
      if (receivedFields.hasOwnProperty(field)) {
        if (field === "tanggal_kehadiran" && receivedFields[field]) {
          try {
            fieldsToUpdate[field] = new Date(receivedFields[field])
              .toISOString()
              .split("T")[0];
          } catch (e) {
            fieldsToUpdate[field] =
              currentGuest[field]; /* atau null atau biarkan error */
          }
        } else {
          fieldsToUpdate[field] =
            receivedFields[field] === "" || receivedFields[field] === undefined
              ? null
              : receivedFields[field];
        }
      }
    });

    // 3. Logika untuk timestamp kondisional
    // Set jam_diterima jika belum ada dan status baru adalah "Diproses"
    // ATAU jika diterima_oleh baru diisi dan jam_diterima belum ada
    if (!currentGuest.jam_diterima) {
      if (
        fieldsToUpdate.status === "Diproses" ||
        (fieldsToUpdate.diterima_oleh && !currentGuest.diterima_oleh)
      ) {
        fieldsToUpdate.jam_diterima = currentTime;
        console.log(
          `BACKEND: Menetapkan jam_diterima untuk ID ${guestId} ke ${currentTime}`
        );
      }
    }

    // Set jam_selesai_tindak_lanjut jika belum ada dan status baru adalah "Selesai"
    if (
      !currentGuest.jam_selesai_tindak_lanjut &&
      fieldsToUpdate.status === "Selesai"
    ) {
      fieldsToUpdate.jam_selesai_tindak_lanjut = currentTime;
      console.log(
        `BACKEND: Menetapkan jam_selesai_tindak_lanjut untuk ID ${guestId} ke ${currentTime}`
      );
    }

    // Jika tidak ada field yang diupdate (selain timestamp yang mungkin baru ditambahkan)
    // kita harus memastikan setidaknya ada satu field di `fieldsToSet` agar query SQL valid
    // atau jika hanya timestamp yang diupdate, itu sudah cukup.
    const fieldEntries = Object.entries(fieldsToUpdate);
    if (fieldEntries.length === 0) {
      console.log(
        "BACKEND: Tidak ada field yang perlu diupdate (selain mungkin timestamp yang sudah ada)."
      );
      // Bisa kirim respons bahwa tidak ada yang diupdate, atau lanjutkan jika timestamp diupdate
      // Untuk sekarang, kita anggap jika ada timestamp baru, itu adalah update.
      // Jika tidak ada perubahan sama sekali, kirim respons 'tidak ada perubahan'.
      // Namun, kode di bawah akan tetap jalan jika fieldsToUpdate terisi oleh timestamp.
      if (
        Object.keys(fieldsToUpdate).filter(
          (k) => allowedFieldsToUpdate.includes(k) || k.startsWith("jam_")
        ).length === 0
      ) {
        return res.status(200).json({ message: "Tidak ada data yang diubah." });
      }
    }

    const setClauses = fieldEntries.map(([key]) => `\`${key}\` = ?`).join(", ");
    const finalValues = fieldEntries.map(([, value]) => value);
    finalValues.push(guestId);

    const updateSql = `UPDATE tamu SET ${setClauses} WHERE id = ?`;

    console.log("BACKEND: SQL Update Query:", updateSql);
    console.log("BACKEND: Values untuk SQL Update:", finalValues);

    db.query(updateSql, finalValues, (errUpdate, result) => {
      if (errUpdate) {
        console.error(
          `❌ BACKEND: Gagal mengupdate data tamu ID ${guestId}:`,
          errUpdate
        );
        return res
          .status(500)
          .json({
            error: "Gagal mengupdate data tamu di database.",
            detail: errUpdate.sqlMessage || errUpdate.message,
          });
      }
      if (result.affectedRows === 0) {
        // Ini seharusnya tidak terjadi jika fetch awal berhasil, tapi sebagai pengaman
        return res
          .status(404)
          .json({
            error: `Data tamu dengan ID ${guestId} tidak ditemukan saat mencoba update.`,
          });
      }
      console.log(`BACKEND: Data tamu ID ${guestId} berhasil diupdate.`);
      db.query(selectSql, [guestId], (errFetchAgain, updatedGuestResult) => {
        if (errFetchAgain || updatedGuestResult.length === 0) {
          return res.json({
            message:
              "Data tamu berhasil diperbarui (gagal mengambil data terbaru).",
          });
        }
        res.json({
          message: "Data tamu berhasil diperbarui",
          guest: updatedGuestResult[0],
        });
      });
    });
  });
});

// DELETE /api/tamu/:id - Hapus data tamu (Tetap sama)
router.delete("/:id", (req, res) => {
  // ... (kode delete Anda) ...
  const guestId = req.params.id;
  console.log(`BACKEND: Menerima permintaan DELETE untuk /api/tamu/${guestId}`);
  const sql = "DELETE FROM tamu WHERE id = ?";
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.error(
        `❌ BACKEND: Gagal menghapus data tamu ID ${guestId}:`,
        err
      );
      return res.status(500).json({ error: "Gagal menghapus data tamu" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          error: `Data tamu dengan ID ${guestId} tidak ditemukan untuk dihapus`,
        });
    }
    console.log(`BACKEND: Data tamu ID ${guestId} berhasil dihapus.`);
    res.json({ message: "Data tamu berhasil dihapus" });
  });
});

module.exports = router;

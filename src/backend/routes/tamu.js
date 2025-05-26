// C:/Users/Dell/buku-tamuu/src/backend/routes/tamu.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Pastikan path ini benar ke konfigurasi database Anda

// GET /api/tamu - Ambil semua data tamu
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tamu ORDER BY tanggal_kehadiran DESC, id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ BACKEND: Gagal mengambil semua data tamu:", err);
      return res.status(500).json({ error: "Gagal mengambil data tamu" });
    }
    // console.log("BACKEND: Berhasil mengambil semua data tamu."); // Bisa diaktifkan jika perlu
    res.json(results);
  });
});

// GET /api/tamu/:id - Ambil data tamu spesifik berdasarkan ID
router.get("/:id", (req, res) => {
  const guestId = req.params.id;
  console.log(`BACKEND: Menerima permintaan GET untuk /api/tamu/${guestId}`);
  const sql = "SELECT * FROM tamu WHERE id = ?";
  db.query(sql, [guestId], (err, results) => {
    if (err) {
      console.error(
        `❌ BACKEND: Gagal mengambil data tamu dengan ID ${guestId}:`,
        err
      );
      return res
        .status(500)
        .json({ error: "Gagal mengambil data tamu dari database" });
    }
    if (results.length === 0) {
      console.log(`BACKEND: Tamu dengan ID ${guestId} tidak ditemukan.`);
      // Penting: Kirim pesan JSON, bukan HTML error default server jika route tidak ada
      return res
        .status(404)
        .json({ message: `Data tamu dengan ID ${guestId} tidak ditemukan` });
    }
    console.log(`BACKEND: Tamu dengan ID ${guestId} ditemukan:`, results[0]);
    res.json(results[0]);
  });
});

// POST /api/tamu - Menyimpan data tamu baru
router.post("/", (req, res) => {
  const newGuest = { ...req.body, status: req.body.status || "Belum Diproses" };
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
    status,
    tujuan_kunjungan,
    topik_konsultasi,
    deskripsi_kebutuhan,
    diterima_oleh,
    isi_pertemuan,
    dokumentasi,
  } = newGuest;

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
    console.error(
      "BACKEND: Format tanggal tidak valid saat POST:",
      tanggal_kehadiran
    );
    return res
      .status(400)
      .json({ error: "Format tanggal kehadiran tidak valid." });
  }

  const sql = `
    INSERT INTO tamu 
    (nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan, staff, dituju, tanggal_kehadiran, status, tujuan_kunjungan, topik_konsultasi, deskripsi_kebutuhan, diterima_oleh, isi_pertemuan, dokumentasi) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
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
    diterima_oleh || null,
    isi_pertemuan || null,
    dokumentasi || null,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ BACKEND: Gagal menyimpan data tamu baru:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "Data duplikat ditemukan", detail: err.sqlMessage });
      } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({
            error: "Referensi foreign key tidak valid",
            detail: err.sqlMessage,
          });
      } else if (err.code === "ER_DATA_TOO_LONG") {
        return res
          .status(400)
          .json({
            error: "Data terlalu panjang untuk kolom",
            detail: err.sqlMessage,
          });
      }
      return res
        .status(500)
        .json({ error: "Gagal menyimpan data tamu", detail: err.message });
    }
    console.log(
      "BACKEND: Data tamu baru berhasil disimpan, ID:",
      result.insertId
    );
    res
      .status(201)
      .json({
        message: "Data tamu berhasil disimpan!",
        id: result.insertId,
        status: status,
      });
  });
});

// PUT /api/tamu/:id - Update data tamu
router.put("/:id", (req, res) => {
  const guestId = req.params.id;
  const receivedFields = req.body; // Ini bisa FormData atau JSON

  console.log(`BACKEND: Menerima permintaan PUT untuk /api/tamu/${guestId}`);

  // Jika Content-Type adalah multipart/form-data, req.body mungkin perlu penanganan khusus
  // atau middleware seperti multer sudah menanganinya. Untuk sekarang kita asumsikan
  // jika ada file, field lain juga ada di req.body berkat multer.
  // Jika tidak ada file, receivedFields adalah objek JSON biasa.
  console.log("BACKEND: Data yang diterima (req.body):", receivedFields);

  // Daftar field yang diizinkan untuk diupdate
  const allowedFieldsToUpdate = [
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
    // Jika ada file, nama field file (misal "dokumentasiFile") akan dihandle terpisah oleh multer
    // dan URL-nya yang akan disimpan ke kolom "dokumentasi".
  ];

  const fieldsToSet = [];
  const values = [];

  // Loop melalui field yang diizinkan, bukan req.body, untuk keamanan
  allowedFieldsToUpdate.forEach((field) => {
    if (receivedFields.hasOwnProperty(field)) {
      fieldsToSet.push(`\`${field}\` = ?`);

      if (field === "tanggal_kehadiran" && receivedFields[field]) {
        try {
          // Pastikan tanggal_kehadiran yang diterima adalah string yang bisa di-parse
          if (typeof receivedFields[field] === "string") {
            values.push(
              new Date(receivedFields[field]).toISOString().split("T")[0]
            );
          } else {
            // Jika sudah objek Date (meskipun jarang dari JSON body), format langsung
            values.push(
              new Date(receivedFields[field]).toISOString().split("T")[0]
            );
          }
        } catch (dateError) {
          console.warn(
            `BACKEND: Format tanggal tidak valid untuk ${field} saat PUT: ${receivedFields[field]}. Menggunakan nilai null.`
          );
          values.push(null); // Set ke null jika format tanggal salah
        }
      } else {
        // Kirim null jika value string kosong atau undefined, kecuali jika string kosong adalah nilai valid
        values.push(
          receivedFields[field] === "" || receivedFields[field] === undefined
            ? null
            : receivedFields[field]
        );
      }
    }
  });

  // Jika ada file yang diunggah (misalnya sudah diproses oleh multer dan path/URLnya ada di req.file.path atau req.body.dokumentasiUrlDariMulter)
  // Anda perlu menambahkan logika untuk mengupdate field 'dokumentasi' dengan URL/path file tersebut.
  // Contoh (jika multer menyimpan URL di req.body.dokumentasiUrlHasilUpload):
  // if (req.body.dokumentasiUrlHasilUpload) {
  //   if (!allowedFieldsToUpdate.includes('dokumentasi')) { // Pastikan 'dokumentasi' ada di allowedFields
  //      fieldsToSet.push(`\`dokumentasi\` = ?`);
  //      values.push(req.body.dokumentasiUrlHasilUpload);
  //   } else { // Jika 'dokumentasi' sudah ada di allowedFields, update nilainya di 'values'
  //      const dokIndex = allowedFieldsToUpdate.indexOf('dokumentasi');
  //      if (dokIndex > -1 && fieldsToSet.includes(`\`dokumentasi\` = ?`)) { // Cek apakah field dokumentasi termasuk yang diupdate
  //          const valueIndex = fieldsToSet.indexOf(`\`dokumentasi\` = ?`);
  //          values[valueIndex] = req.body.dokumentasiUrlHasilUpload;
  //      }
  //   }
  // }

  if (fieldsToSet.length === 0) {
    console.log(
      "BACKEND: Tidak ada field valid yang dikirim untuk diupdate dari payload yang diterima."
    );
    return res
      .status(400)
      .json({ error: "Tidak ada data valid yang dikirim untuk diupdate." });
  }

  values.push(guestId); // Tambahkan ID untuk klausa WHERE di akhir array values

  const sql = `UPDATE tamu SET ${fieldsToSet.join(", ")} WHERE id = ?`;

  console.log("BACKEND: SQL Update Query yang akan dijalankan:", sql);
  console.log("BACKEND: Values untuk SQL Update Query:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(
        `❌ BACKEND: Gagal mengupdate data tamu ID ${guestId}:`,
        err
      );
      console.error("BACKEND: Error Code:", err.code);
      console.error("BACKEND: Error SQL Message:", err.sqlMessage);
      console.error("BACKEND: SQL State:", err.sqlState);
      return res.status(500).json({
        error: "Gagal mengupdate data tamu di database.",
        detail: err.sqlMessage || err.message,
      });
    }

    if (result.affectedRows === 0) {
      console.log(
        `BACKEND: Tidak ada baris yang terpengaruh. Tamu dengan ID ${guestId} mungkin tidak ditemukan.`
      );
      return res
        .status(404)
        .json({
          error: `Data tamu dengan ID ${guestId} tidak ditemukan untuk diupdate.`,
        });
    }

    console.log(
      `BACKEND: Data tamu ID ${guestId} berhasil diupdate. Rows affected: ${result.affectedRows}`
    );
    db.query(
      "SELECT * FROM tamu WHERE id = ?",
      [guestId],
      (errSelect, updatedGuest) => {
        if (errSelect || updatedGuest.length === 0) {
          console.warn(
            `BACKEND: Berhasil update, namun gagal mengambil data terbaru untuk ID ${guestId}.`
          );
          // Kirim respons sukses dasar jika pengambilan data terbaru gagal
          return res.json({ message: "Data tamu berhasil diperbarui." });
        }
        res.json({
          message: "Data tamu berhasil diperbarui",
          guest: updatedGuest[0],
        });
      }
    );
  });
});

// DELETE /api/tamu/:id - Hapus data tamu
router.delete("/:id", (req, res) => {
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

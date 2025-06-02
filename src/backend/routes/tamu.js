// C:/Users/Dell/buku-tamuu/src/backend/routes/tamu.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { formatInTimeZone } = require('date-fns-tz'); // Untuk format ke string WIB
const { parseISO, isValid: isValidDate, getUTCFullYear, getUTCMonth, getUTCDate } = require('date-fns'); // Untuk parsing dan validasi

// GET /api/tamu
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tamu ORDER BY tanggal_kehadiran DESC, id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ BACKEND: Gagal mengambil semua data tamu:", err);
      return res
        .status(500)
        .json({ error: "Gagal mengambil data tamu", detail: err.message });
    }
    res.json(results);
  });
});

// GET /api/tamu/:id
router.get("/:id", (req, res) => {
  const guestId = req.params.id;
  const sql = "SELECT * FROM tamu WHERE id = ?";
  db.query(sql, [guestId], (err, results) => {
    if (err) {
      console.error(`❌ BACKEND: Gagal mengambil data tamu dengan ID ${guestId}:`, err);
      return res.status(500).json({ error: "Gagal mengambil data tamu dari database" });
    }
    if (results.length === 0) {
      console.log(`BACKEND: Tamu dengan ID ${guestId} tidak ditemukan.`);
      return res.status(404).json({ message: `Data tamu dengan ID ${guestId} tidak ditemukan` });
    }
    console.log(`BACKEND: Tamu dengan ID ${guestId} ditemukan:`, results[0]);
    res.json(results[0]);
  });
});

// POST /api/tamu - Menyimpan data tamu baru
router.post("/", (req, res) => {
  console.log("[POST /api/tamu] DATA DITERIMA (req.body):", JSON.stringify(req.body, null, 2));
  const newGuestData = { ...req.body, status: req.body.status || "Belum Diproses" };
  const {
    nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan,
    staff, dituju, tanggal_kehadiran: tanggalKehadiranInputString,
    status, tujuan_kunjungan, topik_konsultasi, deskripsi_kebutuhan,
    diterima_oleh, isi_pertemuan, dokumentasi,
  } = newGuestData;

  console.log("[POST /api/tamu] NILAI SETELAH DESTRUCTURING:", {
    nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan,
    staff, dituju, tanggalKehadiranInputString, status, tujuan_kunjungan,
    topik_konsultasi, deskripsi_kebutuhan, diterima_oleh, isi_pertemuan, dokumentasi
  });

  if (!nama_lengkap || !jenis_kelamin || !keperluan || !tanggalKehadiranInputString) {
    console.warn("[POST /api/tamu] Validasi gagal: Data wajib tidak lengkap.");
    return res.status(400).json({
      error: "Data wajib (Nama, Jenis Kelamin, Keperluan, Tanggal Kehadiran) tidak lengkap.",
    });
  }

  const targetTimeZone = 'Asia/Jakarta';
  let datePartFromForm_YYYY_MM_DD;

  try {
    let year, month, day;
    if (/^\d{4}-\d{2}-\d{2}$/.test(tanggalKehadiranInputString)) {
        const parsed = parseISO(tanggalKehadiranInputString);
        if (isValidDate(parsed)) {
            year = parsed.getUTCFullYear(); // Sebaiknya gunakan getFullYear jika input dianggap local date
            month = parsed.getUTCMonth() + 1; // getMonth jika input dianggap local date
            day = parsed.getUTCDate();       // getDate jika input dianggap local date
        }
    } else {
        const parts = String(tanggalKehadiranInputString).split('/'); // Pastikan ini string
        if (parts.length === 3 && parts.every(p => /^\d+$/.test(p))) {
            const d = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            const y = parseInt(parts[2]);
            if (y > 1900 && y < 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) { // Validasi sederhana
                year = y; month = m; day = d;
            }
        }
    }
    if (!year || !month || !day) throw new Error("Format tanggal input tidak dikenali atau tidak valid.");
    datePartFromForm_YYYY_MM_DD = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log("[DEBUG] Date part from form (YYYY-MM-DD):", datePartFromForm_YYYY_MM_DD);
  } catch (e) {
    console.error("BACKEND: Error parsing tanggal_kehadiranInputString:", tanggalKehadiranInputString, e);
    return res.status(400).json({ error: "Format Tanggal Kedatangan tidak valid. Gunakan YYYY-MM-DD atau DD/MM/YYYY." });
  }

  let currentTimeString_HH_MM_SS_WIB;
  try {
    currentTimeString_HH_MM_SS_WIB = formatInTimeZone(new Date(), targetTimeZone, 'HH:mm:ss');
    console.log("[DEBUG] Current time string in WIB (HH:mm:ss):", currentTimeString_HH_MM_SS_WIB);
  } catch(e) {
    console.error("BACKEND: Error formatting current time in WIB:", e);
    return res.status(500).json({ error: "Gagal mendapatkan waktu server saat ini." });
  }
  
  const finalDateTimeStringForDB_WIB = `${datePartFromForm_YYYY_MM_DD} ${currentTimeString_HH_MM_SS_WIB}`;
  console.log("BACKEND: Final DateTime string untuk SQL (WIB wall clock):", finalDateTimeStringForDB_WIB);

  // --- PERBAIKAN SQL QUERY ---
  // Hapus komentar JavaScript (//) dari dalam string SQL.
  // Jika ingin memberi catatan, gunakan komentar SQL /* ... */ atau letakkan di luar string.
  const sql = `
    INSERT INTO tamu 
    (nama_lengkap, jenis_kelamin, email, no_hp, pekerjaan, alamat, keperluan, 
     staff, dituju, tanggal_kehadiran, status, tujuan_kunjungan, 
     topik_konsultasi, deskripsi_kebutuhan, diterima_oleh, isi_pertemuan, dokumentasi) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    nama_lengkap, jenis_kelamin, email || null, no_hp || null, pekerjaan || null, alamat || null, keperluan,
    staff || null, dituju || null, finalDateTimeStringForDB_WIB, 
    status, tujuan_kunjungan || null, topik_konsultasi || null, deskripsi_kebutuhan || null,
    diterima_oleh || null, isi_pertemuan || null, dokumentasi || null,
  ];

  console.log("[POST /api/tamu] VALUES UNTUK SQL:", values);
  console.log("[POST /api/tamu] SQL QUERY:", sql);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ BACKEND: Gagal menyimpan data tamu baru:", err);
      if (err.code === "ER_DUP_ENTRY") { return res.status(409).json({ error: "Data duplikat ditemukan", detail: err.sqlMessage });}
      else if (err.code === "ER_NO_REFERENCED_ROW_2") { return res.status(400).json({ error: "Referensi foreign key tidak valid",detail: err.sqlMessage,});}
      else if (err.code === "ER_DATA_TOO_LONG") { return res.status(400).json({ error: "Data terlalu panjang untuk kolom", detail: err.sqlMessage,});}
      else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.message.includes('datetime')) {
          console.error("Detail error SQL: Kemungkinan format datetime tidak sesuai dengan kolom database tamu.");
          return res.status(500).json({ error: "Gagal menyimpan data tamu (masalah format tanggal)", detail: err.message });
      }
      return res.status(500).json({ error: "Gagal menyimpan data tamu", detail: err.message });
    }
    console.log("BACKEND: Data tamu baru berhasil disimpan, ID:", result.insertId);
    res.status(201).json({
        message: "Data tamu berhasil disimpan!",
        id: result.insertId,
        status: status, // Mengembalikan status yang disimpan
        tanggalKehadiranTersimpan: finalDateTimeStringForDB_WIB 
    });
  });
});

// PUT /api/tamu/:id
router.put("/:id", (req, res) => {
  const guestId = req.params.id;
  const receivedFields = req.body; 

  console.log(`[PUT /api/tamu/${guestId}] DATA DITERIMA (req.body):`, JSON.stringify(receivedFields, null, 2));

  const allowedFieldsToUpdate = [ // Pastikan "jam_tindak_lanjut" ada di sini
    "nama_lengkap", "jenis_kelamin", "email", "no_hp", "pekerjaan", 
    "alamat", "keperluan", "staff", "dituju", "tanggal_kehadiran", 
    "status", "tujuan_kunjungan", "topik_konsultasi", "deskripsi_kebutuhan", 
    "diterima_oleh", "isi_pertemuan", "dokumentasi", "jam_tindak_lanjut" 
  ];

  const fieldsToSet = [];
  const valuesForUpdate = []; 

  allowedFieldsToUpdate.forEach((field) => {
    if (receivedFields.hasOwnProperty(field)) { 
      fieldsToSet.push(`\`${field}\` = ?`); 

      if (field === "tanggal_kehadiran" && receivedFields[field]) {
        let dateToStore;
        try {
          const parsedDate = parseISO(receivedFields[field]); // Coba parse sebagai ISO string
          if (isValidDate(parsedDate)) {
      
            dateToStore = receivedFields[field]; // Asumsikan format sudah oke atau MySQL bisa handle
            // Jika HANYA tanggal: dateToStore = parsedDate.toISOString().split("T")[0]; 
          } else {
            // Fallback jika parseISO gagal tapi mungkin formatnya YYYY-MM-DD manual
            if (/^\d{4}-\d{2}-\d{2}$/.test(receivedFields[field])) {
                dateToStore = receivedFields[field];
            } else {
                throw new Error('Invalid date string for tanggal_kehadiran update');
            }
          }
        } catch (dateError) {
          console.warn(`BACKEND (PUT): Format tanggal tidak valid untuk ${field}: ${receivedFields[field]}. Menggunakan nilai null.`);
          dateToStore = null; 
        }
        valuesForUpdate.push(dateToStore);
      } else {
        // Untuk semua field lain, termasuk jam_tindak_lanjut
        // Jika frontend mengirim string ISO timestamp untuk jam_tindak_lanjut, itu akan masuk sini
        valuesForUpdate.push(
          (receivedFields[field] === "" || receivedFields[field] === undefined) && field !== 'status'
            ? null
            : receivedFields[field]
        );
      }
    }
  });
  
  console.log(`[PUT /api/tamu/${guestId}] FIELDS TO SET: [${fieldsToSet.join(", ")}]`);
  console.log(`[PUT /api/tamu/${guestId}] VALUES FOR UPDATE:`, valuesForUpdate);


  if (fieldsToSet.length === 0) {
    console.log(`[PUT /api/tamu/${guestId}] Tidak ada field valid yang dikirim untuk diupdate.`);
    // Mengembalikan data tamu saat ini tanpa melakukan update jika tidak ada field yang valid
    // atau bisa juga dianggap sebagai sukses jika memang tidak ada yang perlu diubah.
    // Untuk konsistensi, kita ambil data terbaru saja.
    db.query("SELECT * FROM tamu WHERE id = ?", [guestId], (errSelect, currentGuest) => {
        if (errSelect || currentGuest.length === 0) {
          return res.status(404).json({ message: "Data tamu tidak ditemukan (saat mencoba mengembalikan data tanpa update)." });
        }
        return res.json({ message: "Tidak ada perubahan data.", guest: currentGuest[0] });
    });
    return; // Hentikan eksekusi lebih lanjut
  }

  valuesForUpdate.push(guestId); // Tambahkan guestId untuk klausa WHERE
  const sql = `UPDATE tamu SET ${fieldsToSet.join(", ")} WHERE id = ?`;

  console.log("BACKEND (PUT): SQL Update Query:", sql);
  console.log("BACKEND (PUT): SQL Values:", valuesForUpdate);
  
  db.query(sql, valuesForUpdate, (err, result) => {
    if (err) {
      console.error(`❌ BACKEND: Gagal update tamu ID ${guestId}:`, err);
      // Tambahkan penanganan error spesifik jika ada
      if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.message.includes('datetime')) {
        console.error("Detail error SQL: Kemungkinan format datetime (tanggal_kehadiran atau jam_tindak_lanjut) tidak sesuai dengan kolom database tamu.");
        return res.status(500).json({ error: "Gagal mengupdate data tamu (masalah format tanggal)", detail: err.message });
      }
      return res.status(500).json({ error: "Gagal mengupdate data tamu.", detail: err.sqlMessage || err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Tamu ID ${guestId} tidak ditemukan untuk diupdate.`});
    }
    // Ambil data terbaru setelah update untuk dikirim kembali
    db.query("SELECT * FROM tamu WHERE id = ?", [guestId], (errSelect, updatedGuest) => {
      if (errSelect || updatedGuest.length === 0) {
        // Ini seharusnya tidak terjadi jika update berhasil pada baris yang ada
        console.error(`❌ BACKEND: Gagal mengambil data tamu ID ${guestId} setelah update berhasil.`);
        return res.json({ message: "Data tamu berhasil diperbarui (tetapi gagal mengambil data terbaru)." });
      }
      console.log(`BACKEND: Data tamu ID ${guestId} berhasil diupdate.`);
      res.json({ message: "Data tamu berhasil diperbarui", guest: updatedGuest[0] });
    });
  });
});

// DELETE /api/tamu/:id
router.delete("/:id", (req, res) => {
  const guestId = req.params.id;
  console.log(`BACKEND: Menerima permintaan DELETE untuk /api/tamu/${guestId}`);
  const sql = "DELETE FROM tamu WHERE id = ?";
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.error(`❌ BACKEND: Gagal menghapus data tamu ID ${guestId}:`,err);
      return res.status(500).json({ error: "Gagal menghapus data tamu" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Data tamu dengan ID ${guestId} tidak ditemukan untuk dihapus`});
    }
    console.log(`BACKEND: Data tamu ID ${guestId} berhasil dihapus.`);
    res.json({ message: "Data tamu berhasil dihapus" });
  });
});

module.exports = router;

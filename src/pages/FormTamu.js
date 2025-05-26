// src/pages/FormTamu.js (Versi Multi-Step Disesuaikan)
import React, { useState, useEffect, useCallback } from "react";
import "../styles/Form.css"; // Gunakan CSS baru/terpisah untuk form ini
import BPSLogo from "../assets/BPS.png";

const FormTamu = () => {
  const today = new Date();
  // Menggunakan ISOString lengkap untuk tanggal_kehadiran internal
  const initialTimestamp = today.toISOString();

  const initialFormData = {
    nama_lengkap: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    pekerjaan: "",
    tanggal_kehadiran: initialTimestamp, // Simpan full ISO string
    alamat: "",
    keperluan: "", // Keperluan utama akan disimpan di sini
    dituju: "",
    tujuan_kunjungan: "", // Untuk mitra & tamu umum
    topik_konsultasi: "", // Untuk konsultasi
    deskripsi_kebutuhan: "", // Untuk konsultasi
    // status: "Belum Diproses" // Status akan ditambahkan saat submit
  };

  const [formData, setFormData] = useState(initialFormData);
  // const [keperluan, setKeperluan] = useState(""); // selectedKeperluan untuk UI logic
  const [selectedKeperluanUI, setSelectedKeperluanUI] = useState(""); // Untuk kontrol tampilan sub-form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set tanggal_kehadiran dengan timestamp saat ini ketika komponen pertama kali dimuat
    // dan pastikan formData diinisialisasi dengan benar
    setFormData((prev) => ({
      ...initialFormData, // Selalu mulai dari initial form data bersih
      tanggal_kehadiran: new Date().toISOString(), // Update dengan waktu terkini saat mount
    }));

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Hanya dijalankan sekali saat mount

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "keperluan") {
      setSelectedKeperluanUI(value); // Update UI state untuk keperluan
      // Juga update formData.keperluan
      setFormData((prev) => ({
        ...prev,
        keperluan: value,
        // Reset field terkait saat keperluan utama berubah
        tujuan_kunjungan:
          value === "mitra_statistik" || value === "tamu_umum"
            ? prev.tujuan_kunjungan
            : "",
        topik_konsultasi:
          value === "konsultasi_statistik" ? prev.topik_konsultasi : "",
        deskripsi_kebutuhan:
          value === "konsultasi_statistik" ? prev.deskripsi_kebutuhan : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0].name : value, // Hati-hati dengan file handling ini jika untuk upload sebenarnya
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin mengirim formulir ini?"))
      return;

    setIsSubmitting(true);
    try {
      // Pastikan payload menggunakan timestamp terkini saat submit
      // dan status ditambahkan di sini
      const payload = {
        ...formData,
        tanggal_kehadiran: new Date().toISOString(), // Waktu presisi saat submit
        status: "Belum Diproses",
      };
      console.log("Mengirim data (multi-step):", payload);

      const response = await fetch("http://localhost:5000/api/tamu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Data berhasil dikirim! ID: ${result.id || "N/A"}, Status: ${
            result.status || "Belum Diproses"
          }`
        );
        // Reset form secara keseluruhan
        e.target.reset(); // Reset field HTML (jika ada yg tidak terkontrol state)
        setSelectedKeperluanUI("");
        setFormData({
          // Reset state formData ke kondisi awal dengan timestamp baru
          ...initialFormData,
          tanggal_kehadiran: new Date().toISOString(),
        });
        setFormStep(1); // Kembali ke step 1
      } else {
        const errorData = await response
          .json()
          .catch(() => ({
            message: "Gagal mengirim data dan membaca detail error.",
          }));
        alert(
          `Gagal mengirim data. ${errorData.message || response.statusText}`
        );
        console.error("Submit error:", errorData);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data. Cek konsol.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    // Validasi sederhana sebelum lanjut (opsional, bisa diperluas)
    if (
      !formData.nama_lengkap ||
      !formData.jenis_kelamin ||
      !formData.no_hp ||
      !formData.alamat
    ) {
      alert(
        "Mohon lengkapi semua field yang wajib diisi di Informasi Pribadi."
      );
      return;
    }
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevStep = (e) => {
    e.preventDefault();
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDayName = () => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[new Date().getDay()]; // Gunakan tanggal saat ini untuk nama hari
  };

  // Format tanggal untuk tampilan di header (DD/MM/YYYY)
  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan adalah 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    // Ganti class .container menjadi .form-tamu-ms-container untuk CSS yang lebih spesifik
    <div className={`form-tamu-ms-container ${isLoaded ? "loaded" : ""}`}>
      <form onSubmit={handleSubmit} id="guestRegistrationMultiStepForm">
        <div className="form-tamu-ms-header">
          <div className="form-tamu-ms-logo-container">
            <img src={BPSLogo} alt="BPS Logo" className="form-tamu-ms-logo" />
          </div>
          <h2>Buku Tamu Digital</h2>
          <p className="form-tamu-ms-description">
            Registrasi kunjungan untuk hari {getDayName()},{" "}
            {/* Tampilkan tanggal hari ini untuk header */}
            {formatDateForDisplay(new Date().toISOString())}. Mohon lengkapi
            semua field.
          </p>
        </div>

        {/* Konten Step 1 */}
        {formStep === 1 && (
          <div className="form-tamu-ms-content">
            <div className="form-tamu-ms-section">
              <h3 className="form-tamu-ms-section-title">Informasi Pribadi</h3>
              <div className="form-tamu-ms-grid">
                <div className="form-tamu-ms-group">
                  <label htmlFor="nama_lengkap" className="required">
                    Nama Lengkap
                  </label>
                  <input
                    id="nama_lengkap"
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap || ""}
                    required
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="jenis_kelamin" className="required">
                    Jenis Kelamin
                  </label>
                  <select
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin || ""}
                    required
                    onChange={handleChange}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                  />
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="no_hp" className="required">
                    No HP
                  </label>
                  <input
                    id="no_hp"
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp || ""}
                    pattern="^08[0-9]{8,12}$"
                    title="Format: 08xxxxxxxxxx (10-14 digit)"
                    required
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="pekerjaan">Pekerjaan / Instansi</label>
                  <input
                    id="pekerjaan"
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan || ""}
                    onChange={handleChange}
                    placeholder="Mahasiswa, PNS, Swasta, dll."
                  />
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="tanggal_kehadiran_display">
                    Tanggal Kedatangan
                  </label>
                  <input
                    id="tanggal_kehadiran_display"
                    type="text"
                    value={formatDateForDisplay(formData.tanggal_kehadiran)}
                    readOnly
                    className="date-fixed"
                  />
                </div>
                <div className="form-tamu-ms-group full-span">
                  <label htmlFor="alamat" className="required">
                    Alamat
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat || ""}
                    required
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="form-tamu-ms-actions">
              <button
                onClick={goToNextStep}
                className="btn btn-primary"
                type="button"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* Konten Step 2 */}
        {formStep === 2 && (
          <div className="form-tamu-ms-content">
            <div className="form-tamu-ms-section">
              <h3 className="form-tamu-ms-section-title">Detail Kunjungan</h3>
              <div className="form-tamu-ms-grid">
                <div className="form-tamu-ms-group">
                  <label htmlFor="keperluan" className="required">
                    Keperluan Utama
                  </label>
                  <select
                    id="keperluan"
                    name="keperluan"
                    value={formData.keperluan || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih keperluan</option>
                    <option value="mitra_statistik">
                      Kegiatan Mitra Statistik
                    </option>
                    <option value="konsultasi_statistik">
                      Konsultasi Statistik
                    </option>{" "}
                    {/* Value ini harus sama dengan yang di AdminDashboard */}
                    <option value="tamu_umum">Tamu Umum Lainnya</option>
                  </select>
                </div>
                <div className="form-tamu-ms-group">
                  <label htmlFor="dituju">
                    Ingin Bertemu / Dituju (Seksi/Staff)
                  </label>
                  <input
                    id="dituju"
                    type="text"
                    name="dituju"
                    value={formData.dituju || ""}
                    onChange={handleChange}
                    placeholder="Nama staff atau Seksi"
                  />
                </div>
              </div>

              {/* Sub-form untuk Mitra Statistik */}
              {selectedKeperluanUI === "mitra_statistik" && (
                <div className="form-tamu-ms-sub-section active">
                  <h4>Detail Kegiatan Mitra Statistik</h4>
                  <div className="form-tamu-ms-group full-span">
                    <label
                      htmlFor="tujuan_kunjungan_mitra"
                      className="required"
                    >
                      Tujuan Kunjungan Mitra
                    </label>
                    <textarea
                      id="tujuan_kunjungan_mitra"
                      name="tujuan_kunjungan"
                      value={formData.tujuan_kunjungan || ""}
                      required={selectedKeperluanUI === "mitra_statistik"}
                      onChange={handleChange}
                      placeholder="Jelaskan tujuan spesifik kegiatan mitra"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Sub-form untuk Konsultasi Statistik */}
              {selectedKeperluanUI === "konsultasi_statistik" && (
                <div className="form-tamu-ms-sub-section active">
                  <h4>Detail Konsultasi Statistik</h4>
                  <div className="form-tamu-ms-group">
                    <label htmlFor="topik_konsultasi" className="required">
                      Topik Konsultasi
                    </label>
                    <input
                      id="topik_konsultasi"
                      type="text"
                      name="topik_konsultasi"
                      value={formData.topik_konsultasi || ""}
                      required={selectedKeperluanUI === "konsultasi_statistik"}
                      onChange={handleChange}
                      placeholder="Contoh: Data PDRB, Inflasi"
                    />
                  </div>
                  <div className="form-tamu-ms-group full-span">
                    {" "}
                    {/* full-span agar textarea lebar */}
                    <label htmlFor="deskripsi_kebutuhan" className="required">
                      Deskripsi Kebutuhan Data/Konsultasi
                    </label>
                    <textarea
                      id="deskripsi_kebutuhan"
                      name="deskripsi_kebutuhan"
                      value={formData.deskripsi_kebutuhan || ""}
                      required={selectedKeperluanUI === "konsultasi_statistik"}
                      onChange={handleChange}
                      placeholder="Jelaskan detail kebutuhan data atau materi konsultasi Anda"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Sub-form untuk Tamu Umum */}
              {selectedKeperluanUI === "tamu_umum" && (
                <div className="form-tamu-ms-sub-section active">
                  <h4>Detail Kunjungan Umum</h4>
                  <div className="form-tamu-ms-group full-span">
                    <label htmlFor="tujuan_kunjungan_umum" className="required">
                      Tujuan Kunjungan Umum
                    </label>
                    <textarea
                      id="tujuan_kunjungan_umum"
                      name="tujuan_kunjungan"
                      value={formData.tujuan_kunjungan || ""}
                      required={selectedKeperluanUI === "tamu_umum"}
                      onChange={handleChange}
                      placeholder="Jelaskan tujuan kunjungan umum Anda"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="form-tamu-ms-actions space-between">
              <button
                type="button"
                onClick={goToPrevStep}
                className="btn btn-outline"
              >
                Kembali
              </button>
              <div>
                {" "}
                {/* Wrapper untuk tombol reset dan submit agar sejajar */}
                <button
                  type="reset"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm("Reset semua isian di step ini?")) {
                      // Reset hanya field yang relevan dengan step 2 atau keperluan
                      setFormData((prev) => ({
                        ...prev,
                        keperluan: "",
                        dituju: "",
                        tujuan_kunjungan: "",
                        topik_konsultasi: "",
                        deskripsi_kebutuhan: "",
                      }));
                      setSelectedKeperluanUI("");
                    }
                  }}
                >
                  Reset Step Ini
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Registrasi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormTamu;

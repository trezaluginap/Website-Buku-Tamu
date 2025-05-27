// src/pages/FormTamu.js (Versi Multi-Step Disesuaikan & Dipercantik)
import React, { useState, useEffect, useCallback } from "react";
import "../styles/Form.css"; // Pastikan Anda menyesuaikan CSS ini
import BPSLogo from "../assets/BPS.png";

const FormTamu = () => {
  const initialFormData = {
    nama_lengkap: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    pekerjaan: "",
    tanggal_kehadiran: new Date().toISOString(), // Langsung set di sini untuk initial state
    alamat: "",
    keperluan: "",
    dituju: "",
    tujuan_kunjungan: "",
    topik_konsultasi: "",
    deskripsi_kebutuhan: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedKeperluanUI, setSelectedKeperluanUI] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false); // Untuk animasi fade-in
  const totalSteps = 2; // Total langkah dalam formulir

  useEffect(() => {
    // Memberi sedikit delay untuk animasi fade-in saat komponen dimuat
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target; // Hapus `files` karena tidak ada upload file di sini

    if (name === "keperluan") {
      setSelectedKeperluanUI(value);
      setFormData((prev) => ({
        ...prev,
        keperluan: value,
        // Reset field terkait saat keperluan utama berubah
        tujuan_kunjungan: "", // Selalu reset saat keperluan utama berubah
        topik_konsultasi: "",
        deskripsi_kebutuhan: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin mengirim formulir ini?")) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tanggal_kehadiran: new Date().toISOString(), // Pastikan timestamp terkini
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
        // Reset form ke kondisi awal
        setFormData({
          ...initialFormData,
          tanggal_kehadiran: new Date().toISOString(),
        });
        setSelectedKeperluanUI("");
        setFormStep(1); // Kembali ke step 1
      } else {
        const errorData = await response.json().catch(() => ({
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
    // Validasi sederhana untuk Step 1
    if (
      !formData.nama_lengkap ||
      !formData.jenis_kelamin ||
      !formData.no_hp ||
      !formData.alamat
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi di Informasi Pribadi.");
      return;
    }
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll ke atas
  };

  const goToPrevStep = (e) => {
    e.preventDefault();
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll ke atas
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
    return days[new Date().getDay()];
  };

  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`form-container ${isLoaded ? "loaded" : ""}`}>
      <form onSubmit={handleSubmit} className="guest-registration-form">
        <div className="form-header">
          <div className="logo-container">
            <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
          </div>
          <h2>Buku Tamu Digital</h2>
          <p className="form-description">
            Registrasi kunjungan untuk hari {getDayName()},{" "}
            {formatDateForDisplay(new Date().toISOString())}. Mohon lengkapi
            semua field.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(formStep / totalSteps) * 100}%` }}
          ></div>
          <div className="progress-step-indicator">
            <span className={`step-dot ${formStep >= 1 ? "active" : ""}`}></span>
            <span className={`step-dot ${formStep >= 2 ? "active" : ""}`}></span>
          </div>
          <div className="progress-labels">
            <span>Informasi Pribadi</span>
            <span>Detail Kunjungan</span>
          </div>
        </div>

        {/* Konten Step 1 */}
        {formStep === 1 && (
          <div className="form-content active-step">
            <div className="form-section">
              <h3 className="section-title">Informasi Pribadi</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nama_lengkap" className="required">
                    Nama Lengkap
                  </label>
                  <input
                    id="nama_lengkap"
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    required
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="jenis_kelamin" className="required">
                    Jenis Kelamin
                  </label>
                  <select
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    required
                    onChange={handleChange}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com (opsional)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="no_hp" className="required">
                    No HP
                  </label>
                  <input
                    id="no_hp"
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp}
                    pattern="^08[0-9]{8,12}$"
                    title="Format: 08xxxxxxxxxx (10-14 digit)"
                    required
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pekerjaan">Pekerjaan / Instansi</label>
                  <input
                    id="pekerjaan"
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    placeholder="Mahasiswa, PNS, Swasta, dll."
                  />
                </div>
                <div className="form-group">
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
                <div className="form-group full-span">
                  <label htmlFor="alamat" className="required">
                    Alamat
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    required
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap Anda"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="form-actions">
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
          <div className="form-content active-step">
            <div className="form-section">
              <h3 className="section-title">Detail Kunjungan</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="keperluan" className="required">
                    Keperluan Utama
                  </label>
                  <select
                    id="keperluan"
                    name="keperluan"
                    value={formData.keperluan}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih keperluan</option>
                    <option value="mitra_statistik">Kegiatan Mitra Statistik</option>
                    <option value="konsultasi_statistik">Konsultasi Statistik</option>
                    <option value="tamu_umum">Tamu Umum Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dituju">
                    Bertemu Dengan (Seksi/Staff)
                  </label>
                  <input
                    id="dituju"
                    type="text"
                    name="dituju"
                    value={formData.dituju}
                    onChange={handleChange}
                    placeholder="Nama staff atau Seksi"
                  />
                </div>
              </div>

              {/* Sub-form untuk Mitra Statistik */}
              {selectedKeperluanUI === "mitra_statistik" && (
                <div className="form-sub-section active">
                  <h4>Detail Kegiatan Mitra Statistik</h4>
                  <div className="form-group full-span">
                    <label htmlFor="tujuan_kunjungan_mitra" className="required">
                      Tujuan Kunjungan Mitra
                    </label>
                    <textarea
                      id="tujuan_kunjungan_mitra"
                      name="tujuan_kunjungan"
                      value={formData.tujuan_kunjungan}
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
                <div className="form-sub-section active">
                  <h4>Detail Konsultasi Statistik</h4>
                  <div className="form-group">
                    <label htmlFor="topik_konsultasi" className="required">
                      Topik Konsultasi
                    </label>
                    <input
                      id="topik_konsultasi"
                      type="text"
                      name="topik_konsultasi"
                      value={formData.topik_konsultasi}
                      required={selectedKeperluanUI === "konsultasi_statistik"}
                      onChange={handleChange}
                      placeholder="Contoh: Data PDRB, Inflasi"
                    />
                  </div>
                  <div className="form-group full-span">
                    <label htmlFor="deskripsi_kebutuhan" className="required">
                      Deskripsi Kebutuhan Data/Konsultasi
                    </label>
                    <textarea
                      id="deskripsi_kebutuhan"
                      name="deskripsi_kebutuhan"
                      value={formData.deskripsi_kebutuhan}
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
                <div className="form-sub-section active">
                  <h4>Detail Kunjungan Umum</h4>
                  <div className="form-group full-span">
                    <label htmlFor="tujuan_kunjungan_umum" className="required">
                      Tujuan Kunjungan Umum
                    </label>
                    <textarea
                      id="tujuan_kunjungan_umum"
                      name="tujuan_kunjungan"
                      value={formData.tujuan_kunjungan}
                      required={selectedKeperluanUI === "tamu_umum"}
                      onChange={handleChange}
                      placeholder="Jelaskan tujuan kunjungan umum Anda"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions space-between">
              <button
                type="button"
                onClick={goToPrevStep}
                className="btn btn-outline"
              >
                Kembali
              </button>
              <div className="action-right">
                <button
                  type="button" // Ganti ke type="button" agar tidak submit form saat reset
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm("Reset semua isian di step ini?")) {
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
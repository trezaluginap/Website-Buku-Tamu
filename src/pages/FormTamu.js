// src/pages/FormTamu.js
import React, { useState, useEffect, useCallback } from "react";
import "../styles/Form.css"; // Pastikan ini adalah file CSS yang Anda gunakan dan sudah disesuaikan
import BPSLogo from "../assets/BPS.png";

const FormTamu = () => {
  const today = new Date();
  // Format YYYY-MM-DD untuk value default input type="date"
  const getYYYYMMDD = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const currentDateForInput = getYYYYMMDD(today);

  const initialFormData = {
    nama_lengkap: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    pekerjaan: "",
    tanggal_kehadiran: currentDateForInput, // Format YYYY-MM-DD untuk input date
    alamat: "",
    keperluan: "",
    dituju: "",
    tujuan_kunjungan: "",
    topik_konsultasi: "",
    deskripsi_kebutuhan: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  // selectedKeperluanUI dihilangkan, akan menggunakan formData.keperluan
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSteps = 2;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    // Pastikan tanggal_kehadiran diinisialisasi dengan benar saat komponen mount jika belum
    if (!formData.tanggal_kehadiran) {
      setFormData((prev) => ({
        ...prev,
        tanggal_kehadiran: currentDateForInput,
      }));
    }
    return () => clearTimeout(timer);
  }, [currentDateForInput]); // Dependensi bisa dikosongkan jika currentDateForInput tidak berubah setelah mount

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      // Jika keperluan diubah, reset field deskripsi terkait
      if (name === "keperluan") {
        newState.tujuan_kunjungan = "";
        newState.topik_konsultasi = "";
        newState.deskripsi_kebutuhan = "";
      }
      return newState;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pindahkan validasi step 2 ke sini sebelum konfirmasi submit
    if (formStep !== totalSteps) {
      alert("Selesaikan semua langkah terlebih dahulu.");
      return;
    }
    if (!validateStep2()) {
      // Validasi untuk step terakhir
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin mengirim formulir ini?"))
      return;

    setIsSubmitting(true);
    try {
      // Buat tanggal ISO lengkap dari formData.tanggal_kehadiran (YYYY-MM-DD) + waktu saat ini
      const dateParts = formData.tanggal_kehadiran.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Bulan di JS 0-indexed
      const day = parseInt(dateParts[2], 10);

      const now = new Date(); // Waktu saat ini
      const finalDateTime = new Date(
        year,
        month,
        day,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      let payload = {
        ...formData,
        tanggal_kehadiran: finalDateTime.toISOString(), // Kirim ISO string lengkap
        status: "Belum Diproses",
      };

      // Bersihkan payload: set field deskripsi yang tidak relevan menjadi null
      if (formData.keperluan === "konsultasi_statistik") {
        payload.tujuan_kunjungan = null;
      } else if (
        formData.keperluan === "mitra_statistik" ||
        formData.keperluan === "tamu_umum"
      ) {
        payload.topik_konsultasi = null;
        payload.deskripsi_kebutuhan = null;
      } else {
        // Jika keperluan tidak dipilih atau jenis lain (seharusnya dicegah validasi)
        payload.tujuan_kunjungan = null;
        payload.topik_konsultasi = null;
        payload.deskripsi_kebutuhan = null;
      }

      console.log(
        "Mengirim data (multi-step) FINAL PAYLOAD:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch("http://localhost:5000/api/tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Data berhasil dikirim! ID: ${result.id || "N/A"}, Status: ${
            result.guest?.status || result.status || "Belum Diproses"
          }`
        );
        setFormData({
          // Reset form
          ...initialFormData,
          tanggal_kehadiran: getYYYYMMDD(new Date()), // Reset tanggal ke hari ini
        });
        setFormStep(1);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({
            message:
              "Gagal mengirim data. Respons server tidak dapat diproses.",
          }));
        alert(
          `Gagal mengirim data. Server: ${response.status} - ${
            errorData.message || errorData.error || response.statusText
          }`
        );
        console.error("Submit error data:", errorData);
      }
    } catch (error) {
      console.error("Terjadi kesalahan submit:", error);
      alert(
        "Terjadi kesalahan saat mengirim data. Periksa konsol untuk detail."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep1 = () => {
    if (
      !formData.nama_lengkap.trim() ||
      !formData.jenis_kelamin ||
      !formData.no_hp.trim() ||
      !formData.alamat.trim() ||
      !formData.tanggal_kehadiran
    ) {
      alert(
        "Mohon lengkapi semua field yang wajib diisi (*) di Informasi Pribadi."
      );
      return false;
    }
    const hpPattern = /^08[0-9]{8,12}$/;
    if (!hpPattern.test(formData.no_hp)) {
      alert(
        "Format No. Handphone tidak valid. Contoh: 081234567890 (10-14 digit)."
      );
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.keperluan) {
      alert("Mohon pilih Keperluan Utama.");
      return false;
    }
    if (
      formData.keperluan === "mitra_statistik" &&
      !formData.tujuan_kunjungan.trim()
    ) {
      alert("Mohon isi Tujuan Kunjungan untuk Mitra Statistik.");
      return false;
    }
    if (formData.keperluan === "konsultasi_statistik") {
      if (!formData.topik_konsultasi.trim()) {
        alert("Mohon isi Topik Konsultasi.");
        return false;
      }
      if (!formData.deskripsi_kebutuhan.trim()) {
        alert("Mohon isi Deskripsi Kebutuhan untuk konsultasi.");
        return false;
      }
    }
    if (
      formData.keperluan === "tamu_umum" &&
      !formData.tujuan_kunjungan.trim()
    ) {
      alert("Mohon isi Tujuan Kunjungan untuk Tamu Umum.");
      return false;
    }
    return true;
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    if (formStep === 1 && !validateStep1()) return;
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToPrevStep = (e) => {
    e.preventDefault();
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFormReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset semua isian form?")) {
      setFormData({
        ...initialFormData,
        tanggal_kehadiran: getYYYYMMDD(new Date()),
      });
      setFormStep(1);
    }
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
  const formatDateForDisplay = (dateYMDString) => {
    if (!dateYMDString) return "";
    const parts = dateYMDString.split("-"); // Input adalah YYYY-MM-DD
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`; // Format ke DD/MM/YYYY
    return dateYMDString; // Fallback
  };

  return (
    // Ganti class .form-container dengan class yang sesuai dari CSS Anda (misal .form-tamu-ms-container)
    <div className={`form-container ${isLoaded ? "loaded" : ""}`}>
      <form
        onSubmit={handleSubmit}
        onReset={handleFormReset}
        id="guestRegistrationMultiStepForm"
        className="guest-registration-form"
      >
        <div className="form-header">
          <div className="logo-container">
            <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
          </div>
          <h2>Buku Tamu Digital</h2>
          <p className="form-description">
            Registrasi kunjungan untuk hari {getDayName()},{" "}
            {formatDateForDisplay(formData.tanggal_kehadiran)}. Mohon lengkapi
            semua field bertanda{" "}
            <span className="required-asterisk-info">*</span>.
          </p>
        </div>

        {/* Progress Bar (pastikan ada styling di Form.css) */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${((formStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          <div className="progress-steps">
            <div
              className={`progress-step ${formStep >= 1 ? "active" : ""} ${
                formStep === 1 ? "current" : ""
              }`}
            >
              <div className="step-dot">1</div>
              <div className="step-label">Informasi Pribadi</div>
            </div>
            <div
              className={`progress-step ${formStep >= 2 ? "active" : ""} ${
                formStep === 2 ? "current" : ""
              }`}
            >
              <div className="step-dot">2</div>
              <div className="step-label">Detail Kunjungan</div>
            </div>
          </div>
        </div>

        {/* Ganti semua class form-tamu-ms-* dengan class yang ada di Form.css Anda jika berbeda */}
        <div className="form-content">
          {formStep === 1 && (
            <div className="form-step active-step">
              {" "}
              {/* Tambah class 'form-step' jika perlu untuk styling step */}
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
                      <option value="">Pilih Jenis Kelamin...</option>
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
                      No. Handphone
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
                    <label htmlFor="tanggal_kehadiran" className="required">
                      Tanggal Kedatangan
                    </label>
                    <input
                      id="tanggal_kehadiran"
                      type="date"
                      name="tanggal_kehadiran"
                      value={formData.tanggal_kehadiran} // value untuk input type="date" adalah YYYY-MM-DD
                      required
                      onChange={handleChange}
                      className="date-input"
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
                  type="button"
                  onClick={handleFormReset}
                  className="btn btn-secondary"
                >
                  Reset Form
                </button>
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

          {formStep === 2 && (
            <div className="form-step active-step">
              {" "}
              {/* Tambah class 'form-step' jika perlu */}
              <div className="form-section">
                <h3 className="section-title">Detail Kunjungan</h3>
                <div className="form-grid single-column-grid">
                  {" "}
                  {/* Atau .form-grid jika ingin 2 kolom */}
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
                      <option value="">Pilih keperluan...</option>
                      <option value="mitra_statistik">
                        Kegiatan Mitra Statistik
                      </option>
                      <option value="konsultasi_statistik">
                        Konsultasi Statistik
                      </option>
                      <option value="tamu_umum">Tamu Umum Lainnya</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dituju">Bertemu Dengan (Seksi/Staff)</label>
                    <input
                      id="dituju"
                      type="text"
                      name="dituju"
                      value={formData.dituju}
                      onChange={handleChange}
                      placeholder="Nama staff atau Seksi (opsional)"
                    />
                  </div>
                </div>

                {formData.keperluan === "mitra_statistik" && (
                  <div className="form-sub-section active">
                    {" "}
                    {/* Gunakan class dari CSS Anda jika berbeda */}
                    <h4>Detail Kegiatan Mitra Statistik</h4>
                    <div className="form-group full-span">
                      <label
                        htmlFor="tujuan_kunjungan_mitra"
                        className="required"
                      >
                        Tujuan Kunjungan Mitra
                      </label>
                      <textarea
                        id="tujuan_kunjungan_mitra"
                        name="tujuan_kunjungan"
                        value={formData.tujuan_kunjungan}
                        required={formData.keperluan === "mitra_statistik"}
                        onChange={handleChange}
                        placeholder="Jelaskan tujuan spesifik kegiatan mitra"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                )}
                {formData.keperluan === "konsultasi_statistik" && (
                  <div className="form-sub-section active">
                    <h4>Detail Konsultasi Statistik</h4>
                    <div className="form-group">
                      {" "}
                      {/* Dibuat tidak full-span agar bisa sejajar jika ada field lain di CSS grid */}
                      <label htmlFor="topik_konsultasi" className="required">
                        Topik Konsultasi
                      </label>
                      <input
                        id="topik_konsultasi"
                        type="text"
                        name="topik_konsultasi"
                        value={formData.topik_konsultasi}
                        required={formData.keperluan === "konsultasi_statistik"}
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
                        required={formData.keperluan === "konsultasi_statistik"}
                        onChange={handleChange}
                        placeholder="Jelaskan detail kebutuhan data atau materi konsultasi Anda"
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                )}
                {formData.keperluan === "tamu_umum" && (
                  <div className="form-sub-section active">
                    <h4>Detail Kunjungan Umum</h4>
                    <div className="form-group full-span">
                      <label
                        htmlFor="tujuan_kunjungan_umum"
                        className="required"
                      >
                        Tujuan Kunjungan Umum
                      </label>
                      <textarea
                        id="tujuan_kunjungan_umum"
                        name="tujuan_kunjungan"
                        value={formData.tujuan_kunjungan}
                        required={formData.keperluan === "tamu_umum"}
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
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginRight: "0.5rem" }}
                    onClick={() => {
                      if (
                        window.confirm("Reset isian di step Detail Kunjungan?")
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          keperluan: "",
                          dituju: "",
                          tujuan_kunjungan: "",
                          topik_konsultasi: "",
                          deskripsi_kebutuhan: "",
                        }));
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
        </div>
      </form>
    </div>
  );
};

export default FormTamu;

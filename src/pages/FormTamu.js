// src/pages/FormTamu.js
import React, { useState, useEffect, useCallback } from "react";

import styles from "../styles/Form.module.css"; // Pastikan path ini benar
import BPSLogo from "../assets/BPS.png";

const FormTamu = () => {
  // ... (kode state dan functions Anda yang lain tetap sama) ...
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSteps = 2;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    if (!formData.tanggal_kehadiran) {
      setFormData((prev) => ({
        ...prev,
        tanggal_kehadiran: currentDateForInput,
      }));
    }
    return () => clearTimeout(timer);
  }, [currentDateForInput, formData.tanggal_kehadiran]); // Tambahkan formData.tanggal_kehadiran

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
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
    if (formStep !== totalSteps) {
      alert("Selesaikan semua langkah terlebih dahulu.");
      return;
    }
    if (!validateStep2()) {
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin mengirim formulir ini?"))
      return;

    setIsSubmitting(true);
    try {
      const dateParts = formData.tanggal_kehadiran.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      const now = new Date();
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
        tanggal_kehadiran: finalDateTime.toISOString(),
        status: "Belum Diproses",
      };

      if (formData.keperluan === "konsultasi_statistik") {
        payload.tujuan_kunjungan = null;
      } else if (
        formData.keperluan === "mitra_statistik" ||
        formData.keperluan === "tamu_umum"
      ) {
        payload.topik_konsultasi = null;
        payload.deskripsi_kebutuhan = null;
      } else {
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
          ...initialFormData,
          tanggal_kehadiran: getYYYYMMDD(new Date()),
        });
        setFormStep(1);
      } else {
        const errorData = await response.json().catch(() => ({
          message: "Gagal mengirim data. Respons server tidak dapat diproses.",
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
    // Jika tanggal_kehadiran dipilih, gunakan tanggal itu, jika tidak, gunakan hari ini
    const dateToCheck = formData.tanggal_kehadiran
      ? new Date(formData.tanggal_kehadiran)
      : new Date();
    // Perlu penyesuaian jika formData.tanggal_kehadiran tidak sesuai format Date()
    // Untuk YYYY-MM-DD, new Date() akan menganggap UTC, jadi perlu adjust timezone offset jika ada masalah
    // Solusi aman:
    let targetDate;
    if (formData.tanggal_kehadiran) {
      const [year, month, day] = formData.tanggal_kehadiran
        .split("-")
        .map(Number);
      targetDate = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      targetDate = new Date();
    }
    return days[targetDate.getDay()];
  };

  const formatDateForDisplay = (dateYMDString) => {
    if (!dateYMDString) return "";
    const parts = dateYMDString.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateYMDString;
  };

  // Ubah semua className menjadi styles.namaClass
  return (
    <div className={`${styles.formContainer} ${isLoaded ? styles.loaded : ""}`}>
      <form
        onSubmit={handleSubmit}
        onReset={handleFormReset}
        id="guestRegistrationMultiStepForm"
        className={styles.guestRegistrationForm} // Ganti di sini
      >
        <div className={styles.formHeader}>
          {" "}
          {/* Ganti di sini */}
          <div className={styles.logoContainer}>
            {" "}
            {/* Ganti di sini */}
            <img src={BPSLogo} alt="BPS Logo" className={styles.bpsLogo} />{" "}
            {/* Ganti di sini */}
          </div>
          <h2>Buku Tamu Digital</h2>
          <p className={styles.formDescription}>
            {" "}
            {/* Ganti di sini */}
            Registrasi kunjungan untuk hari {getDayName()},{" "}
            {formatDateForDisplay(formData.tanggal_kehadiran)}. Mohon lengkapi
            semua field bertanda{" "}
            <span className={styles.requiredAsteriskInfo}>*</span>.{" "}
            {/* Ganti di sini */}
          </p>
        </div>

        <div className={styles.progressBarContainer}>
          {" "}
          {/* Ganti di sini */}
          <div
            className={styles.progressBarFill} // Ganti di sini
            style={{ width: `${((formStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          <div className={styles.progressSteps}>
            {" "}
            {/* Ganti di sini */}
            <div
              className={`${styles.progressStep} ${
                formStep >= 1 ? styles.active : ""
              } ${formStep === 1 ? styles.current : ""}`}
            >
              <div className={styles.stepDot}>1</div> {/* Ganti di sini */}
              <div className={styles.stepLabel}>Informasi Pribadi</div>{" "}
              {/* Ganti di sini */}
            </div>
            <div
              className={`${styles.progressStep} ${
                formStep >= 2 ? styles.active : ""
              } ${formStep === 2 ? styles.current : ""}`}
            >
              <div className={styles.stepDot}>2</div> {/* Ganti di sini */}
              <div className={styles.stepLabel}>Detail Kunjungan</div>{" "}
              {/* Ganti di sini */}
            </div>
          </div>
        </div>

        <div className={styles.formContent}>
          {" "}
          {/* Ganti di sini */}
          {formStep === 1 && (
            <div className={`${styles.formStep} ${styles.activeStep}`}>
              {" "}
              {/* Ganti di sini */}
              <div className={styles.formSection}>
                {" "}
                {/* Ganti di sini */}
                <h3 className={styles.sectionTitle}>Informasi Pribadi</h3>{" "}
                {/* Ganti di sini */}
                <div className={styles.formGrid}>
                  {" "}
                  {/* Ganti di sini */}
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
                    <label htmlFor="nama_lengkap" className={styles.required}>
                      {" "}
                      {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
                    <label htmlFor="jenis_kelamin" className={styles.required}>
                      {" "}
                      {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
                    <label htmlFor="no_hp" className={styles.required}>
                      {" "}
                      {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
                    <label
                      htmlFor="tanggal_kehadiran"
                      className={styles.required}
                    >
                      {" "}
                      {/* Ganti di sini */}
                      Tanggal Kedatangan
                    </label>
                    <input
                      id="tanggal_kehadiran"
                      type="date"
                      name="tanggal_kehadiran"
                      value={formData.tanggal_kehadiran}
                      required
                      onChange={handleChange}
                      className={styles.dateInput} // Ganti di sini jika ada class khusus
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                    {" "}
                    {/* Ganti di sini */}
                    <label htmlFor="alamat" className={styles.required}>
                      {" "}
                      {/* Ganti di sini */}
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
              <div className={styles.formActions}>
                {" "}
                {/* Ganti di sini */}
                <button
                  type="button"
                  onClick={handleFormReset}
                  className={`${styles.btn} ${styles.btnSecondary}`} // Ganti di sini
                >
                  Reset Form
                </button>
                <button
                  onClick={goToNextStep}
                  className={`${styles.btn} ${styles.btnPrimary}`} // Ganti di sini
                  type="button"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}
          {formStep === 2 && (
            <div className={`${styles.formStep} ${styles.activeStep}`}>
              {" "}
              {/* Ganti di sini */}
              <div className={styles.formSection}>
                {" "}
                {/* Ganti di sini */}
                <h3 className={styles.sectionTitle}>Detail Kunjungan</h3>{" "}
                {/* Ganti di sini */}
                <div
                  className={`${styles.formGrid} ${styles.singleColumnGrid}`}
                >
                  {" "}
                  {/* Ganti di sini */}
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
                    <label htmlFor="keperluan" className={styles.required}>
                      {" "}
                      {/* Ganti di sini */}
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
                  <div className={styles.formGroup}>
                    {" "}
                    {/* Ganti di sini */}
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
                  <div className={`${styles.formSubSection} ${styles.active}`}>
                    {" "}
                    {/* Ganti di sini */}
                    <h4>Detail Kegiatan Mitra Statistik</h4>
                    <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                      {" "}
                      {/* Ganti di sini */}
                      <label
                        htmlFor="tujuan_kunjungan_mitra"
                        className={styles.required}
                      >
                        {" "}
                        {/* Ganti di sini */}
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
                  <div className={`${styles.formSubSection} ${styles.active}`}>
                    {" "}
                    {/* Ganti di sini */}
                    <h4>Detail Konsultasi Statistik</h4>
                    <div className={styles.formGroup}>
                      {" "}
                      {/* Ganti di sini, tidak perlu fullSpan jika ingin 2 kolom di sub-section */}
                      <label
                        htmlFor="topik_konsultasi"
                        className={styles.required}
                      >
                        {" "}
                        {/* Ganti di sini */}
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
                    <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                      {" "}
                      {/* Ganti di sini */}
                      <label
                        htmlFor="deskripsi_kebutuhan"
                        className={styles.required}
                      >
                        {" "}
                        {/* Ganti di sini */}
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
                  <div className={`${styles.formSubSection} ${styles.active}`}>
                    {" "}
                    {/* Ganti di sini */}
                    <h4>Detail Kunjungan Umum</h4>
                    <div className={`${styles.formGroup} ${styles.fullSpan}`}>
                      {" "}
                      {/* Ganti di sini */}
                      <label
                        htmlFor="tujuan_kunjungan_umum"
                        className={styles.required}
                      >
                        {" "}
                        {/* Ganti di sini */}
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
              <div className={`${styles.formActions} ${styles.spaceBetween}`}>
                {" "}
                {/* Ganti di sini */}
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className={`${styles.btn} ${styles.btnOutline}`} // Ganti di sini
                >
                  Kembali
                </button>
                <div className={styles.actionRight}>
                  {" "}
                  {/* Ganti di sini */}
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`} // Ganti di sini
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
                    className={`${styles.btn} ${styles.btnPrimary}`} // Ganti di sini
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

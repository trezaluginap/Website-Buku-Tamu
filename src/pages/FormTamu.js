import React, { useState, useEffect } from "react";
import "../styles/Form.css";
import BPSLogo from "../assets/BPS.png";

const FormTamu = () => {
  const [keperluan, setKeperluan] = useState("");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tanggal_kedatangan: currentDate,
    }));

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentDate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0].name : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin mengirim formulir ini?")) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/tamu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data berhasil dikirim!");
        e.target.reset();
        setKeperluan("");
        setFormData({
          tanggal_kedatangan: currentDate,
        });
        setFormStep(1);
      } else {
        alert("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevStep = (e) => {
    e.preventDefault();
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDayName = () => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[today.getDay()];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className={`container ${isLoaded ? "loaded" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="logo-container">
            <img src={BPSLogo} alt="BPS Logo" className="form-logo" />
          </div>
          <h2>Buku Tamu Digital</h2>
          <p className="form-description">
            Silakan lengkapi formulir di bawah ini untuk melakukan registrasi kunjungan pada {getDayName()}, {formatDate(currentDate)}
          </p>
        </div>

        {formStep === 1 && (
          <div className="form-content">
            <div className="form-group">
              <label className="required">Nama Lengkap</label>
              <input
                type="text"
                name="nama_lengkap"
                required
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="form-group">
              <label className="required">Jenis Kelamin</label>
              <select name="jenis_kelamin" required onChange={handleChange}>
                <option value="">Pilih jenis kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} placeholder="contoh@email.com" />
            </div>

            <div className="form-group">
              <label className="required">No HP</label>
              <input type="text" name="no_hp" required onChange={handleChange} placeholder="08xxxxxxxxxx" />
            </div>

            <div className="form-group">
              <label>Pekerjaan</label>
              <input type="text" name="pekerjaan" onChange={handleChange} placeholder="Masukkan pekerjaan" />
            </div>

            <div className="form-group">
              <label className="required">Tanggal Kedatangan</label>
              <input type="text" name="tanggal_kedatangan" value={formatDate(currentDate)} readOnly className="date-fixed" />
            </div>

            <div className="form-group full-width">
              <label className="required">Alamat</label>
              <textarea name="alamat" required onChange={handleChange} placeholder="Masukkan alamat lengkap"></textarea>
            </div>

            <div className="button-group">
              <button onClick={goToNextStep} className="next-button" type="button">Lanjutkan</button>
            </div>
          </div>
        )}

        {formStep === 2 && (
          <div className="form-content">
            <div className="form-group">
              <label className="required">Keperluan</label>
              <select
                name="keperluan"
                value={keperluan}
                onChange={(e) => {
                  setKeperluan(e.target.value);
                  handleChange(e);
                }}
                required
              >
                <option value="">Pilih keperluan</option>
                <option value="mitra_statistik">Kegiatan Mitra Statistik</option>
                <option value="konsultasi">Konsultasi Statistik</option>
                <option value="tamu_umum">Tamu Umum</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dituju</label>
              <select name="dituju" onChange={handleChange}>
                <option value="">Pilih Staff</option>
                <option value="budi">Budi Santoso</option>
                <option value="siti">Siti Rahmawati</option>
                <option value="agus">Agus Prasetyo</option>
                <option value="lina">Lina Kartini</option>
              </select>
            </div>

            {keperluan === "mitra_statistik" && (
              <div className="subform">
                <h3 className="subform-title">Detail Kegiatan Mitra Statistik</h3>
                <div className="form-group full-width">
                  <label className="required">Tujuan Kunjungan</label>
                  <textarea
                    name="tujuan_kunjungan"
                    required
                    onChange={handleChange}
                    placeholder="Jelaskan tujuan kunjungan Anda"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}

            {keperluan === "konsultasi" && (
              <div className="subform">
                <h3 className="subform-title">Detail Konsultasi Statistik</h3>
                <div className="form-group full-width">
                  <label className="required">Topik Konsultasi</label>
                  <input
                    type="text"
                    name="topik_konsultasi"
                    required
                    onChange={handleChange}
                    placeholder="Masukkan topik konsultasi"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="required">Deskripsi Kebutuhan</label>
                  <textarea
                    name="deskripsi_kebutuhan"
                    required
                    onChange={handleChange}
                    placeholder="Jelaskan kebutuhan konsultasi Anda secara detail"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            )}

            {keperluan === "tamu_umum" && (
              <div className="subform">
                <h3 className="subform-title">Detail Kunjungan</h3>
                <div className="form-group full-width">
                  <label className="required">Tujuan Kunjungan</label>
                  <textarea
                    name="tujuan_kunjungan"
                    required
                    onChange={handleChange}
                    placeholder="Jelaskan tujuan kunjungan Anda"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}

            <div className="button-group">
              <button type="button" onClick={goToPrevStep} className="secondary-button">Kembali</button>
              <button type="reset" className="secondary-button">Reset</button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormTamu;

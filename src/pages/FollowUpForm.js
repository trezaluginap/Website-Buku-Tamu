// src/pages/FollowUpForm.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles.css"; // Make sure to create this CSS file

const FollowUpForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    diterima_oleh: "",
    isi_pertemuan: "",
    status: "Selesai",
    dokumentasi: "",
  });

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${id}`)
      .then((res) => {
        setData((prev) => ({ ...prev, ...res.data }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat data tamu");
        setIsLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, dokumentasi: URL.createObjectURL(file) }); // Simulasi upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .put(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${id}`, {
        ...data,
        perlu_tindak_lanjut: false,
      })
      .then(() => {
        navigate("/admin");
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal menyimpan data");
        setIsLoading(false);
      });
  };

  if (isLoading && !data.nama) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="follow-up-container">
      <div className="follow-up-card">
        <div className="follow-up-header">
          <h2>Tindak Lanjut Kunjungan</h2>
          <p className="guest-name">{data.nama || "Tamu"}</p>
        </div>

        <form onSubmit={handleSubmit} className="follow-up-form">
          <div className="form-group">
            <label htmlFor="diterima_oleh">Diterima oleh</label>
            <input
              id="diterima_oleh"
              name="diterima_oleh"
              value={data.diterima_oleh}
              onChange={handleChange}
              placeholder="Nama penerima tamu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isi_pertemuan">Isi Percakapan</label>
            <textarea
              id="isi_pertemuan"
              name="isi_pertemuan"
              value={data.isi_pertemuan}
              onChange={handleChange}
              placeholder="Ringkasan hasil pertemuan"
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={data.status}
              onChange={handleChange}
              className="status-select"
            >
              <option value="Selesai">Selesai</option>
              <option value="Penjadwalan Berikutnya">
                Penjadwalan Berikutnya
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dokumentasi">Dokumentasi</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="dokumentasi"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="dokumentasi" className="file-label">
                <span className="file-icon">📷</span>
                <span>Pilih Foto</span>
              </label>
            </div>

            {data.dokumentasi && (
              <div className="image-preview">
                <img src={data.dokumentasi} alt="Dokumentasi" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin")}
            >
              Batal
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpForm;

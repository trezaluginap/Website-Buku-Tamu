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
      .get(`http://localhost:5000/api/tamu/${id}`)
      .then((res) => {
        console.log("Data yang diterima:", res.data);
        // Pastikan data yang diterima memiliki struktur yang sesuai
        setData((prev) => ({
          ...prev,
          ...res.data,
          // Pastikan semua field yang diperlukan ada
          diterima_oleh: res.data.diterima_oleh || "",
          isi_pertemuan: res.data.isi_pertemuan || "",
          status: res.data.status || "Selesai",
          dokumentasi: res.data.dokumentasi || "",
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error saat mengambil data:", err);
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
      // Jika API Anda mendukung upload file, gunakan FormData
      /* 
      const formData = new FormData();
      formData.append('dokumentasi', file);
      
      axios.post(`http://localhost:5000/api/tamu/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // Asumsikan server mengembalikan URL file yang diupload
        setData({ ...data, dokumentasi: response.data.fileUrl });
      }).catch(err => {
        console.error("Error saat upload file:", err);
        setError("Gagal mengupload file");
      });
      */

      // Untuk sementara gunakan object URL untuk preview saja
      setData({ ...data, dokumentasi: URL.createObjectURL(file) });

      // Simpan file untuk dikirim nanti jika perlu
      setData((prev) => ({ ...prev, dokumentasiFile: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Membuat objek data yang akan dikirim
    const dataToSend = {
      diterima_oleh: data.diterima_oleh,
      isi_pertemuan: data.isi_pertemuan,
      status: data.status,
      // Jangan kirim dokumentasi kalau masih dalam format URL objek
      dokumentasi:
        typeof data.dokumentasi === "string" &&
        !data.dokumentasi.startsWith("blob:")
          ? data.dokumentasi
          : "",
      perlu_tindak_lanjut: false,
    };

    console.log("Data yang dikirim:", dataToSend);

    axios
      .put(`http://localhost:5000/api/tamu/${id}`, dataToSend)
      .then((response) => {
        console.log("Respons dari server:", response.data);
        navigate("/admin");
      })
      .catch((err) => {
        console.error("Error saat menyimpan:", err);
        if (err.response) {
          // Server merespons dengan status error
          console.error("Respons error:", err.response.data);
          setError(
            `Gagal menyimpan data: ${
              err.response.data.message || err.response.statusText
            }`
          );
        } else {
          setError("Gagal menyimpan data: Tidak dapat terhubung ke server");
        }
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

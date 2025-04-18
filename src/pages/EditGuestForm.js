// src/pages/EditGuestForm.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles.css"; // Make sure to create this CSS file

const EditGuestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guest, setGuest] = useState({
    nama: "",
    email: "",
    no_hp: "",
    tanggal_kedatangan: "",
    keperluan: "",
    alamat: "",
    pekerjaan: "",
  });

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${id}`)
      .then((res) => {
        setGuest(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat data tamu");
        setIsLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .put(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${id}`, guest)
      .then(() => {
        navigate("/admin");
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal menyimpan data");
        setIsLoading(false);
      });
  };

  if (isLoading && !guest.nama) {
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
    <div className="edit-guest-container">
      <div className="edit-guest-card">
        <div className="edit-guest-header">
          <h2>Edit Data Tamu</h2>
          <p className="guest-id">ID: {id}</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-guest-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap</label>
              <input
                id="nama"
                name="nama"
                value={guest.nama || ""}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={guest.email || ""}
                onChange={handleChange}
                placeholder="contoh@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="no_hp">Nomor Telepon</label>
              <input
                id="no_hp"
                name="no_hp"
                value={guest.no_hp || ""}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tanggal_kedatangan">Tanggal Kedatangan</label>
              <input
                id="tanggal_kedatangan"
                name="tanggal_kedatangan"
                type="date"
                value={guest.tanggal_kedatangan || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="keperluan">Keperluan</label>
            <input
              id="keperluan"
              name="keperluan"
              value={guest.keperluan || ""}
              onChange={handleChange}
              placeholder="Keperluan kunjungan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat</label>
            <textarea
              id="alamat"
              name="alamat"
              value={guest.alamat || ""}
              onChange={handleChange}
              placeholder="Alamat lengkap"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pekerjaan">Pekerjaan</label>
            <input
              id="pekerjaan"
              name="pekerjaan"
              value={guest.pekerjaan || ""}
              onChange={handleChange}
              placeholder="Pekerjaan tamu"
            />
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

export default EditGuestForm;

// src/pages/EditGuestForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditGuestForm.css";
import BPSLogo from "../assets/BPS.png";
import Sidebar from "../pages/sidebar";

const EditGuestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_hp: "",
    alamat: "",
    pekerjaan: "",
    keperluan: "",
    tanggal_kehadiran: "",
    status: "",
    isi_pertemuan: "",
    dokumentasi: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch guest data
  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(`${API_BASE_URL}/tamu/${id}`);
        const guestData = response.data;

        // Format tanggal untuk input date
        if (guestData.tanggal_kehadiran) {
          guestData.tanggal_kehadiran =
            guestData.tanggal_kehadiran.split("T")[0];
        }

        setFormData(guestData);
      } catch (err) {
        console.error("Error fetching guest data:", err);
        setError("Gagal memuat data tamu. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGuestData();
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.nama_lengkap.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }

    if (!formData.keperluan.trim()) {
      setError("Keperluan harus diisi");
      return;
    }

    if (!formData.tanggal_kehadiran) {
      setError("Tanggal kehadiran harus diisi");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await axios.put(`${API_BASE_URL}/tamu/${id}`, formData);

      setSuccess("Data tamu berhasil diperbarui!");

      // Redirect after successful update
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error updating guest:", err);
      setError("Gagal memperbarui data tamu. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin-dashboard");
  };

  // Status options
  const statusOptions = [
    { value: "", label: "Pilih Status" },
    { value: "Belum Diproses", label: "Belum Diproses" },
    { value: "Diproses", label: "Diproses" },
    { value: "Selesai", label: "Selesai" },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Memuat data tamu...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="edit-guest-form">
          {/* Header */}
          <header className="form-header">
            <div className="header-content">
              <div className="logo-title">
                <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
                <h1>Edit Data Tamu</h1>
              </div>
              <button className="back-btn" onClick={handleCancel} type="button">
                ← Kembali
              </button>
            </div>
          </header>

          {/* Form Container */}
          <div className="form-container">
            {/* Alert Messages */}
            {error && (
              <div className="alert alert-error" role="alert">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                <span className="alert-icon">✅</span>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="guest-form">
              <div className="form-grid">
                {/* Basic Information */}
                <div className="form-section">
                  <h3 className="section-title">Informasi Dasar</h3>

                  <div className="form-group">
                    <label htmlFor="nama_lengkap" className="form-label">
                      Nama Lengkap <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan alamat email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="no_hp" className="form-label">
                      No. HP
                    </label>
                    <input
                      type="tel"
                      id="no_hp"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan nomor HP"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pekerjaan" className="form-label">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      id="pekerjaan"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan pekerjaan"
                    />
                  </div>
                </div>

                {/* Visit Information */}
                <div className="form-section">
                  <h3 className="section-title">Informasi Kunjungan</h3>

                  <div className="form-group">
                    <label htmlFor="tanggal_kehadiran" className="form-label">
                      Tanggal Kehadiran <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="tanggal_kehadiran"
                      name="tanggal_kehadiran"
                      value={formData.tanggal_kehadiran}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="keperluan" className="form-label">
                      Keperluan <span className="required">*</span>
                    </label>
                    <textarea
                      id="keperluan"
                      name="keperluan"
                      value={formData.keperluan}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Jelaskan keperluan kunjungan"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="alamat" className="form-label">
                      Alamat
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Masukkan alamat lengkap"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="form-section full-width">
                  <h3 className="section-title">Informasi Tambahan</h3>

                  <div className="form-group">
                    <label htmlFor="isi_pertemuan" className="form-label">
                      Hasil Pertemuan
                    </label>
                    <textarea
                      id="isi_pertemuan"
                      name="isi_pertemuan"
                      value={formData.isi_pertemuan}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Isi hasil pertemuan (jika ada)"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dokumentasi" className="form-label">
                      Link Dokumentasi
                    </label>
                    <input
                      type="url"
                      id="dokumentasi"
                      name="dokumentasi"
                      value={formData.dokumentasi}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan link dokumentasi (jika ada)"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading-spinner small"></span>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditGuestForm;

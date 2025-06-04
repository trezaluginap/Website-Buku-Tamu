// src/pages/FollowUpForm.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FollowUpForm.css"; // Pastikan ini merujuk ke SharedFormStyles.css atau CSS yang sesuai
import BPSLogo from "../assets/BPS.png"; 
import Sidebar from "./sidebar"; 

// --- Komponen Ikon Sederhana ---
// Komponen IconCamera tidak lagi dibutuhkan dan bisa dihapus jika tidak digunakan di tempat lain.
// const IconCamera = () => ( ... ); 

const IconSpinner = () => (
  <svg
    className="button-spinner" // Pastikan kelas ini ada di CSS Anda untuk animasi
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.3"></circle>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
// --- End Ikon ---

const FollowUpForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialGuestDataDefaults = {
    nama_lengkap: "", keperluan: "", tanggal_kehadiran: "", status: "", jam_tindak_lanjut: null,
    email: "", no_hp: "", pekerjaan: "", alamat: "", staff: "", dituju: "",
    tujuan_kunjungan: "", topik_konsultasi: "", deskripsi_kebutuhan: "", diterima_oleh: "", isi_pertemuan: "", dokumentasi: ""
  };

  const [guestData, setGuestData] = useState(initialGuestDataDefaults);
  const [followUpData, setFollowUpData] = useState({
    diterima_oleh: "",
    isi_pertemuan: "",
    status: "Selesai",
    dokumentasi: "", 
    dokumentasiFile: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_BASE_URL = "http://localhost:5000/api";

  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  useEffect(() => {
    const fetchGuestData = async () => {
      if (!id) { setError("ID tamu tidak valid."); setIsLoading(false); return; }
      setIsLoading(true); setError("");
      try {
        const response = await axios.get(`${API_BASE_URL}/tamu/${id}`);
        const dataFromServer = response.data;
        if (dataFromServer && typeof dataFromServer === "object") {
          const populatedGuestData = { ...initialGuestDataDefaults };
          for (const key in populatedGuestData) {
            if (Object.prototype.hasOwnProperty.call(dataFromServer, key) && dataFromServer[key] !== null && dataFromServer[key] !== undefined) {
              if (key === 'tanggal_kehadiran' && dataFromServer[key]) {
                try {
                  populatedGuestData[key] = new Date(dataFromServer[key]).toISOString().split("T")[0];
                } catch (e) { populatedGuestData[key] = dataFromServer[key]; }
              } else {
                populatedGuestData[key] = dataFromServer[key];
              }
            }
          }
          setGuestData(populatedGuestData);

          setFollowUpData((prev) => ({
            ...prev,
            diterima_oleh: dataFromServer.diterima_oleh || "",
            isi_pertemuan: dataFromServer.isi_pertemuan || "",
            status: dataFromServer.status || "Selesai",
            dokumentasi: dataFromServer.dokumentasi || "",
          }));
        } else {
          setError("Format data tamu tidak sesuai atau data kosong.");
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.status === 404 ? `Data tamu ID ${id} tidak ditemukan.` : `Gagal memuat data: ${err.response.data?.error || err.response.data?.message || err.message}`);
        } else { setError("Gagal memuat data tamu. Periksa koneksi."); }
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuestData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); if (success) setSuccess("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        setError("Ukuran file maksimal adalah 2MB."); e.target.value = null; return;
      }
      const fileURL = URL.createObjectURL(file);
      setFollowUpData((prev) => ({ ...prev, dokumentasi: fileURL, dokumentasiFile: file, }));
    } else {
      // Jika file dibatalkan, kembalikan ke URL dokumentasi yang ada (jika ada) atau kosongkan
      setFollowUpData((prev) => ({ 
        ...prev, 
        dokumentasi: guestData.dokumentasi && !guestData.dokumentasi.startsWith("blob:") ? guestData.dokumentasi : "", // Hanya jika bukan blob dari preview sebelumnya
        dokumentasiFile: null, 
      }));
    }
    if (error) setError(""); if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!followUpData.diterima_oleh.trim()) { setError("Kolom 'Diterima oleh' harus diisi."); return; }
    if (!followUpData.isi_pertemuan.trim()) { setError("Kolom 'Isi/Hasil Pertemuan' harus diisi."); return; }

    setIsSaving(true); setError(""); setSuccess("");
    const jamTindakLanjut = new Date().toISOString();

    const payloadToSend = {
      diterima_oleh: followUpData.diterima_oleh,
      isi_pertemuan: followUpData.isi_pertemuan,
      status: followUpData.status,
      jam_tindak_lanjut: jamTindakLanjut,
    };

    let dataForAxios;
    let requestConfig = { headers: {} };

    if (followUpData.dokumentasiFile) {
      const formDataInstance = new FormData(); // Ganti nama variabel agar tidak konflik
      for (const key in payloadToSend) { formDataInstance.append(key, payloadToSend[key]); }
      formDataInstance.append("dokumentasiFile", followUpData.dokumentasiFile);
      dataForAxios = formDataInstance;
      // Axios akan otomatis set Content-Type ke multipart/form-data
    } else {
      // Jika tidak ada file baru, dan dokumentasi yang ada bukan blob (preview lokal)
      // atau jika dokumentasi dikosongkan (followUpData.dokumentasi kosong dan tidak ada file baru)
      if (followUpData.dokumentasi && !followUpData.dokumentasi.startsWith("blob:")) {
        payloadToSend.dokumentasi = followUpData.dokumentasi;
      } else if (!followUpData.dokumentasi && followUpData.dokumentasiFile === null) {
         // Jika user menghapus file yang ada dan tidak memilih yang baru
        payloadToSend.dokumentasi = null; 
      }
      // Jika followUpData.dokumentasi adalah blob (preview lokal) dan tidak ada file baru, 
      // jangan kirim field 'dokumentasi' agar backend tidak mencoba memprosesnya sebagai string path.
      // Backend seharusnya mempertahankan dokumentasi lama jika field ini tidak ada.
      // Atau, jika Anda ingin menghapus dokumentasi di server jika user menghapus preview:
      // else if (followUpData.dokumentasi.startsWith("blob:") && !followUpData.dokumentasiFile) {
      //    payloadToSend.dokumentasi = null; // Kirim null untuk menghapus
      // }


      dataForAxios = payloadToSend;
      requestConfig.headers["Content-Type"] = "application/json";
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/tamu/${id}`, dataForAxios, requestConfig);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Tindak lanjut berhasil disimpan!");
        const updatedGuest = response.data.guest || response.data;
        if (updatedGuest) {
            const populatedGuestData = { ...initialGuestDataDefaults };
            for (const key in populatedGuestData) {
              if (Object.prototype.hasOwnProperty.call(updatedGuest, key) && updatedGuest[key] !== null && updatedGuest[key] !== undefined) {
                  if (key === 'tanggal_kehadiran' && updatedGuest[key]) {
                    try { populatedGuestData[key] = new Date(updatedGuest[key]).toISOString().split("T")[0]; } 
                    catch (e) { populatedGuestData[key] = updatedGuest[key]; }
                } else { populatedGuestData[key] = updatedGuest[key]; }
              }
            }
            setGuestData(populatedGuestData);

            setFollowUpData(prev => ({
                ...prev,
                diterima_oleh: updatedGuest.diterima_oleh || "",
                isi_pertemuan: updatedGuest.isi_pertemuan || "",
                status: updatedGuest.status || "Selesai",
                dokumentasi: updatedGuest.dokumentasi || "", 
                dokumentasiFile: null, 
            }));
        }
        setTimeout(() => navigate("/admin"), 2000);
      } else { setError(`Gagal menyimpan: Status ${response.status}`); }
    } catch (err) {
      if (err.response) { setError(`Gagal: ${err.response.data?.error || err.response.data?.message || `Error ${err.response.status}`}`); } 
      else if (err.request) { setError("Gagal: Tidak ada respons dari server."); } 
      else { setError(`Gagal: ${err.message}`); }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin");

  const statusOptions = [
    { value: "Selesai", label: "Selesai" },
    { value: "Perlu Tindak Lanjut", label: "Perlu Tindak Lanjut" },
    { value: "Diproses", label: "Masih Diproses" },
    { value: "Penjadwalan Berikutnya", label: "Penjadwalan Berikutnya" },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <div className="loading-container"><div className="loading-spinner"></div><p>Memuat data tamu...</p></div>
        </main>
      </div>
    );
  }
  
  if (error && !guestData.nama_lengkap && !isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <div className="follow-up-form-page">
            <div className="form-wrapper">
              <div className="form-content-container" style={{ padding: '2rem' }}>
                <div className="alert alert-error"><span className="alert-icon">⚠️</span> {error}</div>
                <button onClick={handleCancel} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Kembali ke Dashboard</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`dashboard-container`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="follow-up-form-page">
          <div className="form-wrapper">
            <header className="form-header">
              <div className="header-content">
                <div className="logo-title">
                  <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
                  <h1>Tindak Lanjut Kunjungan</h1>
                </div>
                <button className="back-btn" onClick={handleCancel} type="button">
                  &larr; Kembali
                </button>
              </div>
            </header>

            <div className="form-content-container">
              {error && !success && (
                <div className="alert alert-error"><span className="alert-icon">⚠️</span> {error}</div>
              )}
              {success && (
                <div className="alert alert-success"><span className="alert-icon">✅</span> {success}</div>
              )}

              <div className="guest-summary">
                <h3>Ringkasan Informasi Tamu</h3>
                <div className="summary-grid">
                  <div className="summary-item"><span className="summary-label">Nama:</span> <span className="summary-value">{guestData.nama_lengkap || "-"}</span></div>
                  <div className="summary-item"><span className="summary-label">Keperluan:</span> <span className="summary-value">{guestData.keperluan || "-"}</span></div>
                  <div className="summary-item"><span className="summary-label">Tgl Kunjungan:</span> <span className="summary-value">{guestData.tanggal_kehadiran ? new Date(guestData.tanggal_kehadiran + "T00:00:00Z").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span></div>
                  <div className="summary-item"><span className="summary-label">Status Awal:</span> <span className="summary-value">{guestData.status || "Belum Diproses"}</span></div>
                  {guestData.jam_tindak_lanjut && (
                      <div className="summary-item">
                        <span className="summary-label">Terakhir TL:</span>
                        <span className="summary-value">
                            {new Date(guestData.jam_tindak_lanjut).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: 'h23'})}
                        </span>
                      </div>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="main-form" style={{ gap: 0 }}>
                <div className="form-section-card"> 
                  <h3 className="section-title">Detail Tindak Lanjut</h3>
                  <div className="form-grid"> 
                    <div className="form-group full-width">
                      <label htmlFor="diterima_oleh" className="form-label">Diterima oleh <span className="required">*</span></label>
                      <input type="text" id="diterima_oleh" name="diterima_oleh" value={followUpData.diterima_oleh} onChange={handleInputChange} className="form-input" placeholder="Nama petugas/penerima" required />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="isi_pertemuan" className="form-label">Isi/Hasil Pertemuan <span className="required">*</span></label>
                      <textarea id="isi_pertemuan" name="isi_pertemuan" value={followUpData.isi_pertemuan} onChange={handleInputChange} className="form-textarea" placeholder="Ringkasan hasil pertemuan atau tindak lanjut yang dilakukan" rows="5" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status" className="form-label">Update Status Kunjungan</label>
                      <select id="status" name="status" value={followUpData.status} onChange={handleInputChange} className="form-select">
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dokumentasiFile" className="form-label">Unggah Dokumentasi (Opsional, Max 2MB)</label>
                      <div className="file-upload-container">
                        <input type="file" id="dokumentasiFile" name="dokumentasiFile" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="file-input" />
                        {/* PERUBAHAN DI SINI: Menghapus IconCamera dan mengganti teks */}
                        <label htmlFor="dokumentasiFile" className="file-label">
                          <span>{followUpData.dokumentasiFile ? followUpData.dokumentasiFile.name : (followUpData.dokumentasi && !followUpData.dokumentasi.startsWith("blob:")) ? "Ganti File" : "Unggah File Anda"}</span>
                          {!followUpData.dokumentasiFile && (!followUpData.dokumentasi || followUpData.dokumentasi.startsWith("blob:")) && (
                            <small style={{fontSize: '0.8rem', marginTop: '4px'}}>Seret & lepas atau klik di sini</small>
                          )}
                        </label>
                      </div>
                      {followUpData.dokumentasi && (
                        <div className="image-preview">
                          {followUpData.dokumentasi.startsWith("blob:") || /\.(jpe?g|png|gif)$/i.test(followUpData.dokumentasi) ? (
                              <img src={followUpData.dokumentasi} alt="Preview Dokumentasi" className="preview-image"/>
                          ) : (
                              <a href={followUpData.dokumentasi.startsWith("http") ? followUpData.dokumentasi : `${API_BASE_URL}/uploads/${followUpData.dokumentasi}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{marginTop: '0.5rem'}}>Lihat Dokumen</a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={isSaving}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving || !id}>
                    {isSaving ? (<><IconSpinner /> Menyimpan...</>) : "Simpan Tindak Lanjut"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FollowUpForm;

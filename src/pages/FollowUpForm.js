// src/pages/FollowUpForm.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FollowUpForm.css"
import BPSLogo from "../assets/BPS.png"; // Sesuaikan path jika perlu
import Sidebar from "./sidebar"; // Sesuaikan path jika perlu

// --- Komponen Ikon Sederhana ---
const IconCamera = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="file-icon" // Menggunakan kelas dari SharedFormStyles.css
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.174C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.174 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
    />
  </svg>
);

const IconSpinner = () => (
  <svg
    className="button-spinner"
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

  // Struktur data disesuaikan dengan apa yang mungkin ditampilkan di summary dan dibutuhkan form
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
          // Inisialisasi guestData dengan semua kemungkinan field dari server atau default
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
            status: dataFromServer.status || "Selesai", // Status terakhir tamu dari server
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
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal adalah 2MB."); e.target.value = null; return;
      }
      const fileURL = URL.createObjectURL(file);
      setFollowUpData((prev) => ({ ...prev, dokumentasi: fileURL, dokumentasiFile: file, }));
    } else {
      setFollowUpData((prev) => ({ ...prev, dokumentasi: guestData.dokumentasi || "", dokumentasiFile: null, }));
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
      const formData = new FormData();
      for (const key in payloadToSend) { formData.append(key, payloadToSend[key]); }
      formData.append("dokumentasiFile", followUpData.dokumentasiFile);
      dataForAxios = formData;
    } else {
      if (followUpData.dokumentasi && !followUpData.dokumentasi.startsWith("blob:")) {
        payloadToSend.dokumentasi = followUpData.dokumentasi;
      } else if (!followUpData.dokumentasi && followUpData.dokumentasiFile === null) {
        payloadToSend.dokumentasi = null; // Eksplisit kirim null jika dokumentasi dikosongkan
      }
      dataForAxios = payloadToSend;
      requestConfig.headers["Content-Type"] = "application/json";
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/tamu/${id}`, dataForAxios, requestConfig);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Tindak lanjut berhasil disimpan!");
        const updatedGuest = response.data.guest || response.data;
        if (updatedGuest) {
            // Update guestData dengan data terbaru dari server
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

            // Reset followUpData atau update dengan data dari server jika ada
            setFollowUpData(prev => ({
                ...prev,
                diterima_oleh: updatedGuest.diterima_oleh || "",
                isi_pertemuan: updatedGuest.isi_pertemuan || "",
                status: updatedGuest.status || "Selesai",
                dokumentasi: updatedGuest.dokumentasi || "", // Ini akan jadi path dari server setelah upload
                dokumentasiFile: null, // Reset file setelah submit
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
  
  // Error besar jika data tamu utama gagal dimuat
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
              
              <form onSubmit={handleSubmit} className="main-form" style={{ gap: 0 }}> {/* Override gap jika .form-section-card memberi margin sendiri */}
                {/* Detail Tindak Lanjut dibungkus dalam .form-section-card agar konsisten */}
                <div className="form-section-card"> 
                  <h3 className="section-title">Detail Tindak Lanjut</h3>
                  {/* Menggunakan .form-grid untuk layout field tindak lanjut */}
                  <div className="form-grid"> 
                    <div className="form-group full-width"> {/* Menggunakan .full-width untuk span penuh */}
                      <label htmlFor="diterima_oleh" className="form-label">Diterima oleh <span className="required">*</span></label>
                      <input type="text" id="diterima_oleh" name="diterima_oleh" value={followUpData.diterima_oleh} onChange={handleInputChange} className="form-input" placeholder="Nama petugas/penerima" required />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="isi_pertemuan" className="form-label">Isi/Hasil Pertemuan <span className="required">*</span></label>
                      <textarea id="isi_pertemuan" name="isi_pertemuan" value={followUpData.isi_pertemuan} onChange={handleInputChange} className="form-textarea" placeholder="Ringkasan hasil pertemuan atau tindak lanjut yang dilakukan" rows="5" required />
                    </div>
                    <div className="form-group"> {/* Biarkan 1 kolom jika .form-grid jadi 1 kolom di mobile */}
                      <label htmlFor="status" className="form-label">Update Status Kunjungan</label>
                      <select id="status" name="status" value={followUpData.status} onChange={handleInputChange} className="form-select">
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group"> {/* Biarkan 1 kolom jika .form-grid jadi 1 kolom di mobile */}
                      <label htmlFor="dokumentasiFile" className="form-label">Unggah Dokumentasi (Opsional, Max 2MB)</label>
                      <div className="file-upload-container">
                        <input type="file" id="dokumentasiFile" name="dokumentasiFile" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="file-input" />
                        <label htmlFor="dokumentasiFile" className="file-label">
                          <IconCamera />
                          <span>{followUpData.dokumentasiFile ? followUpData.dokumentasiFile.name : (followUpData.dokumentasi && !followUpData.dokumentasi.startsWith("blob:")) ? "Ganti File" : "Pilih File"}</span>
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

                <div className="form-actions"> {/* Tidak sticky, sesuai screenshot */}
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
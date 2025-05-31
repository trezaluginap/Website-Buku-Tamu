// src/pages/FollowUpForm.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FormStyles.css"; // Pastikan path ini benar
import BPSLogo from "../assets/BPS.png";
import Sidebar from "./sidebar";

// --- Komponen Ikon Sederhana ---
const IconCamera = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: "1.25em", height: "1.25em", marginRight: "0.5em" }}
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
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      opacity="0.3"
    ></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
// --- End Ikon ---

const FollowUpForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialGuestData = {
    nama_lengkap: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    pekerjaan: "",
    alamat: "",
    keperluan: "",
    staff: "",
    dituju: "",
    tanggal_kehadiran: "",
    status: "",
    tujuan_kunjungan: "",
    topik_konsultasi: "",
    deskripsi_kebutuhan: "",
    diterima_oleh: "", // Sebenarnya field ini lebih cocok di followUpData atau data terpisah
    isi_pertemuan: "",   // Sama seperti di atas
    dokumentasi: "",     // Sama seperti di atas
    // jam_tindak_lanjut tidak perlu di sini karena akan diisi saat submit
  };

  const [guestData, setGuestData] = useState(initialGuestData);
  const [followUpData, setFollowUpData] = useState({
    diterima_oleh: "",
    isi_pertemuan: "",
    status: "Selesai",
    dokumentasi: "", // Ini akan menjadi URL preview atau path dari server
    dokumentasiFile: null, // Ini untuk file yang diupload
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
      if (!id) {
        console.error("FollowUpForm: ID tamu tidak valid saat fetch.");
        setError("ID tamu tidak valid");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      console.log(`FollowUpForm: Fetching guest data for ID: ${id}`);
      try {
        const response = await axios.get(`${API_BASE_URL}/tamu/${id}`);
        const data = response.data;
        console.log("FollowUpForm: Guest data received from API:", data);

        if (data && typeof data === "object") {
          const fetchedGuest = {};
          // Mengisi guestData dengan data dari API, menggunakan initialGuestData sebagai template
          for (const key in initialGuestData) {
            // Khusus untuk field yang seharusnya ada di guestData
             if (key !== 'diterima_oleh' && key !== 'isi_pertemuan' && key !== 'dokumentasi') {
                fetchedGuest[key] = data[key] || initialGuestData[key];
             }
          }

          if (data.tanggal_kehadiran) {
            try {
              fetchedGuest.tanggal_kehadiran = new Date(data.tanggal_kehadiran)
                .toISOString()
                .split("T")[0];
            } catch (e) {
              console.error(
                "Error formatting tanggal_kehadiran from fetched data:",
                e
              );
              fetchedGuest.tanggal_kehadiran = data.tanggal_kehadiran || "";
            }
          }
          setGuestData(fetchedGuest);

          // Mengisi followUpData dengan data yang relevan dari API (jika sudah ada follow-up sebelumnya)
          setFollowUpData((prev) => ({
            ...prev,
            diterima_oleh: data.diterima_oleh || "",
            isi_pertemuan: data.isi_pertemuan || "",
            status: data.status_terkini || data.status || "Selesai", // Gunakan status terkini jika ada, atau status awal
            dokumentasi: data.dokumentasi || "", // Path/URL dokumentasi dari server
            // jam_tindak_lanjut akan diambil dari guestData jika perlu ditampilkan (misal read-only)
            // tapi untuk form submit, kita selalu generate yang baru
          }));
        } else {
          console.error(
            "FollowUpForm: Data tamu tidak valid atau kosong diterima dari API untuk ID:",
            id
          );
          setError(
            "Format data tamu tidak sesuai atau data kosong dari server."
          );
        }
      } catch (err) {
        console.error(
          "FollowUpForm: Error fetching guest data:",
          err.response || err
        );
        if (err.response) {
          if (err.response.status === 404) {
            setError(`Data tamu dengan ID ${id} tidak ditemukan di server.`);
          } else {
            setError(
              `Gagal memuat data tamu: ${
                err.response.data?.message ||
                err.response.data?.error ||
                err.message
              }`
            );
          }
        } else {
          setError("Gagal memuat data tamu. Periksa koneksi atau server Anda.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchGuestData();
    }
  }, [id]); // Hapus initialGuestData dari dependency array jika tidak berubah

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFollowUpData((prev) => ({
        ...prev,
        dokumentasi: fileURL, // Untuk preview di sisi klien
        dokumentasiFile: file, // File asli untuk diupload
      }));
      if (error) setError("");
      if (success) setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!followUpData.diterima_oleh.trim()) {
      setError("Kolom 'Diterima oleh' harus diisi.");
      return;
    }
    if (!followUpData.isi_pertemuan.trim()) {
      setError("Kolom 'Isi/Hasil Pertemuan' harus diisi.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    // Dapatkan waktu saat ini dalam format ISO string (UTC)
    // Backend Anda dapat mengkonversi ini ke zona waktu lokal jika perlu
    const jamTindakLanjut = new Date().toISOString();

    // Persiapkan payload. Gabungkan data tamu yang relevan (jika perlu dikirim ulang)
    // dengan data tindak lanjut dari form, dan tambahkan jam_tindak_lanjut.
    // Anda mungkin tidak perlu mengirim semua guestData, hanya field yang relevan untuk update.
    // Asumsi: backend akan meng-update record tamu yang ada berdasarkan ID di URL.
    const payloadToSend = {
      // Anda bisa selektif field mana dari guestData yang mau dikirim jika hanya sebagian yg relevan
      // nama_lengkap: guestData.nama_lengkap, // Contoh jika backend memerlukan ini
      // keperluan: guestData.keperluan, // Contoh
      
      diterima_oleh: followUpData.diterima_oleh,
      isi_pertemuan: followUpData.isi_pertemuan,
      status: followUpData.status, // Status baru dari form tindak lanjut
      jam_tindak_lanjut: jamTindakLanjut, // Ini field baru untuk waktu tindak lanjut
      // dokumentasi dikelola terpisah di bawah jika ada file
    };
    
    // Log untuk debugging
    console.log("FollowUpForm: Submitting data:", payloadToSend);
    console.log("FollowUpForm: Documentation file:", followUpData.dokumentasiFile);


    let dataForAxios;
    let requestConfig = { headers: {} }; // Content-Type akan diatur nanti

    if (followUpData.dokumentasiFile) {
      const formData = new FormData();
      // Tambahkan semua field dari payloadToSend ke FormData
      for (const key in payloadToSend) {
        if (payloadToSend[key] !== undefined && payloadToSend[key] !== null) {
          formData.append(key, payloadToSend[key]);
        }
      }
      formData.append("dokumentasiFile", followUpData.dokumentasiFile);
      
      dataForAxios = formData;
      // Untuk FormData, browser akan set Content-Type secara otomatis (multipart/form-data)
      // Jadi, kita tidak perlu mengatur header Content-Type secara manual di sini.
      console.log("FollowUpForm: Sending FormData (with file)...");
      // formData.forEach((value, key) => console.log(key, value)); // Untuk debug FormData
    } else {
      // Jika tidak ada file baru, kirim data sebagai JSON
      // Jika ada URL dokumentasi lama yang ingin dipertahankan dan tidak diubah, kirim itu.
      // Jika followUpData.dokumentasi adalah blob URL dari file yang batal diupload, jangan kirim.
      if (followUpData.dokumentasi && !followUpData.dokumentasi.startsWith("blob:")) {
         payloadToSend.dokumentasi = followUpData.dokumentasi; // Kirim path dokumentasi lama jika ada dan bukan blob
      } else if (!followUpData.dokumentasi && guestData.dokumentasi) {
         // Jika tidak ada input dokumentasi baru, dan ada dokumentasi lama di guestData,
         // backend mungkin akan mempertahankannya, atau Anda bisa mengirim null/kosong untuk menghapusnya.
         // Untuk kasus ini, kita tidak mengirim field 'dokumentasi' jika tidak ada file baru
         // dan tidak ada URL valid di followUpData.dokumentasi.
         // Biarkan backend yang menentukan bagaimana menangani field 'dokumentasi' yang tidak ada di payload.
      }


      dataForAxios = payloadToSend;
      requestConfig.headers["Content-Type"] = "application/json";
      console.log("FollowUpForm: Sending JSON data:", dataForAxios);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/tamu/${id}`,
        dataForAxios,
        requestConfig
      );
      console.log("FollowUpForm: Update response data:", response.data);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Tindak lanjut berhasil disimpan!");
        
        // Update state lokal dengan data terbaru dari server (jika dikembalikan)
        // Pastikan backend mengembalikan data tamu yang sudah terupdate, termasuk jam_tindak_lanjut
        if(response.data && (response.data.guest || response.data.data) ) { // Sesuaikan dengan struktur respons backend Anda
            const updatedGuestData = response.data.guest || response.data.data;
            setGuestData(prev => ({...prev, ...updatedGuestData}));
            setFollowUpData(prev => ({ 
                ...prev,
                diterima_oleh: updatedGuestData.diterima_oleh || "",
                isi_pertemuan: updatedGuestData.isi_pertemuan || "",
                status: updatedGuestData.status_terkini || updatedGuestData.status || "Selesai",
                dokumentasi: updatedGuestData.dokumentasi || "",
                dokumentasiFile: null
            }));
        }
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setError(
          `Gagal menyimpan: Server merespons dengan status ${response.status}`
        );
      }
    } catch (err) {
      console.error(
        "FollowUpForm: Error saving follow-up:",
        err.response || err.request || err.message 
      );
      if (err.response) {
        setError(
          `Gagal menyimpan: ${
            err.response.data?.error ||
            err.response.data?.message ||
            err.message ||
            `Error ${err.response.status}`
          }`
        );
      } else if (err.request) {
        setError("Gagal menyimpan: Tidak ada respons dari server. Cek koneksi atau server.");
      }
      else {
        setError(`Gagal menyimpan tindak lanjut: ${err.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  const statusOptions = [
    { value: "Selesai", label: "Selesai" },
    { value: "Perlu Tindak Lanjut", label: "Perlu Tindak Lanjut" },
    { value: "Diproses", label: "Sedang Diproses" }, // Contoh status tambahan
    { value: "Penjadwalan Berikutnya", label: "Penjadwalan Berikutnya" },
  ];

  // Logika Loading dan Error Display
  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`main-content-area ${
            isSidebarOpen ? "sidebar-visible" : ""
          }`}
        >
          <div className="form-loading-state">
            <div className="spinner"></div>
            <p>Memuat data...</p>
          </div>
        </main>
      </div>
    );
  }
  // Jika ada error saat fetch awal dan tidak ada data tamu yang bisa ditampilkan
  if (error && !guestData.nama_lengkap && !isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`main-content-area ${
            isSidebarOpen ? "sidebar-visible" : ""
          }`}
        >
          <div className="form-content-area">
            <div className="alert error-alert">{error}</div>
            <button
              onClick={handleCancel}
              className="btn-secondary"
              style={{ marginTop: "1rem" }}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-layout ${
        isSidebarOpen ? "sidebar-visible" : "sidebar-collapsed"
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content-area">
        <div className="form-page-wrapper">
          <header className="form-page-header">
            <div className="form-header-content">
              <div className="form-header-logo-title">
                <img
                  src={BPSLogo}
                  alt="BPS Logo"
                  className="form-header-logo"
                />
                <h1 className="form-header-title">Tindak Lanjut Kunjungan</h1>
              </div>
              <button
                className="form-back-button"
                onClick={handleCancel}
                type="button"
              >
                &larr; Kembali
              </button>
            </div>
          </header>

          <div className="form-content-area">
            <div className="guest-summary-card">
              <h2 className="summary-title">Ringkasan Informasi Tamu</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Nama:</span>{" "}
                  <span className="summary-value">
                    {guestData.nama_lengkap || "-"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Keperluan:</span>{" "}
                  <span className="summary-value">
                    {guestData.keperluan || "-"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tanggal Kunjungan:</span>{" "}
                  <span className="summary-value">
                    {guestData.tanggal_kehadiran
                      ? new Date(
                          guestData.tanggal_kehadiran + "T00:00:00" // Tambahkan T00:00:00 untuk pastikan tanggal benar tanpa offset TZ
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long", // 'short' menjadi 'long' untuk lebih jelas
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status Awal:</span>{" "}
                  <span className="summary-value">
                    {guestData.status || "Belum Diproses"} 
                  </span>
                </div>
                 {/* Anda bisa menambahkan field jam_tindak_lanjut di sini jika sudah pernah ada */}
                 {guestData.jam_tindak_lanjut && (
                    <div className="summary-item">
                        <span className="summary-label">Terakhir Ditindaklanjuti:</span>{" "}
                        <span className="summary-value">
                        {new Date(guestData.jam_tindak_lanjut).toLocaleString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                        })}
                        </span>
                    </div>
                 )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="main-form">
              {/* Pesan Error dan Sukses */}
              {error && !success && (
                <div className="alert error-alert">
                  <span className="alert-icon">⚠️</span> {/* Emoji lebih umum */}
                  {error}
                </div>
              )}
              {success && (
                <div className="alert success-alert">
                  <span className="alert-icon">✅</span>
                  {success}
                </div>
              )}

              <div className="form-section-card">
                <h3 className="section-title">Detail Tindak Lanjut</h3>
                <div className="form-group">
                  <label htmlFor="diterima_oleh" className="form-label">
                    Diterima oleh <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    id="diterima_oleh"
                    name="diterima_oleh"
                    value={followUpData.diterima_oleh}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nama petugas/penerima"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isi_pertemuan" className="form-label">
                    Isi/Hasil Pertemuan{" "}
                    <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="isi_pertemuan"
                    name="isi_pertemuan"
                    value={followUpData.isi_pertemuan}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Ringkasan hasil pertemuan atau tindak lanjut yang dilakukan"
                    rows="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Update Status Kunjungan
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={followUpData.status}
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
                <div className="form-group">
                  <label htmlFor="dokumentasiFile" className="form-label">
                    Unggah Dokumentasi (Opsional)
                  </label>
                  <label
                    htmlFor="dokumentasiFile"
                    className="file-upload-label"
                  >
                    <IconCamera />
                    <span>
                      {followUpData.dokumentasiFile
                        ? followUpData.dokumentasiFile.name
                        : "Pilih atau Ganti Foto"}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="dokumentasiFile"
                    name="dokumentasiFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input-styled" // Pastikan class ini ada di CSS untuk menyembunyikan input asli
                  />
                  {/* Preview untuk file yang baru dipilih (blob URL) atau dokumentasi dari server */}
                  {followUpData.dokumentasi && (
                    <div className="image-upload-preview">
                      <img
                        src={followUpData.dokumentasi} // Ini bisa blob URL atau URL dari server
                        alt="Preview Dokumentasi"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions-sticky">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving || !id} // Disable jika tidak ada ID tamu
                >
                  {isSaving ? (
                    <>
                      <IconSpinner /> Menyimpan...
                    </>
                  ) : (
                    "Simpan Tindak Lanjut"
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
export default FollowUpForm;
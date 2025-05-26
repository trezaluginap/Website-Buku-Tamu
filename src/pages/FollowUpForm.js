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

  // Inisialisasi guestData dengan semua field yang mungkin ada di tabel tamu
  // Ini penting agar saat spread (...guestData) tidak ada field yang hilang
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
    diterima_oleh: "",
    isi_pertemuan: "",
    dokumentasi: "",
  };

  const [guestData, setGuestData] = useState(initialGuestData);
  const [followUpData, setFollowUpData] = useState({
    diterima_oleh: "",
    isi_pertemuan: "",
    status: "Selesai", // Default status tindak lanjut
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
        const response = await axios.get(`${API_BASE_URL}/tamu/${id}`); // URL SUDAH BENAR
        const data = response.data;
        console.log("FollowUpForm: Guest data received from API:", data);

        if (data && typeof data === "object") {
          // Update guestData dengan semua field dari server, fallback ke string kosong jika null/undefined
          const fetchedGuest = {};
          for (const key in initialGuestData) {
            fetchedGuest[key] = data[key] || "";
          }
          // Pastikan tanggal diformat dengan benar jika ada
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
              fetchedGuest.tanggal_kehadiran = ""; // Atau data.tanggal_kehadiran jika formatnya sudah benar
            }
          }
          setGuestData(fetchedGuest);

          // Pre-fill followUpData HANYA dengan field yang relevan dari data yang ada
          // dan biarkan status default untuk form ini.
          setFollowUpData((prev) => ({
            ...prev, // Pertahankan status default "Selesai" atau yang sudah diubah user
            diterima_oleh: data.diterima_oleh || "", // Pre-fill jika sudah pernah diisi
            isi_pertemuan: data.isi_pertemuan || "", // Pre-fill jika sudah pernah diisi
            dokumentasi: data.dokumentasi || "", // Ini adalah URL string dokumentasi yg sudah ada
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
  }, [id]); // Dependency array sudah benar

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
        dokumentasi: fileURL,
        dokumentasiFile: file,
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

    // Pastikan guestData memiliki semua field yang diharapkan oleh backend
    // untuk dipertahankan (yang tidak diubah oleh form ini).
    const payloadToSend = {
      ...guestData, // Mulai dengan semua data tamu yang sudah ada
      // Timpa dengan field dari form FollowUp
      diterima_oleh: followUpData.diterima_oleh,
      isi_pertemuan: followUpData.isi_pertemuan,
      status: followUpData.status, // Status yang diupdate dari form follow up
      // dokumentasi akan dihandle terpisah jika ada file upload
    };
    // Hapus ID dari payload karena ID sudah ada di URL endpoint PUT
    delete payloadToSend.id;

    let dataForAxios = payloadToSend;
    let requestConfig = { headers: { "Content-Type": "application/json" } };

    if (followUpData.dokumentasiFile) {
      const formData = new FormData();
      // Append semua field dari payloadToSend yang sudah final
      for (const key in payloadToSend) {
        if (payloadToSend[key] !== undefined && payloadToSend[key] !== null) {
          formData.append(key, payloadToSend[key]);
        }
      }
      formData.append("dokumentasiFile", followUpData.dokumentasiFile);
      formData.delete("dokumentasi"); // Hapus field 'dokumentasi' string, karena file yg diutamakan

      dataForAxios = formData;
      delete requestConfig.headers["Content-Type"];
      console.log("FollowUpForm: Sending FormData (with file)...");
    } else {
      // Jika tidak ada file baru, gunakan URL dokumentasi yang ada di followUpData.dokumentasi
      // (yang bisa jadi berasal dari guestData.dokumentasi atau preview blob)
      // Pastikan backend bisa menghandle jika ini adalah URL blob (sebaiknya tidak dikirim jika blob & tidak ada file baru)
      if (
        followUpData.dokumentasi &&
        followUpData.dokumentasi.startsWith("blob:") &&
        !followUpData.dokumentasiFile
      ) {
        // Jika ini adalah preview blob tapi tidak ada file yg diupload, mungkin lebih baik kirim dokumentasi lama
        payloadToSend.dokumentasi = guestData.dokumentasi || null;
      } else {
        payloadToSend.dokumentasi = followUpData.dokumentasi || null;
      }
      dataForAxios = payloadToSend;
      console.log("FollowUpForm: Sending JSON data:", dataForAxios); // Log payload yang akan dikirim
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
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setError(
          `Gagal menyimpan: Server merespons dengan status ${response.status}`
        );
      }
    } catch (err) {
      console.error(
        "FollowUpForm: Error saving follow-up:",
        err.response || err
      );
      if (err.response) {
        // Tampilkan pesan error dari backend jika ada, atau pesan default
        setError(
          `Gagal menyimpan: ${
            err.response.data?.error ||
            err.response.data?.message ||
            err.message ||
            `Error ${err.response.status}`
          }`
        );
      } else {
        setError("Gagal menyimpan tindak lanjut. Cek koneksi atau server.");
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
    { value: "Penjadwalan Berikutnya", label: "Penjadwalan Berikutnya" },
  ];

  // JSX return (Sama seperti sebelumnya, pastikan semua kelas CSS sudah benar dan menggunakan FormStyles.css)
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
  // Jika error saat fetch data awal dan guestData belum terisi
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
                  <span className="summary-label">Tanggal:</span>{" "}
                  <span className="summary-value">
                    {guestData.tanggal_kehadiran
                      ? new Date(
                          guestData.tanggal_kehadiran
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
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
              </div>
            </div>

            <form onSubmit={handleSubmit} className="main-form">
              {error && !success && (
                <div className="alert error-alert">
                  <span className="alert-icon">⚠️</span>
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
                    className="file-input-styled"
                  />
                  {followUpData.dokumentasi && (
                    <div className="image-upload-preview">
                      <img
                        src={followUpData.dokumentasi}
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
                  disabled={isSaving}
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

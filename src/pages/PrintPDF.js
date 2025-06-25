// src/pages/PrintPDF.js
import React, { useState } from "react";
import Sidebar from "./sidebar"; // Mengimpor komponen Sidebar
import "../styles/printPDF.css"; // CSS spesifik untuk halaman ini
import "../styles/userManagement.css"; // Menggunakan CSS dari UserManagement untuk layout header & content-container
import "../styles/sidebar.css"; // CSS untuk Sidebar
import LogoBps from "../assets/BPS.png"; // Asumsi logo BPS digunakan

const PrintPDF = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    visitorName: "",
    recipient: "",
    purpose: "",
    rating: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk sidebar, default terbuka

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk memfilter data berdasarkan formData dan memicu window.print()
    // Ini akan lebih kompleks jika Anda mengambil data dari API
    console.log("Form submitted for printing with filters:", formData);
    
    // Untuk sekarang, kita hanya akan memanggil window.print()
    // Anda mungkin perlu memanipulasi DOM atau menyiapkan konten khusus untuk print
    // sebelum memanggil window.print()
    
    // Contoh sederhana:
    // 1. Simpan filter
    // 2. Fetch data berdasarkan filter (jika perlu)
    // 3. Siapkan tampilan data untuk dicetak (mungkin tabel terpisah atau memodifikasi tabel yang ada)
    // 4. window.print()
    
    alert("Mempersiapkan dokumen untuk dicetak dengan filter yang dipilih...");
    // Idealnya, setelah data siap, panggil window.print()
    // window.print(); 
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="print-pdf-page">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`content-container ${isSidebarOpen ? "sidebar-open-active" : "sidebar-closed-active"}`}>
        {/* Header Halaman, mirip dengan UserManagement */}
        <div className="dashboard-header screen-only"> {/* Tambahkan screen-only jika header ini tidak untuk dicetak */}
          <div className="header-left-section">
            <button onClick={toggleSidebar} className="sidebar-toggle-btn-print" aria-label="Toggle Sidebar">
              {/* SVG untuk hamburger icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <img src={LogoBps} alt="Logo BPS" className="app-logo" />
            <div className="app-info">
              <h1 className="app-title">AKU</h1>
              <h2 className="app-subtitle">Cetak Laporan Buku Tamu</h2>
            </div>
          </div>
          <div className="user-badge">
            <div className="user-avatar">
              <span></span> {/* Ganti dengan inisial user atau gambar */}
            </div>
            <div className="user-details">
              <span className="user-role">Faisal</span> {/* Ganti dengan role user */}
              <span className="user-nip">NIP: 3272</span> {/* Ganti dengan NIP user */}
            </div>
          </div>
        </div>
        
        {/* Konten utama halaman Cetak PDF */}
        <div className="print-content-area"> {/* Mengganti .content-area dari printPDF.css jika ada */}
          <div className="print-form-card"> {/* Tambahkan card wrapper untuk form */}
            <div className="print-form-header">
            
            </div>
            <form className="print-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">TANGGAL AWAL</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">TANGGAL AKHIR</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="visitorName">NAMA PENGUNJUNG</label>
                <input
                  type="text"
                  id="visitorName"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  placeholder="Masukkan nama pengunjung (opsional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipient">PENERIMA</label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="Masukkan nama penerima (opsional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="purpose">KEPERLUAN</label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Masukkan keperluan kunjungan (opsional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating" className="rating-label">
                  BINTANG (RATING)
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="">Semua Rating</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="print-submit-button">
                  TAMPILKAN & CETAK
                </button>
              </div>
            </form>
          </div>
          {/* Di sini Anda akan menampilkan tabel data yang difilter sebelum mencetak */}
          {/* <div className="data-to-print-area"> */}
          {/* <h3>Data Laporan</h3> */}
          {/* <p>Data berdasarkan filter akan muncul di sini...</p> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default PrintPDF;

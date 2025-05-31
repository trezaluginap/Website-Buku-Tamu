
// src/pages/PrintPDF.js
import React, { useState } from "react";
import "../styles/printPDF.css";

const PrintPDF = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    visitorName: "",
    recipient: "",
    purpose: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would call an API to generate the PDF
    console.log("Form submitted:", formData);
    alert("PDF sedang disiapkan untuk dicetak.");
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">AKU</h1>
        <h2 className="page-subtitle">Aplikasi Buku Tamu</h2>
        <div className="user-info">Anda Login Sebagai: Nip:3272</div>
      </div>

      <div className="content-area">
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
              placeholder="Masukkan nama pengunjung"
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
              placeholder="Masukkan nama penerima"
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
              placeholder="Masukkan keperluan kunjungan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating" className="rating-label">
              BINTANG
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Pilih rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="print-button">
              CETAK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrintPDF;

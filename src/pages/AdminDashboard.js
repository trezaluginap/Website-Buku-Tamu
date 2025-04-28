// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import BPSLogo from "../assets/BPS.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 

  // Fetch guests data
  const fetchGuests = () => {
    setIsLoading(true);
    axios
      .get("https://67d524cbd2c7857431ef80e1.mockapi.io/Guest")
      .then((res) => {
        setGuests(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchGuests();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchGuests, 30000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Filter guests based on active tab
  const filteredGuests = guests.filter((guest) => {
    if (activeTab === "completed") {
      return guest.status === "Selesai";
    } else if (activeTab === "unprocessed") {
      return guest.status === "Belum Diproses" || !guest.status;
    } else if (activeTab === "processed") {
      return guest.status === "Diproses";
    }
    return true; // All guests
  });

  // Sort guests by date (newest first)
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    return new Date(b.tanggal_kedatangan) - new Date(a.tanggal_kedatangan);
  });

  // Get displayed guests based on showAll state
  const displayedGuests = showAll ? sortedGuests : sortedGuests.slice(0, 5);

  // Calculate statistics
  const today = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const todayGuests = guests.filter(
    (g) => g.tanggal_kedatangan === today
  ).length;

  const weeklyGuests = guests.filter(
    (g) => g.tanggal_kedatangan >= weekStartStr
  ).length;

  const unprocessedGuests = guests.filter(
    (g) => g.status === "Belum Diproses" || !g.status
  ).length;

  const completedGuests = guests.filter((g) => g.status === "Selesai").length;

  // Refresh data
  const handleRefresh = () => {
    fetchGuests();
  };

  // Start processing a guest
  const startProcessing = (guestId) => {
    const updatedGuest = guests.find((g) => g.id === guestId);
    if (!updatedGuest) return;

    axios
      .put(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${guestId}`, {
        ...updatedGuest,
        status: "Diproses",
      })
      .then(() => {
        fetchGuests(); // Refresh data
        setSelectedGuest(null); // Close modal
      })
      .catch((err) => console.error("Error updating guest:", err));
  };

  // Mark guest as completed
  const markAsCompleted = (guestId) => {
    const updatedGuest = guests.find((g) => g.id === guestId);
    if (!updatedGuest) return;

    axios
      .put(`https://67d524cbd2c7857431ef80e1.mockapi.io/Guest/${guestId}`, {
        ...updatedGuest,
        status: "Selesai",
      })
      .then(() => {
        fetchGuests(); // Refresh data
        setSelectedGuest(null); // Close modal
      })
      .catch((err) => console.error("Error updating guest:", err));
  };

  const getStatusBadge = (guest) => {
    if (!guest.status || guest.status === "Belum Diproses") {
      return <span className="badge unprocessed">Belum Diproses</span>;
    } else if (guest.status === "Diproses") {
      return <span className="badge processing">Diproses</span>;
    } else if (guest.status === "Selesai") {
      return <span className="badge completed">Selesai</span>;
    }
    return <span className="badge processing">Diproses</span>;
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-title">
            <img src={BPSLogo} alt="BPS Logo" className="bps-logo" />
            <h1>Dashboard Admin</h1>
          </div>
          <div className="action-buttons">
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              title="Refresh Data"
            >
              ↻
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="stats-card">
          <div className="stat-container">
            <div className="stat-item">
              <div className="stat-icon today">
                <span className="icon">📅</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{todayGuests}</div>
                <div className="stat-label">Tamu Hari Ini</div>
              </div>
            </div>
          </div>

          <div className="stat-container">
            <div className="stat-item">
              <div className="stat-icon weekly">
                <span className="icon">📈</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{weeklyGuests}</div>
                <div className="stat-label">Tamu Minggu Ini</div>
              </div>
            </div>
          </div>

          <div className="stat-container">
            <div className="stat-item">
              <div className="stat-icon pending">
                <span className="icon">⏳</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{unprocessedGuests}</div>
                <div className="stat-label">Belum Diproses</div>
              </div>
            </div>
          </div>

          <div className="stat-container">
            <div className="stat-item">
              <div className="stat-icon completed">
                <span className="icon">✓</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{completedGuests}</div>
                <div className="stat-label">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        <div className="guests-card">
          <div className="card-header">
            <h2>Daftar Tamu</h2>
            <div className="tab-controls">
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Semua
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "unprocessed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("unprocessed")}
              >
                Belum Diproses
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "processed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("processed")}
              >
                Diproses
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "completed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Selesai
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Memuat data...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={fetchGuests} className="retry-btn">
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="guests-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Keperluan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td>{guest.nama}</td>
                      <td className="purpose-cell">{guest.keperluan}</td>
                      <td>{guest.tanggal_kedatangan}</td>
                      <td>{getStatusBadge(guest)}</td>
                      <td className="actions-cell">
                        <button
                          className="action-btn view"
                          onClick={() => setSelectedGuest(guest)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {displayedGuests.length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-data">
                        {activeTab === "completed"
                          ? "Tidak ada tamu yang telah selesai."
                          : activeTab === "unprocessed"
                          ? "Tidak ada tamu yang belum diproses."
                          : activeTab === "processed"
                          ? "Tidak ada tamu yang sedang diproses."
                          : "Belum ada data tamu."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filteredGuests.length > 5 && (
            <div className="show-more">
              <button onClick={() => setShowAll(!showAll)}>
                {showAll ? "Sembunyikan" : "Lihat Semua"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGuest && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Detail Tamu</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedGuest(null)}
              >
                ×
              </button>
            </div>

            <div className="guest-details">
              <div className="detail-status">
                {getStatusBadge(selectedGuest)}
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Nama</div>
                  <div className="detail-value">{selectedGuest.nama}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{selectedGuest.email}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">No HP</div>
                  <div className="detail-value">{selectedGuest.no_hp}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Tanggal</div>
                  <div className="detail-value">
                    {selectedGuest.tanggal_kedatangan}
                  </div>
                </div>

                <div className="detail-item full-width">
                  <div className="detail-label">Keperluan</div>
                  <div className="detail-value">{selectedGuest.keperluan}</div>
                </div>

                <div className="detail-item full-width">
                  <div className="detail-label">Alamat</div>
                  <div className="detail-value">{selectedGuest.alamat}</div>
                </div>

                <div className="detail-item full-width">
                  <div className="detail-label">Pekerjaan</div>
                  <div className="detail-value">{selectedGuest.pekerjaan}</div>
                </div>

                {selectedGuest.isi_pertemuan && (
                  <div className="detail-item full-width">
                    <div className="detail-label">Hasil Pertemuan</div>
                    <div className="detail-value">
                      {selectedGuest.isi_pertemuan}
                    </div>
                  </div>
                )}

                {selectedGuest.dokumentasi && (
                  <div className="detail-item full-width">
                    <div className="detail-label">Dokumentasi</div>
                    <div className="detail-value image-container">
                      <img src={selectedGuest.dokumentasi} alt="Dokumentasi" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setSelectedGuest(null)}
              >
                Tutup
              </button>

              <button
                className="btn-edit"
                onClick={() =>
                  navigate(`/pages/EditGuestForm/${selectedGuest.id}`)
                }
              >
                Edit
              </button>

              {(!selectedGuest.status ||
                selectedGuest.status === "Belum Diproses") && (
                <button
                  className="btn-follow-up"
                  onClick={() => startProcessing(selectedGuest.id)}
                >
                  Mulai Proses
                </button>
              )}

              {selectedGuest.status === "Diproses" && (
                <button
                  className="btn-follow-up"
                  onClick={() =>
                    navigate(`/pages/FollowUpForm/${selectedGuest.id}`)
                  }
                >
                  Tindak Lanjut
                </button>
              )}

              {selectedGuest.status === "Diproses" && (
                <button
                  className="btn-complete"
                  onClick={() => markAsCompleted(selectedGuest.id)}
                >
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

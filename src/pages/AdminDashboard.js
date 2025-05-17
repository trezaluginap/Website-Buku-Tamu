// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import BPSLogo from "../assets/BPS.png";
import Sidebar from "../pages/sidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle sidebar state
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prevState) => !prevState);
  }, []);

  // Fetch guests data - diubah untuk menggunakan endpoint lokal
  const fetchGuests = useCallback(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/tamu")
      .then((res) => {
        setGuests(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchGuests();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchGuests, 30000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchGuests]);

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

  // Start processing a guest - diubah untuk menggunakan endpoint lokal
  const startProcessing = (guestId) => {
    const updatedGuest = guests.find((g) => g.id === guestId);
    if (!updatedGuest) return;

    axios
      .put(`http://localhost:5000/api/tamu/${guestId}`, {
        ...updatedGuest,
        status: "Diproses",
      })
      .then(() => {
        fetchGuests(); // Refresh data
        setSelectedGuest(null); // Close modal
      })
      .catch((err) => console.error("Error updating guest:", err));
  };

  // Mark guest as completed - diubah untuk menggunakan endpoint lokal
  const markAsCompleted = (guestId) => {
    const updatedGuest = guests.find((g) => g.id === guestId);
    if (!updatedGuest) return;

    axios
      .put(`http://localhost:5000/api/tamu/${guestId}`, {
        ...updatedGuest,
        status: "Selesai",
      })
      .then(() => {
        fetchGuests(); // Refresh data
        setSelectedGuest(null); // Close modal
      })
      .catch((err) => console.error("Error updating guest:", err));
  };

  // Close modal with keyboard or click outside
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && selectedGuest) {
        setSelectedGuest(null);
      }
    };

    const handleClickOutside = (e) => {
      if (selectedGuest && e.target.classList.contains("modal-backdrop")) {
        setSelectedGuest(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [selectedGuest]);

  // Get status badge
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
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
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
                  onClick={fetchGuests}
                  title="Refresh Data"
                  aria-label="Refresh data"
                >
                  <span role="img" aria-hidden="true">
                    ↻
                  </span>
                </button>
              </div>
            </div>
          </header>

          <div className="dashboard-grid">
            {/* Statistics Cards */}
            <div className="stats-card">
              <div className="stat-container">
                <div className="stat-item">
                  <div className="stat-icon today">
                    <span className="icon" role="img" aria-hidden="true">
                      📅
                    </span>
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
                    <span className="icon" role="img" aria-hidden="true">
                      📈
                    </span>
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
                    <span className="icon" role="img" aria-hidden="true">
                      ⏳
                    </span>
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
                    <span className="icon" role="img" aria-hidden="true">
                      ✓
                    </span>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{completedGuests}</div>
                    <div className="stat-label">Selesai</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guests List */}
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

              {/* Content states: loading, error, data */}
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner" aria-label="Loading"></div>
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
                      {displayedGuests.length > 0 ? (
                        displayedGuests.map((guest) => (
                          <tr key={guest.id}>
                            <td>{guest.nama}</td>
                            <td className="purpose-cell">{guest.keperluan}</td>
                            <td>{guest.tanggal_kedatangan}</td>
                            <td>{getStatusBadge(guest)}</td>
                            <td className="actions-cell">
                              <button
                                className="action-btn view"
                                onClick={() => setSelectedGuest(guest)}
                                aria-label={`View details for ${guest.nama}`}
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
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

              {/* Show more/less button */}
              {filteredGuests.length > 5 && (
                <div className="show-more">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    aria-label={showAll ? "Show less" : "Show all"}
                  >
                    {showAll ? "Sembunyikan" : "Lihat Semua"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Guest Detail Modal */}
          {selectedGuest && (
            <div
              className="modal-backdrop"
              role="dialog"
              aria-labelledby="modal-title"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3 id="modal-title">Detail Tamu</h3>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedGuest(null)}
                    aria-label="Close modal"
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
                      <div className="detail-value">
                        {selectedGuest.keperluan}
                      </div>
                    </div>

                    <div className="detail-item full-width">
                      <div className="detail-label">Alamat</div>
                      <div className="detail-value">{selectedGuest.alamat}</div>
                    </div>

                    <div className="detail-item full-width">
                      <div className="detail-label">Pekerjaan</div>
                      <div className="detail-value">
                        {selectedGuest.pekerjaan}
                      </div>
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
                          <img
                            src={selectedGuest.dokumentasi}
                            alt={`Dokumentasi untuk ${selectedGuest.nama}`}
                          />
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
      </main>
    </div>
  );
};

export default AdminDashboard;

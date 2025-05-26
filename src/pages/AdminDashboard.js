// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Pastikan path CSS ini benar
import BPSLogo from "../assets/BPS.png"; // Pastikan path logo ini benar
import Sidebar from "../pages/sidebar"; // Impor Sidebar Anda
import GuestDetailModal from "./GuestDetailModal"; // Impor Modal Anda (path disesuaikan)

// --- Definisi Komponen Ikon SVG (TETAP SAMA SEPERTI ASLINYA) ---
const IconMenu = ({ isOpen = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {isOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    )}
  </svg>
);
const IconRefresh = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);
const IconCalendarDays = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);
const IconChartBar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);
const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
    />
  </svg>
);
const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);
const IconChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const IconListBullet = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);
// --- End SVG Icon Components ---

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // API base URL - Pastikan port ini sesuai dengan backend Anda (misalnya 5000 atau 3000)
  const API_BASE_URL = "http://localhost:5000/api";

  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  const fetchGuests = useCallback(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get(`${API_BASE_URL}/tamu`)
      .then((res) => {
        // Pastikan data yang diterima adalah array, jika backend mengirim { tamu: [...] }
        // Anda mungkin perlu mengubah ini menjadi setGuests(res.data.tamu);
        // Berdasarkan backend tamu.js yang baru, seharusnya res.data langsung array.
        setGuests(Array.isArray(res.data) ? res.data : (res.data.tamu || []));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
        setIsLoading(false);
      });
  }, [API_BASE_URL]); // API_BASE_URL ditambahkan sebagai dependensi

  useEffect(() => {
    fetchGuests();
    const intervalId = setInterval(fetchGuests, 30000);
    return () => clearInterval(intervalId);
  }, [fetchGuests]);

  // --- FUNGSI formatDate YANG DIPERBARUI ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    let date;
    const initialDate = new Date(dateString); 

    if (!isNaN(initialDate.getTime())) {
      date = initialDate;
    } else {
      const parts = dateString.replace("T", " ").split(/[- :]/);
      if (parts.length >= 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const day = parseInt(parts[2], 10);
        const hours = parts[3] ? parseInt(parts[3], 10) : 0;
        const minutes = parts[4] ? parseInt(parts[4], 10) : 0;
        const seconds = parts[5] ? parseInt(parts[5], 10) : 0;
        date = new Date(year, month, day, hours, minutes, seconds);
      } else {
        return "Invalid Date Format";
      }
    }

    if (!date || isNaN(date.getTime())) return "Invalid Date Value";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayDateOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

    try {
      if (inputDateOnly.getTime() === todayDateOnly.getTime()) {
        return `Hari Ini, ${date.toLocaleTimeString("id-ID", timeOptions)}`;
      }
      if (inputDateOnly.getTime() === yesterdayDateOnly.getTime()) {
        return `Kemarin, ${date.toLocaleTimeString("id-ID", timeOptions)}`;
      }
      return (
        date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) + `, ${date.toLocaleTimeString("id-ID", timeOptions)}`
      );
    } catch (e) {
      console.error(
        "Error formatting date:",
        e,
        "for dateString:",
        dateString,
        "parsed as:",
        date
      );
      return "Date Format Error";
    }
  };

  const getFilteredGuests = () => {
    let filtered = guests.filter((guest) => {
      const statusMatch = (() => {
        switch (activeTab) {
          case "completed":
            return guest.status === "Selesai";
          case "unprocessed":
            return guest.status === "Belum Diproses" || !guest.status;
          case "processing":
            return guest.status === "Diproses";
          default:
            return true;
        }
      })();

      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        guest.nama_lengkap?.toLowerCase().includes(searchTermLower) ||
        guest.instansi?.toLowerCase().includes(searchTermLower) || // 'instansi' bukan 'pekerjaan' untuk search
        guest.keperluan?.toLowerCase().includes(searchTermLower) ||
        (guest.topik_konsultasi &&
          guest.topik_konsultasi.toLowerCase().includes(searchTermLower));

      return statusMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const dateB = b.tanggal_kehadiran
            ? new Date(b.tanggal_kehadiran)
            : null;
          const dateA = a.tanggal_kehadiran
            ? new Date(a.tanggal_kehadiran)
            : null;
          if (dateB && dateA) return dateB - dateA;
          if (dateB) return 1; 
          if (dateA) return -1; 
          return 0;
        case "oldest":
          const dateAOld = a.tanggal_kehadiran
            ? new Date(a.tanggal_kehadiran)
            : null;
          const dateBOld = b.tanggal_kehadiran
            ? new Date(b.tanggal_kehadiran)
            : null;
          if (dateAOld && dateBOld) return dateAOld - dateBOld;
          if (dateAOld) return 1;
          if (dateBOld) return -1;
          return 0;
        case "name":
          return (a.nama_lengkap || "").localeCompare(b.nama_lengkap || "");
        case "status":
          const statusOrder = {
            "Belum Diproses": 0,
            null: 0, 
            Diproses: 1,
            Selesai: 2,
          };
          const statusAVal = a.status === null ? "null" : a.status;
          const statusBVal = b.status === null ? "null" : b.status;
          return (
            (statusOrder[statusAVal] || 3) - (statusOrder[statusBVal] || 3)
          ); 
        default:
          return 0;
      }
    });
  };

  const getStatistics = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(
      weekStart.getDate() -
        weekStart.getDay() +
        (weekStart.getDay() === 0 ? -6 : 1)
    );
    const weekStartStr = weekStart.toISOString().split("T")[0];

    return {
      todayGuests: guests.filter(
        (g) => g.tanggal_kehadiran && g.tanggal_kehadiran.startsWith(today)
      ).length,
      weeklyGuests: guests.filter(
        (g) => g.tanggal_kehadiran && g.tanggal_kehadiran >= weekStartStr
      ).length,
      unprocessedGuests: guests.filter(
        (g) => g.status === "Belum Diproses" || !g.status
      ).length,
      completedGuests: guests.filter((g) => g.status === "Selesai").length,
    };
  }, [guests]);

  const statistics = getStatistics();
  const displayedGuests = getFilteredGuests().slice(
    0,
    showAll ? undefined : 10
  );

  const updateGuestStatus = useCallback(
    (guestId, newStatus) => {
      const guestToUpdate = guests.find((g) => g.id === guestId);
      if (!guestToUpdate) return;
      const previousGuests = [...guests];
      setGuests((prevGuests) =>
        prevGuests.map((g) =>
          g.id === guestId ? { ...g, status: newStatus } : g
        )
      );

      axios
        .put(`${API_BASE_URL}/tamu/${guestId}`, {
          // Kirim hanya field yang diupdate jika backend mendukung partial update
          // atau seluruh objek guest jika backend mengharapkannya.
          // Berdasarkan backend tamu.js yang baru, ia mengharapkan field yang diizinkan.
          // Jadi, lebih aman mengirim objek yang relevan.
          status: newStatus, 
          // Jika field lain juga bisa diubah dari sini, sertakan:
          // nama_lengkap: guestToUpdate.nama_lengkap, 
          // ...dan field lainnya dari guestToUpdate
        })
        .then((response) => { // Tambahkan response
          if (selectedGuest && selectedGuest.id === guestId) {
            setSelectedGuest((prev) =>
              prev ? { ...prev, status: newStatus, ...response.data.guest } : null // Update dengan data dari server jika ada
            );
          }
          // fetchGuests(); // Panggil fetchGuests jika ingin memastikan data sinkron penuh.
                           // Namun, respons PUT seharusnya sudah mengembalikan data terbaru.
                           // Jika backend tamu.js mengembalikan { guest: updatedGuest }, gunakan itu.
          setGuests(prevGuests => prevGuests.map(g => g.id === guestId ? {...g, ...response.data.guest} : g ));

        })
        .catch((err) => {
          console.error("Error updating guest:", err);
          setError("Gagal mengupdate status tamu.");
          setGuests(previousGuests); 
        });
    },
    [guests, selectedGuest, API_BASE_URL] 
  );

  const startProcessing = useCallback(
    (guestId) => updateGuestStatus(guestId, "Diproses"),
    [updateGuestStatus]
  );
  const markAsCompleted = useCallback(
    (guestId) => updateGuestStatus(guestId, "Selesai"),
    [updateGuestStatus]
  );

  const getStatusBadgeClass = (status) => {
    if (!status || status === "Belum Diproses") return "unprocessed";
    if (status === "Diproses") return "processing";
    if (status === "Selesai") return "completed";
    return "pending"; 
  };

  const renderGuestStatusBadge = (guest) => {
    if (!guest) return null;
    const statusValue = guest.status;
    const statusText = statusValue || "Belum Diproses";
    const badgeClass = getStatusBadgeClass(statusValue);
    return (
      <span className={`status-badge status-${badgeClass}`}>{statusText}</span>
    );
  };

  const getPriorityIndicator = (guest) => {
    if (!guest || !guest.tanggal_kehadiran) return null;
    const today = new Date().toISOString().split("T")[0];
    const isToday = guest.tanggal_kehadiran.startsWith(today); 
    const isUrgent =
      guest.keperluan &&
      (guest.keperluan.toLowerCase().includes("mendesak") ||
        guest.keperluan.toLowerCase().includes("urgent"));
    if (isToday && (guest.status === "Belum Diproses" || !guest.status))
      return <span className="priority-indicator today">Hari Ini</span>;
    if (isUrgent)
      return <span className="priority-indicator urgent">Mendesak</span>;
    return null;
  };

  const truncateText = (text, maxLength = 30) => {
    if (text === null || typeof text === "undefined") return ""; 
    const stringText = String(text); 
    return stringText.length > maxLength
      ? stringText.substring(0, maxLength) + "..."
      : stringText;
  };

  const getEmptyStateMessage = () => {
    if (searchTerm) return `Tidak ada tamu dengan kata kunci "${searchTerm}".`;
    switch (activeTab) {
      case "completed":
        return "Belum ada tamu yang selesai diproses.";
      case "unprocessed":
        return "Semua tamu sudah diproses atau sedang dalam proses.";
      case "processing":
        return "Tidak ada tamu yang sedang dalam proses.";
      default:
        return "Belum ada data tamu yang tercatat.";
    }
  };

  const tabs = [
    { key: "all", label: "Semua", count: guests.length },
    {
      key: "unprocessed",
      label: "Belum Diproses",
      count: statistics.unprocessedGuests,
    },
    {
      key: "processing",
      label: "Diproses",
      count: guests.filter((g) => g.status === "Diproses").length,
    },
    { key: "completed", label: "Selesai", count: statistics.completedGuests },
  ];

  const statItems = [
    {
      id: 1,
      label: "Tamu Hari Ini",
      value: statistics.todayGuests,
      icon: <IconCalendarDays />,
      color: "blue",
    },
    {
      id: 2,
      label: "Tamu Minggu Ini",
      value: statistics.weeklyGuests,
      icon: <IconChartBar />,
      color: "green",
    },
    {
      id: 3,
      label: "Belum Diproses",
      value: statistics.unprocessedGuests,
      icon: <IconClock />,
      color: "yellow",
    },
    {
      id: 4,
      label: "Selesai",
      value: statistics.completedGuests,
      icon: <IconCheckCircle />,
      color: "teal",
    },
  ];

  return (
    <div
      className={`dashboard-layout ${
        isSidebarOpen ? "sidebar-visible" : "sidebar-collapsed"
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content-area">
        <header className="dashboard-header-sticky">
          <div className="header-inner">
            <div className="header-left">
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              >
                <IconMenu isOpen={isSidebarOpen} />
              </button>
              <img src={BPSLogo} alt="BPS Logo" className="header-logo" />
              <h1 className="header-title">Admin Buku Tamu</h1>
            </div>
            <div className="header-right">
              <button
                className={`refresh-action-btn ${
                  isLoading ? "is-loading" : ""
                }`}
                onClick={fetchGuests}
                title="Refresh Data"
                disabled={isLoading}
              >
                <IconRefresh />
                <span className="refresh-text">Refresh</span>
              </button>
            </div>
          </div>
        </header>
        <div className="dashboard-content-wrapper">
          <section className="stats-grid-container">
            {statItems.map((item) => (
              <div
                key={item.id}
                className={`stat-card-item stat-color-${item.color}`}
              >
                <div className="stat-card-icon-wrapper">{item.icon}</div>
                <div className="stat-card-content">
                  <p className="stat-card-value">{item.value}</p>
                  <p className="stat-card-label">{item.label}</p>
                </div>
              </div>
            ))}
          </section>
          <section className="data-panel">
            <div className="panel-header">
              <h2 className="panel-title">Daftar Tamu</h2>
              <div className="controls-group">
                <div className="search-input-wrapper">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Cari tamu, keperluan, instansi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-field"
                  />
                </div>
                <div className="sort-select-wrapper">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="name">Nama (A-Z)</option>
                    <option value="status">Status</option>
                  </select>
                  <IconChevronDown />
                </div>
              </div>
            </div>
            <nav className="tab-navigation">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-item ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span className="tab-item-count">{tab.count}</span>
                </button>
              ))}
            </nav>
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Memuat data tamu...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchGuests} className="retry-button">
                  Coba Lagi
                </button>
              </div>
            ) : displayedGuests.length > 0 ? (
              <>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th data-label="#">#</th>
                        <th data-label="Nama & Instansi">Nama & Instansi</th>
                        <th data-label="Keperluan">Keperluan</th>
                        <th data-label="Tanggal">Tanggal</th>
                        <th data-label="Status">Status</th>
                        <th data-label="Aksi" className="text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedGuests.map((guest, index) => (
                        <tr
                          key={guest.id} 
                          className={`guest-status-row-${getStatusBadgeClass(
                            guest.status
                          )}`}
                        >
                          <td
                            data-label="#"
                            className="text-center cell-narrow"
                          >
                            {index + 1}
                          </td>
                          <td data-label="Nama & Instansi">
                            <div className="guest-primary-info">
                              <span className="guest-name-text">
                                {guest.nama_lengkap || "-"}
                              </span>
                              {getPriorityIndicator(guest)}
                              {guest.instansi && (
                                <span className="guest-company-text">
                                  {truncateText(guest.instansi, 25)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td data-label="Keperluan" className="cell-purpose">
                            {guest.keperluan &&
                            guest.keperluan
                              .toLowerCase()
                              .includes("konsultasi") &&
                            guest.topik_konsultasi
                              ? `${truncateText(
                                  guest.keperluan,
                                  20
                                )} (${truncateText(
                                  guest.topik_konsultasi,
                                  25
                                )})`
                              : truncateText(guest.keperluan, 50)}
                          </td>
                          <td data-label="Tanggal" className="cell-date">
                            {formatDate(guest.tanggal_kehadiran)}
                          </td>
                          <td data-label="Status">
                            {renderGuestStatusBadge(guest)}
                          </td>
                          <td data-label="Aksi" className="cell-actions">
                            <div className="action-buttons-group">
                              <button
                                onClick={() => setSelectedGuest(guest)}
                                className="action-button"
                                title="Lihat Detail"
                              >
                                <IconEye />
                              </button>
                              {(!guest.status ||
                                guest.status === "Belum Diproses") && (
                                <button
                                  onClick={() => startProcessing(guest.id)}
                                  className="action-button"
                                  title="Mulai Proses"
                                >
                                  <IconPlay />
                                </button>
                              )}
                              {guest.status === "Diproses" && (
                                <button
                                  onClick={() => markAsCompleted(guest.id)}
                                  className="action-button"
                                  title="Tandai Selesai"
                                >
                                  <IconCheck />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {getFilteredGuests().length > 10 &&
                  !showAll && ( 
                    <div className="pagination-footer">
                      <p className="results-count-info">
                        Menampilkan {displayedGuests.length} dari{" "}
                        {getFilteredGuests().length} tamu
                      </p>
                      <button
                        onClick={() => setShowAll(true)} 
                        className="show-all-button"
                      >
                        {`Tampilkan Semua (${getFilteredGuests().length})`}
                      </button>
                    </div>
                  )}
                {showAll &&
                  getFilteredGuests().length > 10 && ( 
                    <div className="pagination-footer">
                      <p className="results-count-info">
                        Menampilkan semua {getFilteredGuests().length} tamu
                      </p>
                      <button
                        onClick={() => setShowAll(false)}
                        className="show-all-button"
                      >
                        Tampilkan Lebih Sedikit
                      </button>
                    </div>
                  )}
              </>
            ) : (
              <div className="empty-state-display">
                <IconListBullet />
                <p className="empty-state-title">Tidak Ada Data</p>
                <p className="empty-state-message">{getEmptyStateMessage()}</p>
                {searchTerm && (
                  <button
                    className="clear-filter-button"
                    onClick={() => setSearchTerm("")}
                  >
                    Hapus Filter Pencarian
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedGuest && (
        <GuestDetailModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onStartProcessing={startProcessing}
          onMarkCompleted={markAsCompleted}
          onNavigateToEdit={(id) => navigate(`/pages/EditGuestForm/${id}`)}
          onNavigateToFollowUp={(id) => navigate(`/pages/FollowUpForm/${id}`)}
          getStatusBadge={renderGuestStatusBadge}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
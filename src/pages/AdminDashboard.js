// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Pastikan ini adalah file CSS yang Anda berikan
import BPSLogo from "../assets/BPS.png";
import Sidebar from "../pages/sidebar";
import GuestDetailModal from "./GuestDetailModal";

// --- Definisi Komponen Ikon SVG ---
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
const IconListBullet = (
  { className = "empty-state-icon-svg" }
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
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

  const API_BASE_URL = "http://localhost:5000/api";

  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  const fetchGuests = useCallback(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get(`${API_BASE_URL}/tamu`)
      .then((res) => {
        const data = res.data;
        // Flexible handling: data might be an array directly, or nested under a 'tamu' key
        const guestList = Array.isArray(data) ? data : (data && data.tamu ? data.tamu : []);
        
        if (Array.isArray(guestList)) {
            setGuests(guestList);
        } else {
            console.error("Data from API is not in expected format (array or {tamu: array}):", data);
            setGuests([]);
            setError("Format data dari server tidak sesuai.");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data tamu. Silakan coba lagi nanti.");
        setIsLoading(false);
      });
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchGuests();
    const intervalId = setInterval(fetchGuests, 30000); // Refresh data setiap 30 detik
    return () => clearInterval(intervalId);
  }, [fetchGuests]);

  // Fungsi format tanggal dan waktu yang lebih baik
  const formatDateTime = useCallback(
    (dateString, includeDate = true, includeTime = true) => {
      if (!dateString) return "N/A";
      try {
        let date = new Date(dateString); 
        if (isNaN(date.getTime())) {
          // Fallback parsing jika format dari DB tidak standar ISO (misal, spasi bukan 'T')
          const normalizedDateString = String(dateString).replace(" ", "T");
          const fallbackDate = new Date(normalizedDateString);
          if (isNaN(fallbackDate.getTime())) {
            // Further fallback for YYYY-MM-DD HH:MM:SS
            const parts = String(dateString).split(/[- :]/);
            if (parts.length >= 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) -1; // Month is 0-indexed
                const day = parseInt(parts[2], 10);
                const hours = parts.length > 3 ? parseInt(parts[3], 10) : 0;
                const minutes = parts.length > 4 ? parseInt(parts[4], 10) : 0;
                const seconds = parts.length > 5 ? parseInt(parts[5], 10) : 0;
                if (![year, month, day, hours, minutes, seconds].some(isNaN)) {
                    date = new Date(year, month, day, hours, minutes, seconds);
                }
            }
            if (isNaN(date.getTime())) {
                 console.warn(`Invalid date format encountered: ${dateString}`);
                 return "Tgl Invalid";
            }
          } else {
            date.setTime(fallbackDate.getTime()); 
          }
        }

        const dateOptions = { day: "numeric", month: "short", year: "numeric" };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        let parts = [];
        if (includeDate) {
          parts.push(date.toLocaleDateString("id-ID", dateOptions));
        }
        if (includeTime) {
          parts.push(date.toLocaleTimeString("id-ID", timeOptions));
        }
        return parts.join(", ").trim() || (includeDate ? "Tgl Invalid" : "Waktu Invalid");
      } catch (e) {
        console.error(
          "Error formatting date:",
          e,
          "for dateString:",
          dateString
        );
        return "Error Tgl";
      }
    },
    []
  );
  
  // Format tanggal saja (Hari Ini, Kemarin, atau DD Mmm YYYY)
  const formatDateForDisplay = useCallback((dateString) => {
    if (!dateString) return "N/A";
    let date = new Date(dateString);
    
    // Handle YYYY-MM-DD as local date, not UTC midnight
    if (String(dateString).match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = String(dateString).split('-').map(Number);
        date = new Date(year, month - 1, day); 
    } else if (isNaN(date.getTime())) {
        const normalizedDateString = String(dateString).replace(" ", "T");
        date = new Date(normalizedDateString);
    }

    if (isNaN(date.getTime())) return "Tgl Invalid";

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

    if (inputDateOnly.getTime() === todayDateOnly.getTime()) return "Hari Ini";
    if (inputDateOnly.getTime() === yesterdayDateOnly.getTime())
      return "Kemarin";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);


  const getFilteredGuests = useCallback(() => {
    let filtered = Array.isArray(guests) ? guests : []; 

    filtered = filtered.filter((guest) => {
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
        guest.pekerjaan?.toLowerCase().includes(searchTermLower) || 
        guest.keperluan?.toLowerCase().includes(searchTermLower) ||
        (guest.topik_konsultasi &&
          guest.topik_konsultasi.toLowerCase().includes(searchTermLower));
      return statusMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const dateB = b.tanggal_kehadiran ? new Date(b.tanggal_kehadiran) : null;
          const dateA = a.tanggal_kehadiran ? new Date(a.tanggal_kehadiran) : null;
          if (dateB && dateA) {
            const dateDiff = dateB.getTime() - dateA.getTime();
            if (dateDiff !== 0) return dateDiff;
            const timeB = b.jam_tindak_lanjut ? new Date(b.jam_tindak_lanjut) : (b.tanggal_kehadiran ? dateB : null);
            const timeA = a.jam_tindak_lanjut ? new Date(a.jam_tindak_lanjut) : (a.tanggal_kehadiran ? dateA : null);
            if (timeB && timeA) return timeB.getTime() - timeA.getTime();
            if (timeB) return 1; 
            if (timeA) return -1;
            return 0;
          }
          if (dateB) return 1; 
          if (dateA) return -1; 
          return 0;
        case "oldest":
          const dateAOld = a.tanggal_kehadiran ? new Date(a.tanggal_kehadiran) : null;
          const dateBOld = b.tanggal_kehadiran ? new Date(b.tanggal_kehadiran) : null;
          if (dateAOld && dateBOld) {
            const dateDiff = dateAOld.getTime() - dateBOld.getTime();
            if (dateDiff !== 0) return dateDiff;
            const timeAOld = a.jam_tindak_lanjut ? new Date(a.jam_tindak_lanjut) : (a.tanggal_kehadiran ? dateAOld : null);
            const timeBOld = b.jam_tindak_lanjut ? new Date(b.jam_tindak_lanjut) : (b.tanggal_kehadiran ? dateBOld : null);
            if (timeAOld && timeBOld) return timeAOld.getTime() - timeBOld.getTime();
            if (timeAOld) return 1;
            if (timeBOld) return -1;
            return 0;
          }
          if (dateAOld) return 1;
          if (dateBOld) return -1;
          return 0;
        case "name":
          return (a.nama_lengkap || "").localeCompare(b.nama_lengkap || "");
        case "status":
          const statusOrder = {
            "Belum Diproses": 0,
            null: 0, // Handles actual null status
            Diproses: 1,
            "Perlu Tindak Lanjut": 1, 
            "Penjadwalan Berikutnya": 1,
            Selesai: 2,
          };
          const statusAVal = statusOrder.hasOwnProperty(a.status) ? statusOrder[a.status] : (a.status === null ? statusOrder.null : 3);
          const statusBVal = statusOrder.hasOwnProperty(b.status) ? statusOrder[b.status] : (b.status === null ? statusOrder.null : 3);
          return statusAVal - statusBVal; 
        default:
          return 0;
      }
    });
  }, [guests, activeTab, searchTerm, sortBy]);
  
  const getStatistics = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekStartObj = new Date();
    weekStartObj.setDate(
      weekStartObj.getDate() -
        weekStartObj.getDay() +
        (weekStartObj.getDay() === 0 ? -6 : 1) // Adjust to Monday of the week
    );
    const weekStartStr = weekStartObj.toISOString().split("T")[0];
    const safeGuests = Array.isArray(guests) ? guests : [];
    
    return {
      todayGuests: safeGuests.filter(
        (g) => g.tanggal_kehadiran && String(g.tanggal_kehadiran).startsWith(today)
      ).length,
      weeklyGuests: safeGuests.filter(
        (g) => g.tanggal_kehadiran && String(g.tanggal_kehadiran) >= weekStartStr
      ).length,
      unprocessedGuests: safeGuests.filter(
        (g) => g.status === "Belum Diproses" || !g.status
      ).length,
      completedGuests: safeGuests.filter((g) => g.status === "Selesai").length,
    };
  }, [guests]);

  const statistics = getStatistics();
  const itemsPerPage = 10;
  const filteredGuests = getFilteredGuests(); // Call it once
  const displayedGuests = filteredGuests.slice(
    0,
    showAll ? filteredGuests.length : itemsPerPage
  );

  const updateGuestStatus = useCallback(
    (guestId, newStatus) => {
      const guestToUpdate = guests.find((g) => g.id === guestId);
      if (!guestToUpdate) return;
      
      const previousGuests = JSON.parse(JSON.stringify(guests)); // Deep copy for rollback
      
      setGuests((prevGuests) =>
        prevGuests.map((g) =>
          g.id === guestId ? { ...g, status: newStatus } : g
        )
      );

      if (selectedGuest && selectedGuest.id === guestId) {
        setSelectedGuest(prev => prev ? {...prev, status: newStatus} : null);
      }
      
      let payload = { status: newStatus };
      // Uncomment if "Selesai" should auto-set jam_tindak_lanjut if not present
      // if (newStatus === "Selesai" && !guestToUpdate.jam_tindak_lanjut) {
      //    payload.jam_tindak_lanjut = new Date().toISOString();
      // }

      axios
        .put(`${API_BASE_URL}/tamu/${guestId}`, payload)
        .then((response) => {
          // Update with potentially more complete data from backend
          const updatedGuestData = response.data.guest || response.data;
          setGuests(prevGuests => prevGuests.map(g => g.id === guestId ? {...g, ...updatedGuestData} : g ));
          if (selectedGuest && selectedGuest.id === guestId && updatedGuestData) {
            setSelectedGuest(prev => ({...prev, ...updatedGuestData})); 
          }
        })
        .catch((err) => {
          console.error("Error updating guest status:", err.response?.data || err.message);
          setError(
             err.response?.data?.error ||
             err.response?.data?.message ||
             "Gagal mengupdate status tamu. Perubahan dikembalikan."
          );
          setGuests(previousGuests); // Rollback optimistic update
          if (selectedGuest && selectedGuest.id === guestId) { 
            const originalGuestInModal = previousGuests.find(g => g.id === guestId);
            if (originalGuestInModal) setSelectedGuest(originalGuestInModal);
          }
        });
    },
    [guests, selectedGuest, API_BASE_URL, fetchGuests] // fetchGuests might be needed if PUT response is minimal
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
    if (status === "Perlu Tindak Lanjut" || status === "Penjadwalan Berikutnya") return "needs-action";
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
    const isToday = String(guest.tanggal_kehadiran).startsWith(today);
    const isUrgent =
      guest.keperluan?.toLowerCase().includes("mendesak") ||
      guest.keperluan?.toLowerCase().includes("urgent");
    
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
    {
      key: "all",
      label: "Semua",
      count: Array.isArray(guests) ? guests.length : 0,
    },
    {
      key: "unprocessed",
      label: "Belum Diproses",
      count: statistics.unprocessedGuests,
    },
    {
      key: "processing",
      label: "Diproses",
      count: Array.isArray(guests)
        ? guests.filter((g) => g.status === "Diproses").length
        : 0,
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
                className="sidebar-toggle btn-icon"
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
                className={`refresh-action-btn btn-primary ${
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
                        placeholder="Cari tamu, keperluan, pekerjaan..."
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
                <div className="spinner"></div> <p>Memuat data tamu...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button
                  onClick={fetchGuests}
                  className="retry-button btn-primary"
                >
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
                        <th data-label="Nama & Pekerjaan">Nama & Pekerjaan</th>
                        <th data-label="Keperluan">Keperluan</th>
                        <th data-label="Waktu Kunjungan">Waktu Kunjungan</th>
                        <th data-label="Jam Tindak Lanjut">Jam Tindak Lanjut</th>
                        <th data-label="Status & Detail Proses">Status & Detail Proses</th>
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
                          <td data-label="Nama & Pekerjaan">
                            <div className="guest-primary-info">
                                <span className="guest-name-text">
                                {guest.nama_lengkap || "-"}
                                </span>
                                {getPriorityIndicator(guest)}
                                {guest.pekerjaan && (
                                <span className="guest-company-text">
                                    {truncateText(guest.pekerjaan, 25)}
                                </span>
                                )}
                            </div>
                          </td>
                          <td data-label="Keperluan" className="cell-purpose">
                            {guest.keperluan
                                ?.toLowerCase()
                                .includes("konsultasi") &&
                            guest.topik_konsultasi ? (
                                <>
                                {truncateText(guest.keperluan, 20)}
                                <span className="topic-detail">
                                    {" "}
                                    ({truncateText(guest.topik_konsultasi, 25)})
                                </span>
                                </>
                            ) : guest.keperluan
                                ?.toLowerCase()
                                .includes("mitra") && guest.tujuan_kunjungan ? (
                                <>
                                {truncateText(guest.keperluan, 20)}
                                <span className="topic-detail">
                                    {" "}
                                    ({truncateText(guest.tujuan_kunjungan, 25)})
                                </span>
                                </>
                            ) : guest.keperluan
                                ?.toLowerCase()
                                .includes("umum") && guest.tujuan_kunjungan ? (
                                <>
                                {truncateText(guest.keperluan, 20)}
                                <span className="topic-detail">
                                    {" "}
                                    ({truncateText(guest.tujuan_kunjungan, 25)})
                                </span>
                                </>
                            ) : (
                                truncateText(guest.keperluan, 50)
                            )}
                          </td>
                          <td data-label="Waktu Kunjungan" className="cell-datetime">
                            <div className="datetime-entry">
                                <span className="datetime-label">Datang:</span>
                                <span>
                                {formatDateForDisplay(guest.tanggal_kehadiran)}
                                </span>
                            </div>
                            {guest.jam_submit_data && (
                                <div className="datetime-entry subtle">
                                <span className="datetime-label">Submit:</span>
                                <span>
                                    {formatDateTime(
                                    guest.jam_submit_data,
                                    false, // includeDate = false
                                    true   // includeTime = true
                                    )}
                                </span>
                                </div>
                            )}
                          </td>
                          <td data-label="Jam Tindak Lanjut" className="cell-time">
                            {guest.jam_tindak_lanjut ? formatDateTime(guest.jam_tindak_lanjut, false, true) : "-"}
                          </td>
                          <td data-label="Status & Detail Proses" className="cell-status-proses">
                            <div
                                style={{
                                marginBottom:
                                    guest.jam_diterima ||
                                    guest.jam_selesai_tindak_lanjut
                                    ? "0.25rem"
                                    : "0",
                                }}
                            >
                                {renderGuestStatusBadge(guest)}
                            </div>
                            {guest.jam_diterima && (
                                <div className="datetime-entry small">
                                <span className="datetime-label">
                                    Diproses:
                                </span>
                                <span>
                                    {formatDateTime(
                                    guest.jam_diterima,
                                    true, 
                                    true  
                                    )}
                                </span>
                                </div>
                            )}
                            {guest.jam_selesai_tindak_lanjut && (
                                <div className="datetime-entry small">
                                <span className="datetime-label">Selesai TL:</span> 
                                <span>
                                    {formatDateTime(
                                    guest.jam_selesai_tindak_lanjut,
                                    true, 
                                    true  
                                    )}
                                </span>
                                </div>
                            )}
                          </td>
                          <td data-label="Aksi" className="cell-actions">
                            <div className="action-buttons-group">
                                <button
                                onClick={() => setSelectedGuest(guest)}
                                className="action-button btn-blue-icon"
                                title="Lihat Detail"
                                >
                                <IconEye />
                                </button>
                                {(!guest.status ||
                                guest.status === "Belum Diproses") && (
                                <button
                                    onClick={() => startProcessing(guest.id)}
                                    className="action-button btn-blue-icon"
                                    title="Mulai Proses"
                                >
                                    <IconPlay />
                                </button>
                                )}
                                {guest.status === "Diproses" && (
                                <button
                                    onClick={() => markAsCompleted(guest.id)}
                                    className="action-button btn-blue-icon"
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
                {filteredGuests.length > itemsPerPage && !showAll && (
                  <div className="pagination-footer">
                    <p className="results-count-info">
                      Menampilkan {displayedGuests.length} dari{" "}
                      {filteredGuests.length} tamu
                    </p>
                    <button
                      onClick={() => setShowAll(true)}
                      className="show-all-button btn-link-blue"
                    >{`Tampilkan Semua (${
                      filteredGuests.length
                    })`}</button>
                  </div>
                )}
                {showAll && filteredGuests.length > itemsPerPage && (
                  <div className="pagination-footer">
                    <p className="results-count-info">
                      Menampilkan semua {filteredGuests.length} tamu
                    </p>
                    <button
                      onClick={() => setShowAll(false)}
                      className="show-all-button btn-link-blue"
                    >
                      Tampilkan Lebih Sedikit
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state-display">
                <IconListBullet className="empty-state-icon-svg" />
                <p className="empty-state-title">Tidak Ada Data</p>
                <p className="empty-state-message">{getEmptyStateMessage()}</p>
                {searchTerm && (
                  <button
                    className="clear-filter-button btn-secondary"
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
          renderStatusBadge={renderGuestStatusBadge} 
          formatDateTime={formatDateTime} 
          formatDateForDisplay={formatDateForDisplay}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
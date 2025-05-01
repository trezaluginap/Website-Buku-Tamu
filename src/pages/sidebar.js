// src/pages/Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";
import BPSLogo from "../assets/BPS.png";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={BPSLogo} alt="BPS Logo" />
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        <div className="sidebar-menu">
          <Link to="/admin" className="sidebar-item active">
            📊 Dashboard
          </Link>
          <Link to="/pages/UserManagement" className="sidebar-item">
            👥 Kelola Pengguna
          </Link>
          <Link to="/pages/PrintPDF" className="sidebar-item">
            📄 Cetak PDF
          </Link>
          <Link to="/logout" className="sidebar-item logout">
            🚪 Keluar
          </Link>
        </div>
      </div>
      {!isSidebarOpen && (
        <button className="sidebar-toggle-collapsed" onClick={toggleSidebar}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}
    </>
  );
};

export default Sidebar;

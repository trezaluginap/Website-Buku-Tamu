// src/components/Sidebar.js
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import BPSLogo from "../assets/BPS.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, toggleSidebar]);

  // Handle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Menu items data for easier management
  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/pages/UserManagement", icon: "👥", label: "Kelola Pengguna" },
    { path: "/pages/PrintPDF", icon: "📄", label: "Cetak PDF" },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={BPSLogo} alt="BPS Logo" />
            <span className="sidebar-logo-text">BPS Admin</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-text">{item.label}</span>
            </Link>
          ))}

          <Link to="/logout" className="sidebar-item logout">
            <span className="sidebar-item-icon">🚪</span>
            <span className="sidebar-item-text">Keluar</span>
          </Link>
        </div>
      </div>

      <div
        className={`toggle-button-container ${isOpen ? "sidebar-open" : ""}`}
      >
        {!isOpen && (
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;

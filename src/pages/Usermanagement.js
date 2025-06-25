// src/pages/UserManagement.js
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar"; // Mengimpor komponen Sidebar
import "../styles/userManagement.css"; // CSS utama Anda
import "../styles/sidebar.css"; // CSS untuk Sidebar itu sendiri
import LogoBps from "../assets/BPS.png"; // Logo sudah diimpor dengan benar

// Fungsi untuk menghasilkan data dummy jika API tidak tersedia
const generateDummyUsers = (count) => {
  const dummies = [];
  for (let i = 1; i <= count; i++) {
    dummies.push({
      id: `dummy-${i}`,
      name: `User Dummy ${i}`,
      nip: `12345600${i}`,
      username: `userdummy${i}`,
      password: "password123" // Ini hanya untuk struktur, jangan tampilkan di UI
    });
  }
  return dummies;
};


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  // Inisialisasi state loggedInUser dengan NIP juga
  const [loggedInUser, setLoggedInUser] = useState({ 
    username: "Memuat...", 
    name: "Memuat...", 
    nip: "Memuat...", // Tambahkan NIP
    role: "..." 
  });

  // Efek untuk mengambil data pengguna yang login dari localStorage saat komponen dimuat
  useEffect(() => {
    console.log("Mencoba mengambil data pengguna dari localStorage...");
    const userDataString = localStorage.getItem('currentUser'); 
    console.log("Data string dari localStorage ('currentUser'):", userDataString);

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log("Data pengguna setelah di-parse:", userData);

        // Pastikan userData memiliki properti yang benar
        // Sesuaikan nama properti (misal: userData.employeeNip jika backend mengirim itu)
        if (userData && (userData.username || userData.name)) { 
          setLoggedInUser({
            username: userData.username || "N/A", 
            name: userData.name || userData.username || "Pengguna", 
            nip: userData.nip || "NIP Tidak Ada", // Ambil NIP, beri fallback
            role: userData.role || "Role Tidak Diketahui" 
          });
          console.log("State loggedInUser berhasil diupdate:", {
            username: userData.username || "N/A",
            name: userData.name || userData.username || "Pengguna",
            nip: userData.nip || "NIP Tidak Ada",
            role: userData.role || "Role Tidak Diketahui"
          });
        } else {
          console.warn("Data pengguna di localStorage ('currentUser') tidak memiliki properti 'username' atau 'name' yang diharapkan.");
          setLoggedInUser({ username: "Pengguna", name: "Pengguna", nip: "N/A", role: "Role Default" });
        }
      } catch (e) {
        console.error("Gagal mem-parse data pengguna dari localStorage ('currentUser'):", e);
        setLoggedInUser({ username: "Error Parse", name: "Error Parse", nip: "Error", role: "Error" });
      }
    } else {
      console.warn("Tidak ada data pengguna yang login (key 'currentUser' tidak ditemukan di localStorage).");
      setLoggedInUser({ username: "Belum Login", name: "Belum Login", nip: "N/A", role: "Guest" });
    }
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const API_URL = "http://localhost:5000/api/users";

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let dataToSet = generateDummyUsers(3); 
      if (API_URL) { 
          const response = await fetch(API_URL);
          if (response.ok) {
            dataToSet = await response.json();
          } else {
            console.warn(`HTTP error! Status: ${response.status}. Falling back to dummy data.`);
          }
      } else {
          console.warn("API_URL is not set. Using dummy data.");
      }
      setUsers(dataToSet);
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
      setError("Gagal memuat data pengguna. Menampilkan data contoh.");
      setUsers(generateDummyUsers(3));
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      nip: user.nip,
      username: user.username,
      password: "", 
    });
    setError(null); 
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      nip: "",
      username: "",
      password: "",
    });
    setError(null); 
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.nip.trim() || !formData.username.trim()) {
        setError("Nama, NIP, dan Username wajib diisi.");
        return;
    }
    if (!selectedUser && !formData.password.trim()) {
        setError("Password wajib diisi untuk pengguna baru.");
        return;
    }
    setError(null); 

    try {
      let response;
      const payload = { ...formData };

      if (selectedUser) {
        if (formData.password === "") {
          delete payload.password; 
        }
        response = await fetch(`${API_URL}/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        setError(errorData.message || `Gagal menyimpan data. Status: ${response.status}`);
        return; 
      }

      fetchUsers();
      closeModal(); 
    } catch (err) {
      console.error("❌ Failed to save data:", err);
      if (!error && !(err.message.includes("Gagal menyimpan data"))) { 
        setError(`Gagal menyimpan data: ${err.message}`);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
          throw new Error(errorData.message || `Gagal menghapus pengguna. Status: ${response.status}`);
        }
        fetchUsers();
      } catch (err) {
        console.error("❌ Failed to delete user:", err);
        setError(`Gagal menghapus pengguna: ${err.message}`);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({ name: "", nip: "", username: "", password: "" });
    setError(null); 
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`content-container ${isSidebarOpen ? "sidebar-open-active" : "sidebar-closed-active"}`}>
        <div className="dashboard-header">
          <div className="header-left-section">
            <img src={LogoBps} alt="Logo BPS" className="app-logo" />
            <div className="app-info">
              <h1 className="app-title">AKU</h1>
              <h2 className="app-subtitle">Aplikasi Buku Tamu</h2>
            </div>
          </div>
          <div className="user-badge">
            <div className="user-avatar">
              <span>{loggedInUser.name ? loggedInUser.name.substring(0, 2).toUpperCase() : (loggedInUser.username ? loggedInUser.username.substring(0,2).toUpperCase() : "??")}</span>
            </div>
            <div className="user-details">
              <span className="user-role">{loggedInUser.name || loggedInUser.username}</span> 
              {/* PERBAIKAN: Menampilkan NIP */}
              <span className="user-nip">{loggedInUser.nip ? `NIP: ${loggedInUser.nip}` : "NIP: -"}</span>
            </div>
          </div>
        </div>

        {error && !showModal && <div className="error-message">{error}</div>}

        <div className="content-card">
          <div className="card-header">
            <h3 className="section-title">Kelola User</h3>
            <button className="add-button" onClick={handleAddNew}>
              <span className="add-icon">+</span> Add User
            </button>
          </div>

          <div className="table-container">
            {isLoading ? (
              <div className="loading-message">Loading users...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Employee Name</th>
                    <th>NIP</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.nip}</td>
                        <td>{user.username}</td>
                        <td>{"********"}</td>
                        <td className="action-buttons">
                          <button className="edit-button" onClick={() => handleEdit(user)}>
                            Edit
                          </button>
                          <button className="delete-button" onClick={() => handleDelete(user.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-table">
                        No user data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedUser ? "Edit User" : "Add New User"}</h3>
                <button className="close-button" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ margin: "0 0 16px 0" }}>{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Employee Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nip">NIP</label>
                  <input
                    type="text"
                    id="nip"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!selectedUser}
                    placeholder={selectedUser ? "Leave blank to keep current" : ""}
                  />
                  {selectedUser && (
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                      Leave blank to keep current password.
                    </small>
                  )}
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    {selectedUser ? "Update User" : "Save User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

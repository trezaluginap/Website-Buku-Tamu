// src/pages/UserManagement.js
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar"; // Mengimpor komponen Sidebar
import "../styles/userManagement.css"; // CSS utama Anda
import "../styles/sidebar.css"; // CSS untuk Sidebar itu sendiri
import LogoBps from "../assets/BPS.png"; // Logo sudah diimpor dengan benar

// const API_URL = "http://localhost:5000/api/users"; // Pastikan URL API Anda benar
// Untuk pengujian tanpa backend, Anda bisa menggunakan data dummy:
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default sidebar bisa true jika ingin terbuka awalnya

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Gunakan URL API Anda jika backend sudah siap
  const API_URL = "http://localhost:5000/api/users";

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        // Jika fetch gagal, coba tampilkan data dummy untuk pengembangan
        console.warn(`HTTP error! Status: ${response.status}. Falling back to dummy data.`);
        setUsers(generateDummyUsers(5)); // Tampilkan 5 user dummy
        // throw new Error(`HTTP error! Status: ${response.status}`); // Komentari ini jika ingin fallback ke dummy
        return; // Hentikan eksekusi jika fallback ke dummy
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
      setError("Failed to load user data. Displaying dummy data instead.");
      setUsers(generateDummyUsers(5)); // Tampilkan data dummy jika ada error fetch
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
      password: "", // Jangan pre-fill password
    });
    setError(null); // Bersihkan error sebelumnya saat membuka modal
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
    setError(null); // Bersihkan error sebelumnya saat membuka modal
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Hapus setError(null) di awal agar error dari validasi tetap tampil
    // setError(null); 

    // Validasi sederhana di frontend
    if (!formData.name.trim() || !formData.nip.trim() || !formData.username.trim()) {
        setError("Name, NIP, and Username are required.");
        return;
    }
    if (!selectedUser && !formData.password.trim()) { // Password wajib hanya untuk user baru
        setError("Password is required for new users.");
        return;
    }


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
        // Set error agar tampil di modal
        setError(errorData.message || `Failed to save data. Status: ${response.status}`);
        throw new Error(errorData.message || `Failed to save data. Status: ${response.status}`);
      }

      fetchUsers();
      closeModal(); 
    } catch (err) {
      console.error("❌ Failed to save data:", err);
      // Error sudah di-set di atas jika dari response.json(), 
      // jadi tidak perlu setError lagi di sini kecuali untuk error network murni.
      if (!error) { // Hanya set error jika belum ada error dari response
        setError(`Failed to save data: ${err.message}`);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
          throw new Error(errorData.message || `Failed to delete user. Status: ${response.status}`);
        }
        fetchUsers();
      } catch (err) {
        console.error("❌ Failed to delete user:", err);
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({ name: "", nip: "", username: "", password: "" });
    setError(null); // Bersihkan error saat modal ditutup
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`content-container ${isSidebarOpen ? "sidebar-open-active" : "sidebar-closed-active"}`}>
        <div className="dashboard-header">
          <div className="header-left-section">
            <img src={LogoBps} alt="Logo BPS" className="app-logo" /> {/* Menggunakan LogoBps */}
            <div className="app-info">
              <h1 className="app-title">AKU</h1>
              <h2 className="app-subtitle">Aplikasi Buku Tamu</h2>
            </div>
          </div>
          <div className="user-badge">
            <div className="user-avatar">
        
            </div>
            <div className="user-details">
              <span className="user-role">Faisal</span> {/* Ganti dengan role user */}
              <span className="user-nip">NIP: 12345678</span> {/* Ganti dengan NIP user */}
            </div>
          </div>
        </div>

        {/* Error message global (untuk fetch, delete) ditampilkan di luar card */}
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
                {/* Error message spesifik form ditampilkan di dalam modal */}
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

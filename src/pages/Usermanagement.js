// src/pages/UserManagement.js
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar"; // Mengimpor komponen Sidebar
import "../styles/userManagement.css"; // CSS utama Anda
import "../styles/sidebar.css"; // CSS untuk Sidebar itu sendiri

const API_URL = "http://localhost:5000/api/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    username: "",
    password: "", // Password for new user or to be set if editing
  });
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to fetch user data from API
  const fetchUsers = async () => {
    setIsLoading(true); // Set loading true before fetch
    setError(null); // Clear previous errors
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading false after fetch (success or error)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      nip: user.nip,
      username: user.username,
      password: "", // Jangan pre-fill password untuk keamanan
    });
    setShowModal(true);
  };

  // Handle Add New button click
  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      nip: "",
      username: "",
      password: "",
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      let response;
      if (selectedUser) {
        // Update user
        const updateData = { ...formData };
        if (formData.password === "") {
          // If password field is empty, remove it from update data
          // so it's not sent to the backend and password remains unchanged
          delete updateData.password;
        }

        response = await fetch(`${API_URL}/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      } else {
        // Add new user
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      fetchUsers(); // Refresh data
      setShowModal(false); // Close modal
    } catch (err) {
      console.error("❌ Failed to save data:", err);
      setError(`Failed to save data: ${err.message}`);
    }
  };

  // Handle Delete User
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        fetchUsers(); // Refresh data
      } catch (err) {
        console.error("❌ Failed to delete user:", err);
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null); // Clear selected user when closing modal
    setFormData({ name: "", nip: "", username: "", password: "" }); // Reset form data
    setError(null); // Clear errors when closing modal
  };

  return (
    // Wrapper utama yang menggunakan Flexbox untuk menata Sidebar dan konten utama
    // Background-color body dari userManagement.css akan terlihat di sini.
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Komponen Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Konten utama halaman. Kelas akan berubah berdasarkan isSidebarOpen. */}
      <div className={`content-container ${isSidebarOpen ? "sidebar-open-active" : "sidebar-closed-active"}`}>
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="app-info">
            <h1 className="app-title">AKU</h1>
            <h2 className="app-subtitle">Aplikasi Buku Tamu</h2>
          </div>
          <div className="user-badge">
            <div className="user-avatar">
              <span>SA</span>
            </div>
            <div className="user-details">
              <span className="user-role">Faisal</span>
              <span className="user-nip">NIP: 12345678</span>
            </div>
          </div>
        </div>

        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}

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
                        <td>{"•".repeat(user.password.length)}</td>
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
                        No user data available
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
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
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
                    // For editing, password is optional to change
                    required={!selectedUser} // Required only for new users
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
                    {selectedUser ? "Update" : "Save"}
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
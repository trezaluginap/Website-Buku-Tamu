<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "../styles/userManagement.css";

const API_URL = "http://localhost:5000/api/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
=======
import React, { useState } from "react";
import "../styles/userManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "faisal",
      nip: "12345678",
      username: "bps3272",
      password: "admin",
    },
    {
      id: 2,
      name: "Staff Admin",
      nip: "87654321",
      username: "staff3272",
      password: "staff123",
    },
    {
      id: 3,
      name: "Manager",
      nip: "98765432",
      username: "manager3272",
      password: "manager123",
    },
  ]);

>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    username: "",
    password: "",
  });

<<<<<<< HEAD
  // Ambil data users dari API
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Gagal memuat data user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Klik Edit
=======
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      nip: user.nip,
      username: user.username,
      password: user.password,
    });
    setShowModal(true);
  };

<<<<<<< HEAD
  // Klik Tambah
=======
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
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

<<<<<<< HEAD
  // Input Form
=======
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

<<<<<<< HEAD
  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedUser) {
        // Update user
        await fetch(`${API_URL}/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Tambah user baru
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
=======
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
        ...formData,
      };
      setUsers([...users, newUser]);
    }
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e

      fetchUsers(); // Refresh data
      setShowModal(false);
    } catch (error) {
      console.error("❌ Gagal menyimpan data:", error);
    }
  };

<<<<<<< HEAD
  // Hapus User
  const handleDelete = async (userId) => {
=======
  const handleDelete = (userId) => {
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
        fetchUsers();
      } catch (error) {
        console.error("❌ Gagal menghapus pengguna:", error);
      }
    }
  };

<<<<<<< HEAD
  const closeModal = () => setShowModal(false);
=======
  const closeModal = () => {
    setShowModal(false);
  };
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e

  return (
    <div className="content-container">
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

      <div className="content-card">
        <div className="card-header">
          <h3 className="section-title">Kelola User</h3>
          <button className="add-button" onClick={handleAddNew}>
            <span className="add-icon">+</span> Tambah User
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pegawai</th>
                <th>NIP</th>
                <th>Username</th>
                <th>Password</th>
                <th>Aksi</th>
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
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    Tidak ada data pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedUser ? "Edit User" : "Tambah User Baru"}</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nama Pegawai</label>
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
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button type="submit" className="submit-button">
                  {selectedUser ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

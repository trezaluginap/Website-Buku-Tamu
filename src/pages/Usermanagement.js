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
  ]);

  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    username: "",
    password: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update user
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...formData, id: user.id } : user
      );
      setUsers(updatedUsers);
    } else {
      // Tambah user baru
      const newUser = {
        ...formData,
        id: Date.now(),
      };
      setUsers([...users, newUser]);
    }

    // Reset
    setFormData({
      name: "",
      nip: "",
      username: "",
      password: "",
    });
    setIsEditing(false);
    setSelectedUser(null);
    setShowForm(false);
  };

  const handleAddUserClick = () => {
    setFormData({
      name: "",
      nip: "",
      username: "",
      password: "",
    });
    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">AKU</h1>
        <h2 className="page-subtitle">Aplikasi Buku Tamu</h2>
        <div className="user-info">Anda Login Sebagai: Nip:3272</div>
      </div>

      <div className="content-area">
        <div className="section-title">Kelola User</div>

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
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.nip}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Tombol Tambah User */}
        <div className="button-container">
          <button className="add-button" onClick={handleAddUserClick}>
            Tambah User
          </button>
        </div>

        {/* Form Tambah / Edit */}
        {showForm && (
          <div className="form-container">
            <h3>{isEditing ? "Edit User" : "Tambah User Baru"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="nip"
                placeholder="NIP"
                value={formData.nip}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="save-button">
                Simpan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

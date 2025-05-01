// src/pages/UserManagement.js
import React, { useState } from "react";
import "../styles/userManagement.css";

const UserManagement = () => {
  // Sample user data - in a real application, this would come from an API or database
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "superadmin",
      nip: "12345678",
      username: "bps3272",
      password: "admin",
    },
  ]);

  // State for the currently selected user (for editing)
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to handle the edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    // In a real app, you might open a modal or form here
    console.log("Editing user:", user);
  };

  // Function to handle the delete button click
  const handleDelete = (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
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

        {/* Add User Button - Could expand to show a form */}
        <div className="button-container">
          <button className="add-button">Tambah User</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

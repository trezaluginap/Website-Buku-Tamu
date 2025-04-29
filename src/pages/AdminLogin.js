import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login berhasil!");
        navigate("/admin");
      } else {
        alert(data.error || "Email atau password salah!");
      }
    } catch (error) {
      console.error("Gagal login:", error);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles.css";
import logoBPS from '../assets/BPS.png' 

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Username dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setErrorMsg(data.error || "Username atau password salah!");
      }
    } catch (error) {
      console.error("Gagal login:", error);
      setErrorMsg("Tidak dapat terhubung ke server. Pastikan backend aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Tambahkan elemen img untuk logo di sini */}
     <img
  src={logoBPS}
  alt="Logo BPS"
  className="login-logo"
/>

      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
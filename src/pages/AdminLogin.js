import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles.css";

const AdminLogin = () => {
<<<<<<< HEAD
  const [username, setUsername] = useState("");
=======
  const [namaPengguna, setNamaPengguna] = useState("");
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

<<<<<<< HEAD
    if (!username || !password) {
      setErrorMsg("Username dan password wajib diisi!");
=======
    if (!namaPengguna || !password) {
      setErrorMsg("Nama pengguna dan password wajib diisi!");
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
      return;
    }

    setIsLoading(true);

    try {
      // Panggil API untuk login dengan data dari kelola user
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        body: JSON.stringify({ username, password }),
=======
        body: JSON.stringify({ nama_pengguna: namaPengguna, password }),
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
      });

      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
<<<<<<< HEAD
        // Simpan data user yang login ke localStorage jika diperlukan
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setErrorMsg(data.error || "Username atau password salah!");
=======
        // Redirect ke halaman admin
        navigate("/admin");
      } else {
        setErrorMsg(data.error || "Nama pengguna atau password salah!");
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
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
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
<<<<<<< HEAD
          <label>Username:</label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
=======
          <label>Nama Pengguna:</label>
          <input
            type="text"
            placeholder="Masukkan nama pengguna"
            value={namaPengguna}
            onChange={(e) => setNamaPengguna(e.target.value)}
>>>>>>> f74ae546af1f493659d29907adc263cf5906835e
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

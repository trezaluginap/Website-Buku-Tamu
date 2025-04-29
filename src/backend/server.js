const express = require('express');
const cors = require('cors');
const app = express();
const guestRoutes = require('./routes/guestRoutes');
const db = require('./config/db'); // koneksi database
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/guests', guestRoutes);

// Endpoint Admin Login
app.post('/api/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  const checkAdminSql = "SELECT * FROM admins WHERE email = ? AND password = ?";
  db.query(checkAdminSql, [email, password], (err, results) => {
    if (err) {
      console.error("Error checking admin login:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length > 0) {
      // Admin ditemukan, simpan log login
      const logSql = "INSERT INTO admin_logins (email, login_time) VALUES (?, NOW())";
      db.query(logSql, [email], (logErr) => {
        if (logErr) {
          console.error("Error saving admin login:", logErr);
          return res.status(500).json({ error: "Failed to save login" });
        }
        res.json({ message: "Login successful and login time saved" });
      });
    } else {
      // Admin tidak ditemukan
      res.status(401).json({ error: "Email atau password salah" });
    }
  });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

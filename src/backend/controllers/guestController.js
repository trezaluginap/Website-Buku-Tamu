const db = require('../config/db');

// Ambil semua tamu
exports.getAllGuests = (req, res) => {
  db.query('SELECT * FROM guests', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Tambah tamu baru
exports.createGuest = (req, res) => {
  const { name, email, message } = req.body;
  db.query(
    'INSERT INTO guests (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Guest created successfully', id: results.insertId });
    }
  );
};

// Hapus tamu
exports.deleteGuest = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM guests WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Guest deleted successfully' });
  });
};

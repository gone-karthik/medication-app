const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const db = require('./db');
const { auth, secret } = require('./auth');
const upload = multer({ dest: 'uploads/' });

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, hash, role], function (err) {
      if (err) return res.status(400).json({ msg: 'Username taken' });
      const token = jwt.sign({ id: this.lastID, role }, secret);
      res.json({ token });
    });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username=?`, [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, secret);
    res.json({ token });
  });
});

// Add medication
router.post('/medications', auth, upload.single('photo'), (req, res) => {
  const { name, dosage, frequency } = req.body;
  const photo = req.file?.filename || null;
  db.run(`INSERT INTO medications (user_id, name, dosage, frequency, taken_dates, proof_photo)
          VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, name, dosage, frequency, JSON.stringify([]), photo],
    function (err) {
      if (err) return res.status(500).json({ msg: err.message });
      res.json({ id: this.lastID });
    });
});

// View medications
router.get('/medications', auth, (req, res) => {
  db.all(`SELECT * FROM medications WHERE user_id=?`, [req.user.id], (err, meds) => {
    if (err) return res.status(500).json({ msg: err.message });
    meds.forEach(m => m.taken_dates = JSON.parse(m.taken_dates));
    res.json(meds);
  });
});

// Mark medication as taken
router.put('/medications/:id/take', auth, (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  db.get(`SELECT taken_dates FROM medications WHERE id=? AND user_id=?`, [req.params.id, req.user.id], (err, row) => {
    if (!row) return res.status(404).json({ msg: 'Medication not found' });
    const dates = JSON.parse(row.taken_dates);
    if (!dates.includes(today)) {
      dates.push(today);
      db.run(`UPDATE medications SET taken_dates=? WHERE id=?`, [JSON.stringify(dates), req.params.id], (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.json({ taken_dates: dates });
      });
    } else {
      res.json({ taken_dates: dates });
    }
  });
});

module.exports = router;

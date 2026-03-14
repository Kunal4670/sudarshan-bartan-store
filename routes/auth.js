const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ownerUsername = process.env.OWNER_USERNAME;
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (username === ownerUsername && password === ownerPassword) {
    req.session.isOwner = true;
    req.session.username = username;
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// Check session
router.get('/me', (req, res) => {
  if (req.session.isOwner) {
    return res.json({ isOwner: true, username: req.session.username });
  }
  res.json({ isOwner: false });
});

module.exports = router;

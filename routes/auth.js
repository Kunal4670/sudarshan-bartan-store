const express = require('express');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const ownerUsername = (process.env.OWNER_USERNAME || 'admin').trim();
    const ownerPassword = (process.env.OWNER_PASSWORD || 'casa123').trim();

    const enteredUser = (username || '').trim();
    const enteredPass = (password || '').trim();

    if (enteredUser === ownerUsername && enteredPass === ownerPassword) {
      req.session.isOwner = true;
      req.session.username = enteredUser;
      return res.json({ success: true, message: 'Login successful' });
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// Check session
router.get('/me', (req, res) => {
  if (req.session && req.session.isOwner) {
    return res.json({ isOwner: true, username: req.session.username });
  }
  res.json({ isOwner: false });
});

module.exports = router;

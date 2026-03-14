const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

function ownerOnly(req, res, next) {
  if (req.session && req.session.isOwner) return next();
  return res.status(403).json({ success: false, message: 'Access denied. Owner only.' });
}

// POST submit enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const enquiry = new Enquiry({ name, email, phone, message });
    await enquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET all enquiries (owner only)
router.get('/', ownerOnly, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH mark as read (owner only)
router.patch('/:id/read', ownerOnly, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE enquiry (owner only)
router.delete('/:id', ownerOnly, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET unread count (owner only)
router.get('/unread/count', ownerOnly, async (req, res) => {
  try {
    const count = await Enquiry.countDocuments({ read: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

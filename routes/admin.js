const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

// GET /api/admin/ping - Health check
router.get('/ping', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/events - List all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/organizers/:email/approve
router.post('/organizers/:email/approve', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: { role: 'ORGANIZER', isApproved: true } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/v4/users/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      // Auto-provision user record if first time connecting via Firebase
      user = await User.create({
        name: req.user.name || 'User',
        username: (req.user.email ? req.user.email.split('@')[0] : 'user') + '_' + Math.random().toString(36).substring(2, 5),
        email: req.user.email || `user_${Date.now()}@example.com`,
        role: req.user.role || 'USER',
        provider: 'FIREBASE',
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/v4/users/me - Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, avatarUrl, phone } = req.body;
    let user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { ...(name && { name }), ...(avatarUrl && { avatarUrl }), ...(phone && { phone }) } },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/v4/users/upgrade-user - Upgrade to organizer
router.post('/upgrade-user', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { role: 'ORGANIZER' } },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/v4/users/:username - Get public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

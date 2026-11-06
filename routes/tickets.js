const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// POST /api/v1/ticket - Generate ticket
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const eventId = req.body.eventId;

    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }

    const ticket = await Ticket.create({
      userId,
      eventId,
      ticketTypeId: req.body.ticketTypeId || null,
    });

    // Increment tickets sold on event
    await Event.findByIdAndUpdate(eventId, { $inc: { ticketsSold: 1 } });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/v1/tickets/me - Get current user's tickets
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });
    res.json({ data: tickets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

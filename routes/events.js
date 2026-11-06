const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const TicketType = require('../models/TicketType');
const auth = require('../middleware/auth');

// GET /api/v1/events - List events with optional search, category, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, date, page = 0, size = 20 } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { venue: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (date) {
      query.startTime = { $regex: date, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 0;
    const limitNum = parseInt(size, 10) || 20;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(pageNum * limitNum)
      .limit(limitNum);

    // Return in envelope expected by Flutter ApiResponseParser
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/v1/events/:id - Get event details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/v1/events - Create new event
router.post('/', auth, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user ? req.user.id : '',
      organizerEmail: req.user ? req.user.email : '',
    };
    const event = await Event.create(eventData);

    // Automatically create a default general ticket type if totalCapacity is provided
    if (event.totalCapacity > 0) {
      await TicketType.create({
        eventId: event._id,
        name: 'General Admission',
        price: 0,
        totalSeats: event.totalCapacity,
      });
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/v1/events/:id/ticket-types - List ticket types for an event
router.get('/:id/ticket-types', async (req, res) => {
  try {
    const ticketTypes = await TicketType.find({ eventId: req.params.id });
    res.json({ data: ticketTypes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/v1/events/:id/ticket-types - Create ticket type
router.post('/:id/ticket-types', auth, async (req, res) => {
  try {
    const ticketType = await TicketType.create({
      ...req.body,
      eventId: req.params.id,
    });
    res.status(201).json(ticketType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/v1/events/:id/ticket-types/availability - Check available seats
router.get('/:id/ticket-types/availability', async (req, res) => {
  try {
    const ticketTypes = await TicketType.find({ eventId: req.params.id });
    const availability = ticketTypes.map((tt) => ({
      ticketTypeId: tt._id.toString(),
      name: tt.name,
      availableSeats: Math.max(0, tt.totalSeats - (tt.sold || 0)),
    }));
    res.json({ data: availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

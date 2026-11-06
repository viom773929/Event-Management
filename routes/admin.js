const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const TicketType = require('../models/TicketType');

// GET /api/admin/ping - Health check
router.get('/ping', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// POST or GET /api/admin/seed - Seed sample events & ticket types
router.all('/seed', async (req, res) => {
  try {
    const sampleEvents = [
      {
        name: 'Global Tech & AI Summit 2026',
        venue: 'Convention Center, Main Auditorium',
        location: 'San Francisco, CA',
        description: 'Discover the future of Artificial Intelligence, Cloud Infrastructure, and Agentic Software. Join industry leaders, keynote speakers, and hands-on workshops.',
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: 'Technology',
        startTime: '2026-11-20T09:00:00Z',
        endTime: '2026-11-20T18:00:00Z',
        totalCapacity: 500,
        ticketsSold: 120,
        status: 'PUBLISHED',
        ticketTypes: [
          { name: 'Early Bird', price: 49, totalSeats: 150, sold: 120 },
          { name: 'General Admission', price: 99, totalSeats: 250, sold: 0 },
          { name: 'VIP Access', price: 249, totalSeats: 100, sold: 0 },
        ],
      },
      {
        name: 'Neon Horizon Music Festival',
        venue: 'Sunset Park Amphitheater',
        location: 'Austin, TX',
        description: 'An immersive outdoor electronic and indie music festival featuring top international artists, stunning laser visual shows, and food trucks.',
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        category: 'Music',
        startTime: '2026-11-25T16:00:00Z',
        endTime: '2026-11-25T23:30:00Z',
        totalCapacity: 1200,
        ticketsSold: 450,
        status: 'PUBLISHED',
        ticketTypes: [
          { name: 'General Pass', price: 75, totalSeats: 800, sold: 400 },
          { name: 'VIP Lounge', price: 180, totalSeats: 400, sold: 50 },
        ],
      },
      {
        name: 'DesignCraft UI/UX Conference',
        venue: 'Metropolitan Design Hall',
        location: 'New York, NY',
        description: 'Elevate your product design skills with deep-dive sessions on Design Systems, Generative UI, Micro-interactions, and UX research.',
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        category: 'Design',
        startTime: '2026-12-05T10:00:00Z',
        endTime: '2026-12-05T17:00:00Z',
        totalCapacity: 350,
        ticketsSold: 85,
        status: 'PUBLISHED',
        ticketTypes: [
          { name: 'Student Pass', price: 35, totalSeats: 100, sold: 40 },
          { name: 'Professional', price: 120, totalSeats: 200, sold: 45 },
          { name: 'Workshop + Conference', price: 210, totalSeats: 50, sold: 0 },
        ],
      },
      {
        name: 'Startup Pitch & Founders Mixer',
        venue: 'Innovation Hub, 4th Floor',
        location: 'Seattle, WA',
        description: 'Connect with angel investors, VC firms, and fellow founders. 10 selected startups will pitch live on stage followed by networking drinks.',
        bannerUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
        category: 'Business',
        startTime: '2026-12-12T18:00:00Z',
        endTime: '2026-12-12T21:30:00Z',
        totalCapacity: 200,
        ticketsSold: 60,
        status: 'PUBLISHED',
        ticketTypes: [
          { name: 'Attendee', price: 0, totalSeats: 150, sold: 50 },
          { name: 'Pitching Founder', price: 50, totalSeats: 50, sold: 10 },
        ],
      },
      {
        name: 'International Gastronomy Food Fair',
        venue: 'Bayfront Promenade',
        location: 'San Diego, CA',
        description: 'Savor culinary masterpieces from over 40 renowned international chefs, artisanal food stalls, craft beverage tastings, and cooking masterclasses.',
        bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        category: 'Food & Drink',
        startTime: '2026-12-18T11:00:00Z',
        endTime: '2026-12-18T20:00:00Z',
        totalCapacity: 800,
        ticketsSold: 210,
        status: 'PUBLISHED',
        ticketTypes: [
          { name: 'Tasting Entry Pass', price: 25, totalSeats: 600, sold: 180 },
          { name: 'All-Inclusive Foodie Pass', price: 85, totalSeats: 200, sold: 30 },
        ],
      },
    ];

    const createdEvents = [];

    for (const item of sampleEvents) {
      const { ticketTypes, ...eventPayload } = item;

      let event = await Event.findOne({ name: eventPayload.name });
      if (!event) {
        event = await Event.create(eventPayload);
      } else {
        Object.assign(event, eventPayload);
        await event.save();
      }

      for (const tt of ticketTypes) {
        const existingTT = await TicketType.findOne({ eventId: event._id, name: tt.name });
        if (!existingTT) {
          await TicketType.create({
            eventId: event._id,
            name: tt.name,
            price: tt.price,
            totalSeats: tt.totalSeats,
            sold: tt.sold || 0,
          });
        }
      }

      createdEvents.push(event);
    }

    res.json({
      message: 'Database seeded successfully!',
      count: createdEvents.length,
      events: createdEvents.map((e) => ({ id: e._id, name: e.name, category: e.category })),
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', message: err.message });
  }
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

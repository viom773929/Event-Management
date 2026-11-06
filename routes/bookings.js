const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const TicketType = require('../models/TicketType');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// POST /api/v1/booking - Initiate booking
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!eventId || !ticketTypeId) {
      return res.status(400).json({ message: 'eventId and ticketTypeId are required' });
    }

    const ticketType = await TicketType.findById(ticketTypeId);
    const pricePerTicket = ticketType ? ticketType.price : 0;
    const totalAmount = pricePerTicket * quantity;

    // Create booking record
    const booking = await Booking.create({
      userId,
      eventId,
      ticketTypeId,
      quantity,
      totalAmount,
      orderStatus: 'CONFIRMED',
      razorpayOrderId: 'RPAY_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    });

    // Automatically generate ticket records for confirmed bookings
    for (let i = 0; i < quantity; i++) {
      await Ticket.create({
        userId,
        eventId,
        ticketTypeId,
      });
    }

    // Increment tickets sold
    if (ticketType) {
      await TicketType.findByIdAndUpdate(ticketTypeId, { $inc: { sold: quantity } });
    }
    await Event.findByIdAndUpdate(eventId, { $inc: { ticketsSold: quantity } });

    res.status(201).json({
      orderId: booking.orderId,
      razorpayOrderId: booking.razorpayOrderId,
      totalAmount: booking.totalAmount,
      razorpayKeyId: booking.razorpayKeyId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/v1/booking/:orderId/status - Check order status
router.get('/:orderId/status', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ orderId: req.params.orderId });
    if (!booking) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      userId: booking.userId,
      orderStatus: booking.orderStatus,
      totalAmount: booking.totalAmount,
      size: booking.quantity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

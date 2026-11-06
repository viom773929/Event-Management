const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    ticketTypeId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'],
      default: 'CONFIRMED', // Set to CONFIRMED for demo/free bookings or mock payments
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayKeyId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.size = ret.quantity;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

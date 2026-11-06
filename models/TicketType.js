const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 50,
    },
    sold: {
      type: Number,
      default: 0,
    },
    saleStart: {
      type: String,
      default: null,
    },
    saleEnd: {
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
        ret.eventId = ret.eventId ? ret.eventId.toString() : null;
        ret.availableSeats = Math.max(0, ret.totalSeats - (ret.sold || 0));
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

TicketTypeSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.totalSeats - (this.sold || 0));
});

module.exports = mongoose.models.TicketType || mongoose.model('TicketType', TicketTypeSchema);

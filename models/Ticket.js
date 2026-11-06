const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
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
      default: null,
    },
    ticketCode: {
      type: String,
      unique: true,
      required: true,
      default: () => 'TCK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    },
    status: {
      type: String,
      enum: ['VALID', 'USED', 'CANCELLED'],
      default: 'VALID',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    longitude: {
      type: String,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    startTime: {
      type: String,
      default: null,
    },
    endTime: {
      type: String,
      default: null,
    },
    ticketsSold: {
      type: Number,
      default: 0,
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      default: 100,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'CANCELLED', 'COMPLETED'],
      default: 'PUBLISHED',
    },
    category: {
      type: String,
      default: 'General',
    },
    organizerId: {
      type: String,
      default: '',
    },
    organizerEmail: {
      type: String,
      default: '',
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

// Index for search & category queries
EventSchema.index({ name: 'text', description: 'text', location: 'text' });
EventSchema.index({ category: 1, status: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
      index: true,
    },
    attendeeName: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
      maxlength: [120, 'Attendee name cannot exceed 120 characters'],
    },
    attendeeEmail: {
      type: String,
      required: [true, 'Attendee email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'At least 1 seat must be booked'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

bookingSchema.index({ event: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

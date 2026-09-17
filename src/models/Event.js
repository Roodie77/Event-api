const mongoose = require('mongoose');

const CATEGORIES = ['Tech', 'Music', 'Business', 'Sports', 'Arts'];
const STATUSES = ['upcoming', 'cancelled'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    seatsBooked: {
      type: Number,
      default: 0,
      min: [0, 'seatsBooked cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: `Status must be one of: ${STATUSES.join(', ')}`,
      },
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.virtual('seatsRemaining').get(function seatsRemaining() {
  return Math.max(0, this.capacity - this.seatsBooked);
});

eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ city: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1, date: 1 });

eventSchema.pre('validate', function futureDateOnCreate(next) {
  if (this.isNew && this.date && this.date <= new Date()) {
    this.invalidate('date', 'Event date must be in the future');
  }
  next();
});

eventSchema.pre('save', function capacityGuard(next) {
  if (this.seatsBooked > this.capacity) {
    next(new Error('seatsBooked cannot exceed capacity'));
    return;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.STATUSES = STATUSES;

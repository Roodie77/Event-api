const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

function paginateMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit) || 0;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.listEvents = async (req, res, next) => {
  try {
    const { page, limit, sort, search, city, category, from, to, status } = req.query;

    const filter = {};

    if (city) {
      filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
    }
    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    let query = Event.find(filter);

    if (search) {
      query = Event.find({
        ...filter,
        $text: { $search: search },
      });
    }

    const sortSpec = parseSort(sort);
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      query.sort(sortSpec).skip(skip).limit(limit),
      Event.countDocuments(search ? { ...filter, $text: { $search: search } } : filter),
    ]);

    return res.status(200).json({
      success: true,
      meta: paginateMeta(page, limit, total),
      data: events,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.body.capacity !== undefined && req.body.capacity < event.seatsBooked) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be less than already booked seats (${event.seatsBooked})`,
      });
    }

    Object.assign(event, req.body);
    await event.save();

    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Booking.deleteMany({ event: event._id });
    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Event and related bookings deleted',
    });
  } catch (err) {
    return next(err);
  }
};

exports.bookEvent = async (req, res, next) => {
  try {
    const { attendeeName, attendeeEmail, seats } = req.body;
    const { id } = req.params;
    const now = new Date();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const existing = await Event.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (existing.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Event is cancelled' });
    }
    if (existing.date <= now) {
      return res.status(400).json({ success: false, message: 'Event is already past' });
    }

    // Atomic conditional increment — two concurrent last-seat bookings cannot both succeed
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: id,
        status: 'upcoming',
        date: { $gt: now },
        $expr: {
          $lte: [{ $add: ['$seatsBooked', seats] }, '$capacity'],
        },
      },
      { $inc: { seatsBooked: seats } },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(409).json({
        success: false,
        message: 'Not enough seats remaining',
        seatsRemaining: existing.seatsRemaining,
      });
    }

    const booking = await Booking.create({
      event: updatedEvent._id,
      attendeeName,
      attendeeEmail,
      seats,
    });

    return res.status(201).json({
      success: true,
      data: {
        booking,
        event: {
          id: updatedEvent._id,
          title: updatedEvent.title,
          seatsBooked: updatedEvent.seatsBooked,
          seatsRemaining: updatedEvent.seatsRemaining,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find({ event: event._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments({ event: event._id }),
    ]);

    return res.status(200).json({
      success: true,
      meta: paginateMeta(page, limit, total),
      data: bookings,
    });
  } catch (err) {
    return next(err);
  }
};

function parseSort(sort) {
  if (!sort) return { date: 1 };
  if (sort.startsWith('-')) {
    return { [sort.slice(1)]: -1 };
  }
  return { [sort]: 1 };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

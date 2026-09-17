const Joi = require('joi');
const { CATEGORIES, STATUSES } = require('../models/Event');

const objectId = Joi.string().hex().length(24).messages({
  'string.hex': 'Invalid ID format',
  'string.length': 'Invalid ID format',
});

const createEventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().allow('').max(5000).optional(),
  category: Joi.string()
    .valid(...CATEGORIES)
    .required(),
  city: Joi.string().trim().min(1).required(),
  venue: Joi.string().trim().min(1).required(),
  date: Joi.date().iso().greater('now').required().messages({
    'date.greater': 'Event date must be in the future',
  }),
  price: Joi.number().min(0).required(),
  capacity: Joi.number().integer().min(1).required(),
  status: Joi.string()
    .valid(...STATUSES)
    .optional(),
});

const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().allow('').max(5000),
  category: Joi.string().valid(...CATEGORIES),
  city: Joi.string().trim().min(1),
  venue: Joi.string().trim().min(1),
  date: Joi.date().iso(),
  price: Joi.number().min(0),
  capacity: Joi.number().integer().min(1),
  status: Joi.string().valid(...STATUSES),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update',
  });

const listEventsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string()
    .valid('date', '-date', 'price', '-price', 'title', '-title', 'createdAt', '-createdAt')
    .default('date'),
  search: Joi.string().trim().allow(''),
  city: Joi.string().trim(),
  category: Joi.string().valid(...CATEGORIES),
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref('from')),
  status: Joi.string().valid(...STATUSES),
});

const bookingSchema = Joi.object({
  attendeeName: Joi.string().trim().min(1).max(120).required(),
  attendeeEmail: Joi.string().trim().email().required(),
  seats: Joi.number().integer().min(1).required(),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  listEventsQuerySchema,
  bookingSchema,
  paginationQuerySchema,
  idParamSchema,
};

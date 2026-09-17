const express = require('express');
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const {
  createEventSchema,
  updateEventSchema,
  listEventsQuerySchema,
  bookingSchema,
  paginationQuerySchema,
  idParamSchema,
} = require('../validators/eventValidators');

const router = express.Router();

router.post('/', validate(createEventSchema), eventController.createEvent);
router.get('/', validate(listEventsQuerySchema, 'query'), eventController.listEvents);

router.get(
  '/:id/bookings',
  validate(idParamSchema, 'params'),
  validate(paginationQuerySchema, 'query'),
  eventController.listBookings
);
router.post(
  '/:id/book',
  validate(idParamSchema, 'params'),
  validate(bookingSchema),
  eventController.bookEvent
);

router.get('/:id', validate(idParamSchema, 'params'), eventController.getEvent);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateEventSchema),
  eventController.updateEvent
);
router.delete('/:id', validate(idParamSchema, 'params'), eventController.deleteEvent);

module.exports = router;

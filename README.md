# Event API

A JavaScript Express + MongoDB backend for managing local events and customer bookings.

Organizers can create and manage events, while customers can search events, check availability, and reserve seats. The booking flow enforces capacity limits atomically so the last seat cannot be double-booked.

Built for the BeTechified Programme by Group 3 Backend Development.

## Project structure

```text
events-api/
├── .gitignore
├── .env.example
├── package.json
├── render.yaml
├── README.md
├── src/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── eventController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Booking.js
│   │   └── Event.js
│   ├── routes/
│   │   └── events.js
│   └── validators/
│       └── eventValidators.js
├── tests/
└── setup.sh
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account or a local MongoDB instance

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/events-api?retryWrites=true&w=majority
```

3. Start the server:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

## API base URL

```text
http://localhost:3000
```

## Endpoints

### Health

- `GET /health`

### Events

- `POST /api/events` — create an event
- `GET /api/events` — list events with pagination, filters, sort, and search
- `GET /api/events/:id` — get a single event
- `PUT /api/events/:id` — update an event
- `DELETE /api/events/:id` — delete an event and its related bookings

### Bookings

- `POST /api/events/:id/book` — reserve seats
- `GET /api/events/:id/bookings` — list bookings for an event

## Example request bodies

### Create event

```json
{
  "title": "Tech Meetup",
  "description": "AI and backend event",
  "category": "Tech",
  "city": "Nairobi",
  "venue": "KICC",
  "date": "2026-12-15T18:00:00.000Z",
  "price": 1500,
  "capacity": 100
}
```

### Book seats

```json
{
  "attendeeName": "Jane Doe",
  "attendeeEmail": "jane@example.com",
  "seats": 2
}
```

## Validation rules

- Event category must be one of: `Tech`, `Music`, `Business`, `Sports`, `Arts`
- Event date must be in the future
- Capacity must be at least `1`
- Booking seats must be at least `1`
- Event ID must be a valid MongoDB ObjectId

## Deployment

This project includes a Render deployment config in [render.yaml](render.yaml), which is ready to be connected to a Render web service.

## GitHub push

```bash
git add .
git commit -m "Initial events API commit"
git branch -M main
git remote add origin https://github.com/Roodie77/Event-api.git
git push -u origin main
```

## Notes

- `seatsRemaining` is a virtual field derived from `capacity - seatsBooked`.
- Booking logic uses atomic updates so the last seat cannot be oversold.
- `logger.js` and `errorHandler.js` are included for request logging and error handling.

## Author

Jonathan Adewale


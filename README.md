# Event-api

Node.js + Express + MongoDB (Mongoose) backend for a local events platform.

Organisers can create and manage events. Customers can search events and reserve seats. Capacity is enforced with an atomic conditional update so two people cannot book the last seat at the same time.

Built as a group project for the BeTechified Programme by Group 3 backend Dev.

## Project structure

```text
events-api/
+-- .env.example
+-- .gitignore
+-- package.json
+-- render.yaml
+-- README.md
+-- src/
¦   +-- server.js              # process entry — connect DB, listen
¦   +-- app.js                 # Express app, middleware, routes
¦   +-- seed.js                # optional sample data / server script
¦   +-- config/
¦   ¦   +-- db.js              # Mongoose connection
¦   +-- models/
¦   ¦   +-- Event.js
¦   ¦   +-- Booking.js
¦   +-- controllers/
¦   ¦   +-- eventController.js
¦   +-- routes/
¦   ¦   +-- events.js
¦   +-- middleware/
¦   ¦   +-- validate.js        # Joi wrapper
¦   ¦   +-- logger.js          # request logging
¦   ¦   +-- errorHandler.js
¦   +-- validators/
¦       +-- eventValidators.js
+-- tests/
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas or a local MongoDB instance

## Quick start

```bash
npm install
npm start
```

## Environment variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/events-platform?retryWrites=true&w=majority
```

## API routes

Base URL: `http://localhost:3000`

- `GET /health`
- `POST /api/events`
- `GET /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/book`
- `GET /api/events/:id/bookings`

## Deployment

This project includes a `render.yaml` file for Render deployment.

## GitHub push

```bash
git add .
git commit -m "Initial events API commit"
git branch -M main
git remote add origin https://github.com/Roodie77/Event-api.git
git push -u origin main
```

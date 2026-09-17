require('dotenv').config();

const connectDB = require('./config/db');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

const future = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(19, 0, 0, 0);
  return d;
};

const events = [
  {
    title: 'Lagos Tech Summit 2026',
    description: 'A full-day conference on AI, fintech and startup growth in West Africa.',
    category: 'Tech',
    city: 'Lagos',
    venue: 'Eko Convention Centre',
    date: future(21),
    price: 15000,
    capacity: 200,
  },
  {
    title: 'Afrobeats Live Night',
    description: 'Live performances from emerging and established Afrobeats artists.',
    category: 'Music',
    city: 'Lagos',
    venue: 'Tafawa Balewa Square',
    date: future(35),
    price: 8000,
    capacity: 500,
  },
  {
    title: 'NYC Founders Breakfast',
    description: 'Small-group breakfast for early-stage founders and operators.',
    category: 'Business',
    city: 'New York',
    venue: 'SoHo House',
    date: future(10),
    price: 45,
    capacity: 40,
  },
  {
    title: 'Community 5K Run',
    description: 'Charity run through Central Park with medals for all finishers.',
    category: 'Sports',
    city: 'New York',
    venue: 'Central Park',
    date: future(14),
    price: 25,
    capacity: 300,
  },
  {
    title: 'Contemporary Art Walk',
    description: 'Guided walk through three independent galleries in Brooklyn.',
    category: 'Arts',
    city: 'New York',
    venue: 'Bushwick Galleries',
    date: future(7),
    price: 20,
    capacity: 25,
  },
];

async function seed() {
  await connectDB();
  await Booking.deleteMany({});
  await Event.deleteMany({});
  const created = await Event.insertMany(events);
  console.log(`Seeded ${created.length} events`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const eventRoutes = require('./routes/events');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK' });
});

app.use('/api/events', eventRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

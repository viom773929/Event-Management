const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/db');
const eventsRouter = require('../routes/events');
const ticketsRouter = require('../routes/tickets');
const bookingsRouter = require('../routes/bookings');
const usersRouter = require('../routes/users');
const adminRouter = require('../routes/admin');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error in request middleware:', err.message);
    res.status(500).json({
      error: 'Database connection failed',
      details: err.message,
    });
  }
});

// Mount Routes (matching ApiEndpoints.dart)
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/ticket', ticketsRouter);
app.use('/api/v1/tickets', ticketsRouter);
app.use('/api/v1/booking', bookingsRouter);
app.use('/api/v4/users', usersRouter);
app.use('/api/admin', adminRouter);

// Health check and root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Event Management API',
    database: 'MongoDB Atlas',
    version: '1.0.0',
    documentation: {
      events: '/api/v1/events',
      tickets: '/api/v1/tickets/me',
      bookings: '/api/v1/booking',
      users: '/api/v4/users/me',
      admin: '/api/admin/ping',
    },
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// For local development: listen on PORT if executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;

// server.js - Starter Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const productRoutes = require('./routes/productRoutes');
const loggerMiddleware = require('./middleware/logger');
const authenticateApiKey = require('./middleware/auth');
const { validateProduct } = require('./middleware/validation');
const { AppError, NotFoundError, ValidationError, AuthenticationError, AuthorizationError } = require('./errors/customErrors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // Use express.json() directly instead of body-parser

// Root route (public)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// All other routes require authentication
app.use(authenticateApiKey);


// Logger middleware (after authentication)
app.use(loggerMiddleware);

// Mount product routes (after authentication)
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('ERROR', err);

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
});

// Not found handler
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.url} on this server!`));
});

// Sample in-memory products database
app.locals.products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const productRoutes = require('./routes/productRoutes');
const loggerMiddleware = require('./middleware/logger');
const authenticateApiKey = require('./middleware/auth');
const { validateProduct } = require('./middleware/validation');
const { AppError, NotFoundError, ValidationError, AuthenticationError, AuthorizationError } = require('./errors/customErrors');

// Initialize Express app
const app = express();
const PORT = 4000;  // Using port 4000 instead of 3000

// Middleware setup
app.use(express.json()); // Use express.json() directly instead of body-parser

// Root route (public)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Logger middleware (before authentication)
app.use(loggerMiddleware);

// All API routes require authentication
app.use('/api', authenticateApiKey);

// Mount product routes (after authentication)
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(`ERROR in ${req.method} ${req.path}:`, err);

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
app.all('*', (req, res) => {
  // Check if the request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid API endpoint'
    });
  }
  
  // For non-API routes, show a friendly HTML message
  res.status(404).send('<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>');
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

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
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
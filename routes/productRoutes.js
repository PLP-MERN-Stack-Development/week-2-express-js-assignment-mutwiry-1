// routes/productRoutes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const authenticateApiKey = require('../middleware/auth');
const validateProduct = require('../middleware/validation');
const { AppError, NotFoundError, ValidationError, AuthenticationError, AuthorizationError } = require('../errors/customErrors');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Using the global 'products' array from server.js for simplicity in this example.
// In a real app, you'd pass 'products' or use a database service.
// For this assignment, let's assume server.js makes 'products' available.
// A better way would be to pass `products` array to the router or use `req.app.locals`
// or dependency injection, but let's keep it simpler for now and modify server.js slightly.

// GET /api/products: List all products
router.get('/', asyncHandler(async (req, res, next) => {
  const products = req.app.locals.products;
  res.json(products);
}));

// GET /api/products/:id: Get a specific product by ID
router.get('/:id', asyncHandler(async (req, res, next) => {
  const products = req.app.locals.products;
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.json(product);
}));

// POST /api/products: Create a new product
router.post('/', validateProduct(), asyncHandler(async (req, res, next) => {
  const products = req.app.locals.products;
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    inStock: typeof inStock === 'boolean' ? inStock : true
  };

  products.push(newProduct);
  req.app.locals.products = products;
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id: Update an existing product
router.put('/:id', validateProduct, asyncHandler(async (req, res, next) => {
  const products = req.app.locals.products;
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return next(new NotFoundError('Product not found for update'));
  }

  const { name, description, price, category, inStock } = req.body;
  const updatedProduct = { ...products[productIndex] };

  if (name !== undefined) updatedProduct.name = name;
  if (description !== undefined) updatedProduct.description = description;
  if (price !== undefined) updatedProduct.price = parseFloat(price);
  if (category !== undefined) updatedProduct.category = category;
  if (inStock !== undefined) updatedProduct.inStock = inStock;

  products[productIndex] = updatedProduct;
  req.app.locals.products = products;
  res.json(updatedProduct);
}));

// DELETE /api/products/:id: Delete a product
router.delete('/:id', asyncHandler(async (req, res, next) => {
  let products = req.app.locals.products;
  const productId = req.params.id;
  const initialLength = products.length;
  
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return next(new NotFoundError('Product not found for deletion'));
  }

  products.splice(productIndex, 1);
  req.app.locals.products = products;
  res.status(204).send();
}));

module.exports = router;
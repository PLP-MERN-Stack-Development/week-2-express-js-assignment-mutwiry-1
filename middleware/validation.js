const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

// Create a reusable validation function
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('inStock').optional().isBoolean().withMessage('In stock must be a boolean value'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError('Validation failed', errors.array()));
    }
    next();
  }
];

// Export as a function that returns the array
module.exports = () => validateProduct;
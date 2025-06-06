const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/customErrors');

// Create a reusable validation function
const validateProduct = (req, res, next) => {
  // Validate and sanitize fields
  const validationChecks = [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    
    body('price')
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number')
      .toFloat(),
    
    body('category')
      .trim()
      .notEmpty().withMessage('Category is required'),
    
    body('inStock')
      .optional()
      .isBoolean().withMessage('inStock must be a boolean')
      .toBoolean()
  ];

  // Run validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({
      param: err.param,
      message: err.msg,
      value: err.value
    }));
    
    return next(new ValidationError('Validation failed', errorDetails));
  }
  
  next();
};

module.exports = {
  validateProduct
};
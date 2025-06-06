// errors/customErrors.js
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // To distinguish from programming errors
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message = 'Validation Error', errorsArray = []) {
      super(message, 400);
      this.errors = errorsArray; // For detailed validation messages
    }
  }
  
  class AuthenticationError extends AppError {
      constructor(message = 'Authentication Failed') {
          super(message, 401);
      }
  }
  
  class AuthorizationError extends AppError {
      constructor(message = 'Forbidden') {
          super(message, 403);
      }
  }
  
  module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError
  };
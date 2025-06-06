// middleware/auth.js
const { AuthenticationError, AuthorizationError } = require('../errors/customErrors');

const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Or 'Authorization': 'Bearer YOUR_API_KEY'
    const expectedApiKey = process.env.API_KEY;
  
    if (!apiKey) {
      return next(new AuthenticationError('API Key missing'));
    }
  
    if (apiKey !== expectedApiKey) {
      return next(new AuthorizationError('Invalid API Key'));
    }
  
    next(); // API Key is valid
};

module.exports = authenticateApiKey;
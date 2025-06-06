// middleware/auth.js
const { AuthenticationError, AuthorizationError } = require('../errors/customErrors');

const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']; // Check both headers
    const expectedApiKey = 'test-api-key'; // Use hardcoded test key for development
  
    if (!apiKey) {
      return next(new AuthenticationError('API Key missing'));
    }
  
    // Extract API key from Authorization header if it exists
    const authHeader = apiKey.split(' ')[1] || apiKey;
    if (authHeader !== expectedApiKey) {
      return next(new AuthorizationError('Invalid API Key'));
    }
  
    next(); // API Key is valid
};

module.exports = authenticateApiKey;
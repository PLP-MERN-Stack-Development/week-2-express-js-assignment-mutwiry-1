// middleware/logger.js
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    // Use req.path for cleaner logging
    const path = req.path || '/';
    console.log(`${timestamp} ${req.method} ${path}`);
    next();
};

module.exports = loggerMiddleware;
// middleware/logger.js
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    // Use req.url for cleaner logging and to avoid malformed URLs
    const url = req.url || '/';
    console.log(`${timestamp} ${req.method} ${url}`);
    next();
};

module.exports = loggerMiddleware;
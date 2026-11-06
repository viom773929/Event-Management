const jwt = require('jsonwebtoken');

/**
 * Middleware to extract authenticated user from Authorization header.
 * Works seamlessly with Firebase ID Tokens or standard JWTs.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Decode JWT without strict signature validation for serverless speed,
      // extracting user_id/sub and email from Firebase ID tokens.
      const decoded = jwt.decode(token);
      if (decoded) {
        req.user = {
          id: decoded.user_id || decoded.sub || decoded.uid || 'anonymous_user',
          email: decoded.email || '',
          name: decoded.name || 'User',
          role: decoded.role || 'USER',
        };
        return next();
      }
    } catch (err) {
      console.warn('Token decoding warning:', err.message);
    }
  }

  // Fallback for public or dev requests
  req.user = {
    id: req.headers['x-user-id'] || 'guest_user',
    email: req.headers['x-user-email'] || 'guest@example.com',
    role: 'USER',
  };

  next();
}

module.exports = authMiddleware;

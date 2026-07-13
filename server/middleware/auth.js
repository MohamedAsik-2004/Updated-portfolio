const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Double-submit CSRF protection for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const cookieCsrf = req.cookies['csrf_token'];
      const headerCsrf = req.headers['x-csrf-token'];

      if (!cookieCsrf || !headerCsrf || cookieCsrf !== headerCsrf) {
        return res.status(403).json({ message: 'CSRF token mismatch or missing. Action forbidden.' });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid, authorization denied.' });
  }
};

module.exports = auth;

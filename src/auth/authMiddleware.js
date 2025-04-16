const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token;

  // Check if token is in the Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // If not in header, check if token is in cookies
  if (!token && req.cookies && req.cookies['auth_token']) {
    token = req.cookies['auth_token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token?.trim();
  if (!token) {
    console.log("❌ No token in cookie");
    return res.status(401).json({ message: 'Unauthorized' });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = { email: decoded.email?.trim() };
    next();
  } catch (err) {
    console.log("❌ Token invalid:", err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };

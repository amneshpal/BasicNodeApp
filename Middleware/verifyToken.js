const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Token is usually sent in the "Authorization" header, as "Bearer <token>"
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token using your secret key (replace 'yourSecretKey' with your actual secret)
jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
  if (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
  req.user = decoded;
  next();
});
};

module.exports = { verifyToken };

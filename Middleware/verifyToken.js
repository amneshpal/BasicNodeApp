const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Token is usually sent in the "Authorization" header, as "Bearer <token>"
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token using your secret key (replace 'yourSecretKey' with your actual secret)
  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    
    // Store the decoded user info (or any necessary data) in request for later use
    req.user = decoded; // This will include the user data encoded in the JWT
    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = { verifyToken };

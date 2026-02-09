const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); 
  } else {
    res.status(403).json({ msg: 'Access denied: Admins only' });
  }
};

module.exports = { auth, admin };
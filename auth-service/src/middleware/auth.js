const jwt = require('jsonwebtoken');
const Token = require('../models/token');
require('dotenv').config();

const authMiddleware = (roles = []) => {

  return async (req, res, next) => {

    const bearer = req.headers['authorization'];
    if (!bearer) return res.status(401).json({ error: 'No token' });

    const token = bearer.split(' ')[1];

    try {
      // Check blacklist
      const blocked = await Token.findOne({ where: { token } });
      if (blocked) {
        return res.status(401).json({ error: 'Token expired' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = decoded;
      req.token = token;

      next();

    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;

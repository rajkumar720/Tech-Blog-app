const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.sendStatus(401);
  }
};
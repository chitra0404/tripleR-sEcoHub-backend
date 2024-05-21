// authMiddleware.js

const jwt = require('jsonwebtoken');
const Recycler = require('../models/recyclerModel');
module.exports. rauth = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.R_KEY);

    // Find the user based on the decoded token
    const user = await Recycler.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


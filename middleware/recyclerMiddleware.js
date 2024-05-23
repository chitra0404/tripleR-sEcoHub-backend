// authMiddleware.js

const jwt = require('jsonwebtoken');
const Recycler = require('../models/recyclerModel');
module.exports. rauth = async (req, res, next) => {
  try {
   
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.R_KEY);
    console.log(decoded);


    const user = await Recycler.findById(decoded.recyclerId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


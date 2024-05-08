const jwt = require("jsonwebtoken");
const User=require("../models/userModel")

module.exports.auth= async(req, res, next)=> {
    let token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(401).send("Access Denied");

  try {
    if(token.length<500){
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    const rootUser=await User.findOne({_id:verifiedUser.id}).select('-password');
    req.rootUser = rootUser;
    req.rootUserId = rootUser._id;
    req.token = token;
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
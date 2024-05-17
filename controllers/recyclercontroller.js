const Recycler=require("../models/recyclerModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const{NodeMailer}=require("../nodemailer/mailer")


module.exports.getrecycler=async(req,res)=>{
    try{
        const recycler=await Recycler.find()
        res.status(200).send({ status: "200", message: recycler });
    } catch (error) {
      console.log(error);
      res.status(200).send({ status: "500", message: error });
    }
}

module.exports.RecyclerRegister = async (req, res) => {
  try {
    const { name, email, password, city, address, latitude, longitude, pincode,mobilenumber } = req.body;

    // Check if email already exists
    const emailexist = await Recycler.findOne({ email: req.body.email });
    if (emailexist) {
      return res.status(400).json({
        status: "400",
        message: "This email is already in use",
      });
    }

    // Hash the password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Generate a token
    const token = jwt.sign(
      { email },
      process.env.R_KEY
    );

    // Create the recycler object
    const recycler = new Recycler({
      name,
      email,
      password: hashedpassword,
      token,
      isVerified: false,
      city,
      address,
      pincode,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      mobilenumber
    });

    // Save the recycler to the database
    await recycler.save();

    // Send the response
    res.status(200).header("auth-token").json({ token: token });

    // Generate random string for account activation
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${process.env.LINK}/acc/${randomString}`;
    const sub = "Account Activation";

    // Send activation email
    NodeMailer(randomString, email, link, sub);

  } catch (err) {
    console.error('Error registering recycler', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.AccActivation = async (req, res) => {

    // try {
        console.log(req.params.id);
        const tok  = req.params.id;
console.log("token",tok);
        const recycler = await Recycler.findOne({ token_activate_account: tok });

        if (!recycler) {
            return res.status(400).json({ Message: "User not found or Activated account" });
        }

        recycler.isVerified = true

        recycler.token_activate_account = "Account Activated";

        const updated = await Recycler.findByIdAndUpdate(recycler._id, recycler);

        if (updated) {
            return res.status(201).json({ Message: "Account activated" });
        }
    // }
    // catch (err) {
    //     console.error('Error signing up user', err);
    //     return res.status(400).json({ Message: "Internal server error" })
    // }
}

module.exports.checkAct = async (req, res) => {
    try {
      const { id } = req.params;
      const recycler = await Recycler.findOne({ token_activate_account: id });
  
      if (!recycler) {
        return res.status(400).json({ Message: "User not found or account already activated" });
      }
  
      const activated = recycler.isVerified;
  
      return res.status(200).json({ activated });
    } catch (err) {
      console.error('Error checking account activation', err);
      return res.status(500).json({ Message: "Internal server error" });
    }
  };
module.exports.RecycleLogin=async(req,res)=>{
    const {email,password}=req.body;
    const recycler=await Recycler.findOne({email});
    if(!recycler){
        return res.status(409).json({message:"authentication failed"});
    }
        const passwordmatch=await bcrypt.compare(password,recycler.password);
        if(!passwordmatch){
            return res.status(409).json({message:"invalid password"}); }
            if(recycler.isVerified){
                const role=recycler.role;
                const token=jwt.sign({ email,recylerId:recycler._id},process.env.R_KEY,{expiresIn:'24hr'})
                return res.status(200).json({token,role});
            }
            else{
                return res.status(400).json({ message: 'Account not activated' });
            }
    
}

module.exports.searchRecyclers=async(req,res)=>{
  const { latitude, longitude, maxDistance = 5000 } = req.query; // Default maxDistance to 5000 meters

  if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
      const recyclers = await Recycler.find({
          location: {
              $near: {
                  $geometry: {
                      type: "Point",
                      coordinates: [parseFloat(longitude), parseFloat(latitude)]
                  },
                  $maxDistance: parseFloat(maxDistance),
                  $minDistance: 0 // Ensure minDistance is set to avoid negative values
              }
          }
      });

      res.status(200).json({ message: recyclers });
  } catch (error) {
      console.error('Error searching recyclers:', error);
      res.status(500).json({ message: "Internal server error" });
  }
}
module.exports.getPincode = async (req, res) => {
  const { pincode } = req.query;

  // Log the received pincode for debugging
  console.log('Received pincode:', pincode);

  // Validate pincode
  if (!pincode) {
    console.log('Pincode is missing');
    return res.status(400).json({ message: 'Invalid pincode' });
  }

  const parsedPincode = Number(pincode);

  if (isNaN(parsedPincode)) {
    console.log('Pincode is not a number');
    return res.status(400).json({ message: 'Invalid pincode' });
  }

  try {
    const recyclers = await Recycler.find({ pincode: parsedPincode });
    res.json({ recyclers });
  } catch (error) {
    console.error('Error fetching recyclers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
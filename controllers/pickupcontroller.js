const Pickup = require("../models/pickModel");
const { notifyRecyclerByEmail } = require("../nodemailer/notifyRecycler");
const Recycler = require("../models/recyclerModel");
const { notifyUserByEmail } = require("../nodemailer/notifyUser");



module.exports.schedulePickup = async (req, res) => {
  try {
      const { user, city, state, address, othernumber, items, recycler,weight } = req.body;

      // Find an available recycler in the specified city
      const recycle = await Recycler.findOne({ city: city, availability: true });
      if (!recycle) {
          return res.status(404).json({ message: "No recyclers available for this location" });
      }

      // Create a new pickup request
      const newpickup = new Pickup({
        pickupdID:Pickup._id,
          user: user,
          city: city,
          state: state,
          address: address,
          othernumber: othernumber,
          items: items,
          weight:weight,
          recycler: recycle._id  
      });

      
      await newpickup.save();

    
      notifyRecyclerByEmail(newpickup, recycle.email);

     
      res.status(201).json({ message: 'Pickup request created successfully', pickupRequest: newpickup });
  } catch (err) {
      console.error('Error scheduling pickup:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports.pickupRequest = async (req, res) => {
  try {
      const { id } = req.params;
      console.log(id);
      const pickupRequest = await Pickup.findById(id).populate('user');
      if (!pickupRequest) {
        return res.status(404).json({ message: 'Pickup request not found' });
      }
     
      pickupRequest.status = 'confirmed';
      await pickupRequest.save();
      const email = pickupRequest.user.email;
      console.log(email);
      notifyUserByEmail(pickupRequest, email); 
      res.status(200).json({ message: 'Pickup request confirmed successfully', pickupRequest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getResponse=async(req,res)=>{
  try{
    const data=await Pickup.find();
    res.status(200).send({message:data});
    } catch (error) {
      console.log(error);
      res.status(5500).send({ status: "500", message: error });
    }

  
}

module.exports.updateRate=async (req, res) => {
  try {
    const { pickupRequestId } = req.params;
    const { rate } = req.body;

    // Find the pickup request by ID
    const pickupRequest = await Pickup.findById(pickupRequestId);

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Update the rate
    pickupRequest.rate = rate;
    await pickupRequest.save();
console.log(pickupRequest)
    res.json({ pickupRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

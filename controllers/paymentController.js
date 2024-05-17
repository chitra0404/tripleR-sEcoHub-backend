const Razorpay = require('razorpay');
const crypto = require('crypto');
const Pickup = require('../models/pickModel');
const Payment = require('../models/PaymentModel')



const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
 module.exports.CreateOrder= async (req, res) => {
    const { amount } = req.body;
    
    const options = {
      amount: amount,
   receipt:crypto.randomBytes(10).toString("hex"),
      currency: 'INR',
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send('Error creating Razorpay order');
    }
  };
  
  // Verify Razorpay payment
module.exports.VerifyPayment=async (req, res) => {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  
    const sign = razorpayOrderId + "|" + razorpayPaymentId
    const shasum = crypto.createHmac('sha256',process.env.KEY_SECRET)
    .update(sign.toString())
    .digest('hex');
  
    if ( shasum === razorpaySignature) {
      try {
        const payment = new Payment({
          pickupRequestId: orderCreationId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          amount: req.body.amount,
          status: 'completed',
        });
  
        await payment.save();
  
        res.json({ status: 'success' });
      } catch (error) {
        res.status(500).send('Error saving payment');
      }
    } else {
      res.status(400).json({ status: 'failed' });
    }
  };
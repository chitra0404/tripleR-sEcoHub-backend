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
    const { pickupRequestId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  
    const sign = razorpayOrderId + "|" + razorpayPaymentId
    const shasum = crypto.createHmac('sha256',process.env.KEY_SECRET)
    .update(sign.toString())
    .digest('hex');
  
    if ( shasum === razorpaySignature) {
      try {
        const payment = new Payment({
          pickupRequestId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          amount: req.body.amount,
          status: 'completed',
        });
  
        await payment.save();
  
        res.json({ status: 'success',payment });
      } catch (error) {
        res.status(500).send('Error saving payment');
      }
    } else {
      res.status(400).json({ status: 'failed' });
    }
  };

  module.exports.getPaymentById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
  
    try {
      const payment = await Payment.findById(id);
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      res.json(payment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  module.exports.getpayments=async (req, res) => {
    try {
      const payments = await Payment.find();
      res.json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
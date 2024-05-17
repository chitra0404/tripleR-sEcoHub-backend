// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  pickupRequestId:  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PickupRequest',
     required: true
 },
  razorpayOrderId: {
     type: String,
      required: true 
    },
  razorpayPaymentId: {
     type: String,
      required: true 
    },
  razorpaySignature: { 
    type: String,
     required: true 
    },
  amount: {
     type: Number, 
     required: true }, 
  status: {
     type: String,
      default: 'pending' }, 
});

const Payment  = mongoose.model('payment', PaymentSchema);
module.exports=Payment;

const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    mobilenumber: {
        type: Number,
    },
    address:{
      type:String,
    },
    role: {
        type: String,
        default: "consumer",
        minlength: 2,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    cardNumber: {
        type: String,
    },
    cardExpiry: {
        type: String,
    },
    cardCVV: {
        type: String,
    },
    token_activate_account: {
        type: String,
    },
    token_reset_password: {
        type: String,
    },
    acc_create: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.methods.encryptCardDetails = function (cardNumber, cardExpiry, cardCVV) {
    const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY);
    if (!key) throw new Error('Encryption key is not defined');
    const iv = CryptoJS.lib.WordArray.random(16);
  
    const encryptedCardNumber = CryptoJS.AES.encrypt(cardNumber, key, { iv: iv }).toString();
    const encryptedCardExpiry = CryptoJS.AES.encrypt(cardExpiry, key, { iv: iv }).toString();
    const encryptedCardCVV = CryptoJS.AES.encrypt(cardCVV, key, { iv: iv }).toString();
  
    return {
        encryptedCardNumber: `${iv.toString(CryptoJS.enc.Hex)}:${encryptedCardNumber}`,
        encryptedCardExpiry: `${iv.toString(CryptoJS.enc.Hex)}:${encryptedCardExpiry}`,
        encryptedCardCVV: `${iv.toString(CryptoJS.enc.Hex)}:${encryptedCardCVV}`,
    };
};

UserSchema.methods.decryptCardDetails = function() {
    const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY);
    if (!key) throw new Error('Decryption key is not defined');
  
    let decryptedCardNumber = null, decryptedCardExpiry = null, decryptedCardCVV = null;
  
    try {
      if (this.cardNumber) {
        const [ivCardNumber, contentCardNumber] = this.cardNumber.split(':');
        decryptedCardNumber = CryptoJS.AES.decrypt(contentCardNumber, key, {
          iv: CryptoJS.enc.Hex.parse(ivCardNumber),
        }).toString(CryptoJS.enc.Utf8);
      }
  
      if (this.cardExpiry) {
        const [ivCardExpiry, contentCardExpiry] = this.cardExpiry.split(':');
        decryptedCardExpiry = CryptoJS.AES.decrypt(contentCardExpiry, key, {
          iv: CryptoJS.enc.Hex.parse(ivCardExpiry),
        }).toString(CryptoJS.enc.Utf8);
      }
  
      if (this.cardCVV) {
        const [ivCardCVV, contentCardCVV] = this.cardCVV.split(':');
        decryptedCardCVV = CryptoJS.AES.decrypt(contentCardCVV, key, {
          iv: CryptoJS.enc.Hex.parse(ivCardCVV),
        }).toString(CryptoJS.enc.Utf8);
      }
    } catch (error) {
      console.error('Decryption error:', error);
    }
  
    return {
      cardNumber: decryptedCardNumber,
      cardExpiry: decryptedCardExpiry,
      cardCVV: decryptedCardCVV,
    };
  };
  

const User = mongoose.model('User', UserSchema);
module.exports = User;

const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/userModel');

const Email_Id = process.env.Email_Id;
const Email_Pass = process.env.Email_Pass;

module.exports.NodeMailer = async (token, User_mail, link,  sub) => {
  const user = await User.findOne({ email: User_mail });

  sub === 'Account Activation'
    ? (user.token_activate_account = token)
    : (user.token_reset_password = token);

  const updated = await User.findByIdAndUpdate(user._id, user);
  console.log(updated);
  if (updated) {
    sendEmail();
  }

  async function sendEmail() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Email_Id,
        pass: Email_Pass,
      },
    });

    await transporter.sendMail({
      from: Email_Id,
      to: User_mail,
      subject: ` ${sub} link`,
      text: link,
    });

    console.log(`Mail sent to ${User_mail}`);
  }
};
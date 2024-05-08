const nodemailer = require('nodemailer');
require('dotenv').config();
const Recycler = require('../models/recyclerModel');

const Email_Id = process.env.Email_Id;
const Email_Pass = process.env.Email_Pass;

module.exports.NodeMailer = async (token, User_mail, link,  sub) => {
  const recycler = await Recycler.findOne({ email: User_mail });

  sub === 'Account Activation'
    ? (recycler.token_activate_account = token)
    : (recycler.token_reset_password = token);

  const updated = await Recycler.findByIdAndUpdate(recycler._id, recycler);
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
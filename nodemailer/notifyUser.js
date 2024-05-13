const nodemailer = require('nodemailer');

const Email_Id = process.env.Email_Id;
const Email_Pass = process.env.Email_Pass;
const notifyUserByEmail = (pickup,user_email) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: Email_Id,
      pass: Email_Pass,
    },
  });

  const mailOptions = {
    from: Email_Id,
    to: user_email,
    subject: 'Pickup Request confirmed',
    html: `
      <h2>New Pickup Request</h2>
      <p>A new pickup request has been scheduled with the following details:</p>
      <ul>
      

        <li><strong>Pickup Address:</strong> ${pickup.city}</li>
        <li><strong>Pickup Time:</strong> ${pickup.date}</li>
        <li><strong>Waste Type:</strong> ${pickup.items}</li>
      </ul>
    `,
  };

 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email notification:', error);
    } else {
      console.log('Email notification sent to recycler:', info.response);
    }
  });
};

module.exports = {
  notifyUserByEmail,
};

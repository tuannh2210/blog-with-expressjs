const nodemailer = require('nodemailer');

const sendMail = ({ mailTo, subject, html }) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  var mailOptions = {
    from: '"Blog App" <doremonconan8@gmail.com>',
    to: mailTo,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions)
    .then(() => console.log('Send mail'))
    .catch((error) => console.log('Error:', error.message))
}

module.exports = sendMail
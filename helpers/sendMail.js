const nodemailer = require('nodemailer');
const pug = require('pug');

// new Email(user, url).sendWellCome
class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.username.split('')[0];
    this.url = url;
    this.from = `Blog App <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.firstname,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWellCome() {
    this.send('wellcome', 'Wellcome to us');
  }

  async sendVerifyMail() {
    this.send('verify-email', 'Account Verification Email');
  }

  async sendPasswordReset() {
    this.send(
      'password-reset',
      'Your password reset token ( valid for only 10 minutes'
    );
  }
}

module.exports = Email;

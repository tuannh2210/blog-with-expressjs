const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');

const sendMail = ({mailTo, subject, html}) => {
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

const createToken = (userId) => {
  const token = new Token({
    _userId: userId,
    token: crypto.randomBytes(64).toString('hex'),
  });
  token.save().catch(err => res.json({ msgError: err.message }))

  return token
} 

module.exports.login = (req, res) => {
  res.render('auth/login', {
    error_msg: req.flash('error_msg')
  });
};

module.exports.loginPost = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

module.exports.register = (req, res) => {
  res.render('auth/register');
};

module.exports.registerPost = async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({username, email, password});

  user.save();
  var token = await createToken(user._id)

  var subject = 'Account Verification Token'
  var html = `Hello,
            Please verify your account by clicking the link: 
            http://${req.headers.host}/confirmation/${token.token}`

  sendMail({mailTo: email, subject, html })

  req.flash('success_msg', `A verification email has been sent to ${user.email}.`);
  res.redirect('/login');
};

module.exports.confirmationPost = async (req, res, next) => {
  let paramToken = req.params.token;
  let token = await Token.findOne({ token: paramToken});
  let user = await User.findOne({ _id: token._userId });
  user.isVerified = true;

  if (user && user.isVerified) {
    user.save();
    req.flash('success_msg', 'The account has been verified. Please log in.');
    res.redirect('/login');
  }
};

module.exports.resendToken = (req, res, next) => {
  res.render('auth/resend-token');
};

module.exports.resendTokenPost = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) res.json({msg:'We were unable to find a user with that email.'});
  if (user.isVerified)
    res.json({msg: 'This account has already been verified. Please log in.'});

  let token =  await createToken(user._id)
  let subject = 'Account Verification Token';
  let html = `Hello,
          Please verify your account by clicking the link: 
          <strong>URL:</strong> <a href='http://${req.headers.host}/confirmation/${token.token}'> Click vào đây </a>`
          
  sendMail({ mailTo: email, subject, html })

  req.flash('success_msg', `A verification email has been sent to ${user.email}.`);
  res.redirect('/login');
};

module.exports.forgotPassword = (req, res) => {
  res.render('auth/forgot-password')
}

module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({email: email});

  let token = await createToken(user._id);
  let subject = 'Quên mật khẩu'
  let html = `Xin chào ${user.username},<br>
      Để thay đổi mật khẩu tài khoản của bạn, bạn vui lòng nhấn vào đường link dưới đây:<br>
    <strong>URL:</strong> <a href='http://${req.headers.host}/reset-password/${token.token}'> Click vào đây </a>`
  
  sendMail({ mailTo: email, subject, html })

  req.flash('success_msg', `A verification email has been sent to ${user.email}.`);
  res.redirect('/reset-password');
}

module.exports.resetPassword = (req, res) => {
  res.render('auth/reset-password', {token: req.params.token});
}

module.exports.resetPasswordPost = async (req, res) => {
  let paramToken = req.params.token;
  let { password } = req.body;

  let token = await Token.findOne({ token: paramToken });
  let user = await User.findOne({ _id: token._userId });

   //Set the new password
  user.password = password;
  user.save()
  req.flash('success_msg', 'Your password has been updated.');
  res.redirect('/login')
};

module.exports.logout = (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    if (err) res.redirect('/dashboard');
    res.clearCookie('sessionId');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
};
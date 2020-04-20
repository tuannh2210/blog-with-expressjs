const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const passport = require('passport');
const sendMail = require('../helpers/sendMail');

const createToken = (userId) => {
  const token = new Token({
    _userId: userId,
    token: crypto.randomBytes(64).toString('hex'),
  });

  token.save().catch((err) => {
    res.json({ msgError: err.message });
  });

  return token;
};

module.exports.checkToken = async (req, res, next, values) => {
  try {
    const token = await Token.findOne({ token: values });
    if (token) {
      req.token = token;
      return next();
    } else {
      req.flash(
        'error_msg',
        'We were unable to find a valid token. Your token my have expired.'
      );
      res.redirect('/resend-token');
    }
  } catch (error) {
    res.json({ msg: error });
  }
};

module.exports.login = (req, res) => {
  res.render('auth/login', {
    error_msg: req.flash('error_msg'),
  });
};

module.exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

module.exports.register = (req, res) => {
  res.render('auth/register');
};

module.exports.postRegister = async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({ username, email, password });

  user.save();
  let token = await createToken(user._id);

  let subject = 'Account Verification Token';
  let html = `Hello,
            Please verify your account by clicking the link: 
            http://${req.headers.host}/confirmation/${token.token}`;

  let success_msg = `A verification email has been sent to ${user.email}.`;

  sendMail({ mailTo: email, subject, html });

  req.flash('success_msg', success_msg);
  res.redirect('/login');
};

module.exports.confirmationPost = async (req, res, next) => {
  let paramToken = req.params.token;
  let token = await Token.findOne({ token: paramToken });
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

module.exports.PostresendToken = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.json({ msg: 'We were unable to find a user with that email.' });
  }

  if (user.isVerified) {
    res.json({ msg: 'This account has already been verified. Please log in.' });
  }

  let token = await createToken(user._id);
  let subject = 'Account Verification Token';
  let html = `Hello,
          Please verify your account by clicking the link: 
          <strong>URL:</strong> <a href='http://${req.headers.host}/confirmation/${token.token}'> Click vào đây </a>`;

  sendMail({ mailTo: email, subject, html });

  req.flash(
    'success_msg',
    `A verification email has been sent to ${user.email}.`
  );
  res.redirect('/login');
};

module.exports.forgotPassword = (req, res) => {
  res.render('auth/forgot-password');
};

module.exports.postForgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  let token = await createToken(user._id);
  let subject = 'Quên mật khẩu';
  let html = `Xin chào ${user.username},<br>
      Để thay đổi mật khẩu tài khoản của bạn, bạn vui lòng nhấn vào đường link dưới đây:<br>
    <strong>URL:</strong> <a href='http://${req.headers.host}/reset-password/${token.token}'> Click vào đây </a>`;

  sendMail({ mailTo: email, subject, html });

  req.flash('success_msg', `Email có kèm hướng dãn đã được gửi kèm cho bạn`);
  res.redirect('/login');
};

module.exports.resetPassword = (req, res) => {
  res.render('auth/reset-password', { token: req.params.token });
};

module.exports.postResetPassword = async (req, res) => {
  let paramToken = req.params.token;
  let { password } = req.body;

  let token = await Token.findOne({ token: paramToken });
  let user = await User.findOne({ _id: token._userId });

  //Set the new password
  user.password = password;
  user.save();
  req.flash('success_msg', 'Your password has been updated.');
  res.redirect('/login');
};

module.exports.logout = (req, res, next) => {
  try {
    req.logout();
    req.session.destroy();
    res.clearCookie('sessionId');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  } catch (error) {
    res.redirect('/dashboard');
  }
};

const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const passport = require('passport');
const Email = require('../helpers/sendMail');
const AppError = require('../helpers/appError');

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

  let success_msg = `A verification email has been sent to ${user.email}.`;

  const url = `${req.headers.host}/confirmation/${token.token}`;
  new Email(user, url).sendVerifyMail();

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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.isVerified) {
      req.flash('success_msg', `Your account has verified. Log in now `);
      res.redirect('/login');
    }
    const token = await createToken(user._id);
    const url = `http://${req.headers.host}/confirmation/${token.token}`;
    new Email(user, url).sendVerifyMail();

    req.flash(
      'success_msg',
      `A verification email has been sent to ${user.email}.`
    );
    res.redirect('/login');
  } catch {
    req.flash('error_msg', `There is no user with email address`);
    res.redirect('/forgot-password');
  }
};

module.exports.forgotPassword = (req, res) => {
  res.render('auth/forgot-password');
};

module.exports.postForgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    const token = await createToken(user._id);
    const ReseSURL = `http://${req.headers.host}/reset-password/${token.token}`;

    new Email(user, ReseSURL).sendPasswordReset();

    req.flash('success_msg', `Email có kèm hướng dãn đã được gửi kèm cho bạn`);
    res.redirect('/login');
  } catch {
    req.flash('error_msg', `There is no user with email address`);
    res.redirect('/forgot-password');
  }
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

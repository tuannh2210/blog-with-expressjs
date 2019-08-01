const User = require('../models/user.model');
const validator = require('validator');

module.exports.postRegister = async (req, res, next) => {
  const { username, email, password, password2 } = req.body;
  var errors = [];
  var user = await User.findOne({ email: email });

  if (user) {
    errors.push({ msg: 'Email already exists' });
  }
  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Plese enter all fields' });
  }
  if (!validator.isEmail(email)) {
    errors.push({ msg: 'Wrong email format' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('auth/register', {
      errors,
      values: req.body
    });
    return;
  }
  next();
};

module.exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  const user = await User.findOne({ email: email });
  const isVerified = await User.findOne({ email: email, isVerified: true })

  if (!email || !password) {
    errors.push({ msg: 'Invalid email or password' });
  }

  if (!user) {
    errors.push({
      msg: "Sorry, we can't find an account with this email address. Please try again or create a new account."
    });
  }

  if (!isVerified) {
    errors.push({
      msg: "This account hasn't already been verified"
    });
  }

  if (errors.length) {
    res.render('auth/login', {
      errors,
      values: req.body
    });
    return;
  }

  res.locals.user = user;

  next();
};

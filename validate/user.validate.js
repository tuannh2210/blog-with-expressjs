const User = require('../models/user.model');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

  const user = await User.findOne({ email: email });

  const comparePassword = pwd => {
    return bcrypt.compareSync(pwd, user.password);
  };

  let errors = [];

  if (email == '' || password == '') {
    errors.push({ msg: 'Enter email and password' });
  }

  if (!user || !comparePassword(password)) {
    errors.push({msg: 'Invalid email or password'});
  }

  if (user) {
    const isVerified = user.isVerified;
    if (!isVerified) {
      errors.push({msg: "This account hasn't already been verified"});
    }
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

module.exports.resetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  let errors = [];

  if (password !== confirmPassword) {
    errors.push({ msg: 'Password do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('reset-password',  errors );
    return;
  }
  next();
}
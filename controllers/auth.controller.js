const User = require('../models/user.model');
const Token = require('../models/token.model');
const bcrypt = require('bcryptjs');
var crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');

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

const hashPasword = password => {
  const salt = bcrypt.genSaltSync(16).toString('hex');
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports.registerPost = async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({
    username,
    email,
    password: hashPasword(password)
  });
  user.save().then(() => {
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });

    token.save(function (err) {
      if (err) return err.message

      // Send the email
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      var mailOptions = {
        from: '"Verify account" <doremonconan8@gmail.com>',
        to: user.email,
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://' + req.headers.host +
          '/confirmation/' + token.token + '.\n'

      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) return res.status(500).send({ msg: err.message });
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
      });
    });
    // req.flash('success_msg', 'You are now registered and can log in');
    req.flash('success_msg', 'A verification email has been sent to ' + user.email + '.');
    res.redirect('/login');
  })
    .catch(err => req.flash('error_msg', err.message));
};

module.exports.confirmationPost = (req, res, next) => {
  Token.findOne({ token: req.params.token }).then(token => {
    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token my have expired.'
      });
    }
    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }).then(user => {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified) {
        req.flash('success_msg', 'This user has already been verified.')
        res.redirect('/login');
      }
      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send('The account has been verified. Please log in.');
      });
    });
  });
}

module.exports.resendToken = (req, res, next) => {
  res.render('auth/resendToken')
}

module.exports.resendTokenPost = (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
    if (user.isVerified)
      return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

    // Create a verification token, save it, and send email
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });

    // Save the token
    token.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // Send the email
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD
        }
      });
      var mailOptions = {
        from: 'doremonconan8@gmail.com',
        to: user.email,
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://' + req.headers.host +
          '/confirmation/' + token.token + '.\n'
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        req.flash('success_msg', 'A verification email has been sent to ' + user.email + '.');
        res.redirect('/login')
      });
    });
  });
};

module.exports.logout = (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('sessionId');
    res.redirect('/login');
  });
};

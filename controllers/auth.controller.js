const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports.login = ((req, res) => {
  res.render('auth/login')
})

module.exports.register = ((req, res) => {
  res.render('auth/register')
})

const hashPasword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports.postRegister = (async (req, res, next) => {
   const {email, username, password} = req.body;
   const newUser = {
     username,
     email,
     password: hashPasword(password),
   };

  User.create(newUser)
      .then(() => {
          req.flash('success_msg','You are now registered and can log in');
          res.redirect('/login');
       })
})

module.exports.postLogin = ((req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

module.exports.logout = ((req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login')
})

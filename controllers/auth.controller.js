const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports.login = ((req, res) => {
  res.render('auth/login')
})

module.exports.register = ((req, res) => {
  res.render('auth/register')
})

module.exports.postRegister = ((req, res, next) => {
   const {email, username, password} = req.body;

   const newUser = new User({
     username,
     email,
     password
   });

   bcrypt.genSalt(10, (err, salt) => {
     bcrypt.hash(newUser.password, salt, (err, hash) => {
       newUser.password = hash;
       newUser
       .save()
       .then(() => {
         req.flash('success_msg',
                  'You are now registered and can log in');
          res.redirect('/login');
        })
     });
   });
})

module.exports.postLogin = ((req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
  })(req, res, next);
});

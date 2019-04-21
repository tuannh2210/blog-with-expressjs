const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passportField: 'password',
      passReqToCallback: true
    }, (req, email, password, done) => {
      // Match user
      User.findOne({ email: email})
      .then(user => {
        if (!user) {
          req.flash('error_msg', 'That email is not registered')
          return done(null, false);
        }
        // Match password
        else if (!user.comparePassword(password)) {
          req.flash('error_msg', 'Password or username incorrect')
         return done(null, false);
       }
        return done(null, user);
      }).catch(err => {
        done(err, false)
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}

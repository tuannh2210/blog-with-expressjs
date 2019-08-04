const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {
        // Match user
        var query = { email: email, isVerified: true };
        User.findOne(query)
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'No user found' });
            }
            // Match password
            else if (!user.comparePassword(password)) {
              return done(null, false, {
                message: 'Wrong password or email'
              });
            }
            return done(null, user);
          })
          .catch(err => {
            done(err, false, {
              message: 'That email is not registered'
            });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

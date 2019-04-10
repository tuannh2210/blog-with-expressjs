const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

module.exports.login = ((req, res) => {
  res.render('auth/login')
})

module.exports.register = ((req, res) => {
  res.render('auth/register')
})

module.exports.postRegister = ((req, res, next) => {
   const {email, username, password} = req.body;
   User.findOne({ email: email }).then(user => {
     if (user) {
       res.render('register', {
         errors,
         name,
         useremail,
         password,
         password2
       });
     } else {
       const newUser = new User({
         username,
         email,
         password
       });

       bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(newUser.password, salt, (err, hash) => {
           if (err) throw err;
           newUser.password = hash;
           newUser
             .save()
             .then(user => {
               res.redirect('/login');
             })
             .catch(err => console.log(err));
         });
       });
     }
  });
})

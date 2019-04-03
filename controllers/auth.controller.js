const User = require('../models/user.model');

module.exports.login = ((req, res) => {
  res.render('auth/login')
})

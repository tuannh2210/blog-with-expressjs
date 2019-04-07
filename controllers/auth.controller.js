const User = require('../models/user.model');

module.exports.login = ((req, res) => {
  res.render('auth/login')
})

module.exports.register = ((req, res) => {
  res.render('auth/register')
})

module.exports.postRegister = ((req, res, next) => {
  try{
    const {email, username, password} = req.body;
    var user = User.findOne({email: email});

    if(!user) {
      let newUser = new User({
        username,
        email,
        password
      });
      newUser.hashPassword(req.body.password);
      newUser.save().then(() => {
        console.log('done');
      });
      res.redirect('/register');
    }else if(user) {

    }
  }
  catch(err){
    next(err)
  }

  // User.create(req.body);
	// console.log(req.body)

	// res.redirect('/login');
})

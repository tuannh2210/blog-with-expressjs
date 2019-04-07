module.exports.postRegister = ((req, res, next) => {
  const {username, email, password, password2} = req.body;
  var errors = [];

  if(!username || !email || !password || !password2){
    errors.push({msg:'Plese enter all fields'});
  }
  if(password !== password2){
    errors.push({  msg: 'Password do not match'  })
  }
  if (password.length < 6) {
    errors.push({msg: 'Password must be at least 6 characters'})
  }
  if (errors.length > 0 ) {
    res.render('auth/register', {
      errors,
      values: req.body
    })
    return;
  }
  res.locals.success = true;

  next()
});

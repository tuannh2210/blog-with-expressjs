module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('error_msg', 'Please login');
      res.redirect('/login');
    } else {
      res.locals.user = req.user;
      return next();
    }
  }
};

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
      next();
    } else {
      req.flash('error_msg', 'Please login');
      res.redirect('/login');
    }
  },
};

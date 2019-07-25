module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else {
      res.locals.user = req.user;
      return next();
    }
  }
};

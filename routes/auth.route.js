const express = require('express');

const router = express.Router();

const controller = require('../controllers/auth.controller');
const validate = require('../validate/user.validate');

const { ensureAuthenticated } = require('../middlewares/auth.middleware');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard');
});
//login page
router.get('/login', controller.login);

router.post('/login', validate.postLogin, controller.postLogin);

//register page
router.get('/register', controller.register);

router.post('/register', validate.postRegister, controller.postRegister);

router.get('/logout', controller.logout);

module.exports = router;

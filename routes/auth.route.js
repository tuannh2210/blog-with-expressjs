const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const validate = require('../validate/user.validate');

const { ensureAuthenticated } = require('../middlewares/auth.middleware');

const Token = require('../models/token.model');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard');
});
//login page
router.get('/login', controller.login);

router.post('/login', validate.postLogin, controller.postLogin);

//register page
router.get('/register', controller.register);

router.post('/register', validate.postRegister, controller.postRegister);

// confirmation
router.get('/confirmation/:token', controller.confirmationPost);

// forgot password
router.get('/forgot-password', controller.forgotPassword);

router.post('/forgot-password', controller.postForgotPassword);

// reset password
router.get('/reset-password/:token', controller.resetPassword);

router.post(
  '/reset-password/:token',
  validate.resetPassword,
  controller.postResetPassword
);

// resend token
router.get('/resend-token', controller.resendToken);

router.post('/resend-token', controller.PostresendToken);

router.get('/logout', controller.logout);

router.param('token', controller.checkToken);

module.exports = router;

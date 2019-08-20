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

router.post('/login', validate.postLogin, controller.loginPost);

//register page
router.get('/register', controller.register);

router.post('/register', validate.postRegister, controller.registerPost);

router.get('/confirmation/:token', controller.confirmationPost);

router.get('/resend-token', controller.resendToken);

router.post('/resend-token', controller.resendTokenPost);

router.get('/logout', controller.logout);

router.param('token', (req, res, next, token) => {
  Token.findOne({ token: token })
    .then(token => {
      if (!token)
        return res.status(400).send({
          type: 'not-verified',
          msg:
            'We were unable to find a valid token. Your token my have expired.'
        });

      req.token = token;
      return next();
    })
    .catch(() => res.render(error));
});
module.exports = router;

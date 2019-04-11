const express = require('express');

const router = express.Router();

const controller = require('../controllers/auth.controller');
const validate = require('../validate/user.validate');

//login page
router.get('/login', controller.login);

router.post('/login', controller.postLogin);

//register page
router.get('/register', controller.register);

router.post('/register',
  validate.postRegister,
  controller.postRegister);

module.exports = router

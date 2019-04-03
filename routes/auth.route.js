const express = require('express');

const controller = require('../controllers/auth.controller');

const router = express.Router();

router.get('/logn',controller.login);

module.exports = router

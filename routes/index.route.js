const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller');

router.get('/', controller.index);

router.get('/:slug*.html', controller.category);

router.get('/:slugPost', controller.postDetail);

module.exports = router;

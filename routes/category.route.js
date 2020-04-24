const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const Category = require('../models/category.model');

router.get('/', controller.getAll);

router.get('/create', controller.create);

router.post('/create', ensureAuthenticated, controller.saveCreate);

router.get('/:slug', controller.detail);

router.get('/edit/:cateId', ensureAuthenticated, controller.edit);

router.post('/edit/:cateId', ensureAuthenticated, controller.saveEdit);

router.get('/remove/:cateId', ensureAuthenticated, controller.remove);

module.exports = router;

const express = require('express');
const router = express.Router();

const controller = require('../controllers/article.controller');

const upload = require('../middlewares/upload.middleware');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

const Article = require('../models/article.model');

router.get('/', controller.getAll);

router.get('/create', ensureAuthenticated, controller.create);

router.post(
  '/create',
  upload.single('images'),
  ensureAuthenticated,
  controller.saveCreate
);

router.get('/edit/:id', ensureAuthenticated, controller.edit);

router.post(
  '/edit/:id',
  upload.single('images'),
  ensureAuthenticated,
  controller.saveEdit
);

router.get('/remove/:id', ensureAuthenticated, controller.remove);

module.exports = router;

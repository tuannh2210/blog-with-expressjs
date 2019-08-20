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

router.get('/:slug', controller.detail);

router.get('/edit/:article', ensureAuthenticated, controller.edit);

router.post(
  '/edit/:article',
  upload.single('images'),
  ensureAuthenticated,
  controller.saveEdit
);

router.get('/remove/:article', ensureAuthenticated, controller.remove);

// get theo tên param
router.param('article', function(req, res, next, articleId) {
  Article.findById(articleId)
    .then(article => {
      if (!article) res.sendStatus(404);
      req.article = article;
      return next();
    })
    .catch(err => res.render('error'));
});

router.param('slug', function(req, res, next, articleId) {
  Article.find({ slug: slug })
    .then(article => {
      if (!article) res.sendStatus(404);
      req.article = article;
      return next();
    })
    .catch(err => res.render('error'));
});

module.exports = router;

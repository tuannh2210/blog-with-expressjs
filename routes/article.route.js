const router = require('express').Router();

const controller = require('../controllers/article.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');

router.get('/', controller.getAll);

router.get('/create', controller.create);

router.post('/create', controller.saveCreate);

router.get('/edit/:article', controller.edit);

router.post('/edit/:article', controller.saveEdit);

router.get('/remove/:article', controller.remove);

// get theo tên param
router.param('article', function(req, res, next, articleId) {
  Article.findOne({ _id: articleId })
    .then(article => {
      if (!article) res.sendStatus(404);
      req.article = article;
      return next();
    })
    .catch(err => next(err));
});
module.exports = router;

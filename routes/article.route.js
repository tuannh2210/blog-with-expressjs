const router = require('express').Router();
const multer = require('multer');

const controller = require('../controllers/article.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');

const upload = multer({ dest: './public/uploads/' });

router.get('/', controller.getAll);

router.get('/create', ensureAuthenticated, controller.create);

router.post(
  '/create',
  upload.single('images'),
  ensureAuthenticated,
  controller.saveCreate
);

router.get('/edit/:article', ensureAuthenticated, controller.edit);

router.post('/edit/:article', ensureAuthenticated, controller.saveEdit);

router.get('/remove/:article', ensureAuthenticated, controller.remove);

// get theo tên param
router.param('article', function (req, res, next, articleId) {
  Article.findOne({ _id: articleId })
    .then(article => {
      if (!article) res.sendStatus(404);
      req.article = article;
      return next();
    })
    .catch(err => next(err));
});
module.exports = router;

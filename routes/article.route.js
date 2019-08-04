const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const controller = require('../controllers/article.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});
const upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

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
router.param('article', function (req, res, next, articleId) {
  Article.findById(articleId)
    .then(article => {
      if (!article) res.sendStatus(404);
      req.article = article;
      return next();
    })
    .catch(err => next(err));
});
module.exports = router;

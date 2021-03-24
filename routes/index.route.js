const express = require('express');
const router = express.Router();

const Category = require('../models/category.model');
const Article = require('../models/article.model');

const controller = require('../controllers/index.controller');

router.get('/', controller.index);

// router.get('/tag', async (req, res) => {
//   const articles = await Article.find();

//   let tag = [];

//   articles.forEach((ari) => tag.push(ari.tagList));

//   res.json({
//     post: articles,
//   });
// });

router.get('/:slug*.html', controller.category);

router.get('/:slugPost', controller.postDetail);

router.get(`/tag/:tag`, controller.tag);

module.exports = router;

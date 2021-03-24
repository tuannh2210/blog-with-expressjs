const Article = require('../models/article.model');
const Category = require('../models/category.model');
const moment = require('moment');

module.exports.index = async (req, res) => {
  const articles = await Article.find()
    .populate(['author', 'category'])
    .sort({ updatedAt: -1 })
    .skip(6)
    .limit(10);

  const newArticle = await Article.find()
    .populate('author category')
    .sort({ updatedAt: -1 })
    .limit(6);

  const trending = await Article.find()
    .sort({ view: -1 })
    .limit(5);

  const popular = trending;

  res.render('client/index', {
    articles,
    newArticle,
    trending,
    popular,
    moment
  });
};

module.exports.postDetail = async (req, res) => {
  let slug = req.params.slugPost;
  const article = await Article.findOne({ slug: slug }).populate(
    'author category'
  );

  await Article.findOneAndUpdate({slug:slug},{view: article.view + 1})

  if (article) {
    res.render('client/post-detail.pug', {
      article,
    });
  } else res.render('error');
};

module.exports.category = async (req, res) => {
  let slug = req.params.slug;
  const cate = await Category.findOne({ slug: slug });
  if (cate) {
    const articles = await Article.find({ category: cate._id })
      .populate(['author', 'category'])
      .sort({ updatedAt: -1 })
      .skip(6)
      .limit(10);

    const newArticle = await Article.find({ category: cate._id })
      .populate('author category')
      .sort({ updatedAt: -1 })
      .limit(6);

    const trending = await Article.find()
      .sort({ view: -1 })
      .limit(5);

    const popular = trending;
    res.render('client/category', {
      cate,
      articles,
      newArticle,
      trending,
      popular,
      moment
    });
  } else res.render('error');
};

module.exports.tag = async (req, res) => {
  const tag = req.params.tag;
  const article = await Article.find({tagList: tag})

  res.json(article)
}

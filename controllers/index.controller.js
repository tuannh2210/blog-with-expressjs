const Article = require('../models/article.model');
const Category = require('../models/category.model');
const moment = require('moment');

module.exports.index = async (req, res) => {
  const query = req.query.search;

  const articles = await Article.find()
    .populate(['author', 'category'])
    .sort({ updatedAt: -1 })
    .skip(6)
    .limit(10);

  const newArticle = await Article.find()
    .populate('author category')
    .sort({ updatedAt: -1 })
    .limit(6);

  const trending = await Article.find().sort({ view: -1 }).limit(5);

  if (query == undefined) {
    res.render('client/index', {
      articles,
      newArticle,
      trending,
      moment,
    });
  } else {

    const matchArticles = await Article.find({
      title: new RegExp(query.toLowerCase()),
    }).populate(['author', 'category']);

    res.render('client/result-article', {
      articles: matchArticles,
      title: 'Kết quả tìm kiếm',
      moment,
    });
  }
};

module.exports.postDetail = async (req, res) => {
  let slug = req.params.slugPost;
  const article = await Article.findOne({ slug: slug }).populate(
    'author category'
  );
  // const viewPage = article.view
  // const view = await Article.findOneAndUpdate(
  //   { slug: slug },
  //   { view: viewPage + 1 }
  // );

  if (article) {
    res.render('client/post-detail', {
      article,
      // view,
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

    const trending = await Article.find().sort({ view: -1 }).limit(5);

    res.render('client/category', {
      cate,
      articles,
      newArticle,
      trending,
      moment,
    });
  } else res.render('error');
};

module.exports.tag = async (req, res) => {
  const tag = req.params.tag;
  const articles = await Article.find({ tags: tag });

  res.render('client/result-article',{
    articles,
    title: `Các bài viết về ${tag}`,
    moment,
  })
};

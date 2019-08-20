const slug = require('slug');
const moment = require('moment');
const Article = require('../models/article.model');
const Category = require('../models/category.model');

module.exports.getAll = async function(req, res) {
  var page = parseInt(req.query.page || 1);
  var search = req.query.search || '';
  var perPage = 3;
  var articles = await Article.find({ title: { $regex: '.*' + search + '.*' } })
    .populate('author')
    .sort({ _id: -1 });
  var totalPage = Math.ceil(articles.length / perPage);
  var start = (page - 1) * perPage;
  var end = page * perPage;
  res.render('article/index', {
    articles: articles.slice(start, end),
    page,
    totalPage,
    search
  });
};

module.exports.detail = async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug
  }).populate('author');

  const date = moment(article.createdAt).format('DD/MM/YYYY');
  const pageViewCount = article.view;
  const conunt = parseInt(pageViewCount + 1) || 1;

  Article.update({ slug: req.params.slug }, { view: conunt }).then(() =>
    res.render('article/detail', {
      article: article,
      date: date,
      conunt: conunt
    })
  );
};

module.exports.create = async (req, res) => {
  const cates = await Category.find();
  res.render('article/create', { cates });
};

module.exports.saveCreate = (req, res) => {
  if (req.file == undefined || req.file == '') {
    req.body.images = req.body.image_old;
  } else {
    var pathImg = (req.body.images = req.file.path
      .replace(/\\/g, '/')
      .split('/')
      .slice(1)
      .join('/'));
  }

  const { title, body, description, images, category } = req.body;

  const article = new Article({
    title,
    body,
    description,
    images,
    category,
    author: req.user._id,
    view: 1
  });
  article
    .save()
    .then(() => {
      res.redirect('/posts');
    })
    .catch(err => res.send(err.message));
};

module.exports.edit = async (req, res) => {
  const article = await Article.findById(req.params.article).populate(
    'category'
  );
  const cates = await Category.find();

  if (article.author.toJSON() !== req.user._id.toJSON()) {
    req.flash('error_msg', 'Not Authorzed');
    res.redirect('back');
  }
  res.render('article/edit', {
    article: article,
    cates
  });
};

module.exports.saveEdit = (req, res) => {
  if (req.file) {
    var pathImg = (req.body.images = req.file.path
      .replace(/\\/g, '/')
      .split('/')
      .slice(1)
      .join('/'));
  } else {
    req.body.images = req.body.image_old;
  }
  const { title, body, description, images, category } = req.body;
  const data = {
    title,
    body,
    description,
    images,
    category,
    author: req.user._id,
    slug: slug(title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0)
  };

  Article.findByIdAndUpdate(req.params.article, data)
    .then(() => res.redirect('/posts'))
    .catch(err => res.json(err));
};

module.exports.remove = (req, res) => {
  if (req.article.author.toJSON() !== req.user._id.toJSON()) {
    req.flash('error_msg', 'Not Authorzed');
    res.redirect('back');
  } else {
    Article.remove({
      _id: req.params.article
    })
      .then(() => res.redirect('/posts'))
      .catch(err => res.json(err));
  }
};

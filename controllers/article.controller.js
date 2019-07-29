const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');
const slug = require('slug');

module.exports.getAll = async function(req, res) {
  var articles = await Article.find().populate('author');
  var page = parseInt(req.query.page || 1);
  var perPage = 3;
  var totalPage = articles.length / perPage;
  var start = (page - 1) * perPage;
  var end = page * perPage;
  res.render('article/index', {
    articles: articles.slice(start, end),
    page: page,
    totalPage: totalPage
  });
};

module.exports.create = (req, res) => {
  res.render('article/create');
};

module.exports.saveCreate = (req, res) => {
  if (req.file) {
    var pathImg = (req.body.images = req.file.path
      .replace(/\\/g, '/')
      .split('/')
      .slice(1)
      .join('/'));
  }
  const { title, body, description, images } = req.body;

  const article = new Article({
    title: title,
    body: body,
    description: description,
    images: images,
    author: req.user
  });

  article
    .save()
    .then(() => {
      res.redirect('/theads');
    })
    .catch(err => res.send(err.message));
};

module.exports.edit = (req, res) => {
  res.render('article/edit', {
    article: req.article
  });
};

module.exports.saveEdit = (req, res) => {
  const { title, body, description } = req.body;
  const data = {
    title: title,
    body: body,
    description: description,
    author: req.user,
    slug:
      slug(title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  };
  Article.findByIdAndUpdate(
    {
      _id: req.params.article
    },
    data
  )
    .then(() => res.redirect('/theads'))
    .catch(err => res.json(err));
};

module.exports.remove = (req, res) => {
  Article.findOneAndDelete({
    _id: req.params.article
  })
    .then(() => res.redirect('/theads'))
    .catch(err => res.json(err));
};

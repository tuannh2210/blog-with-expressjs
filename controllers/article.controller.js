const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');

module.exports.getAll = async function(req, res) {
  var articles = await Article.find();
  res.render('article/index', {
    articles: articles
  });
};

module.exports.create = (req, res) => {
  res.render('article/create');
};

module.exports.saveCreate = (req, res) => {
  const { title, body, description } = req.body;
  const article = new Article({
    title: title,
    body: body,
    description: description,
    author: req.user
  });
  article.save().then(() => {
    res.redirect('/theads');
  });
};

module.exports.edit = (req, res) => {
  res.render('article/edit', { article: req.article });
};

module.exports.saveEdit = (req, res) => {
  Article.findByIdAndUpdate({ _id: req.params.article }, req.body)
    .then(() => res.redirect('/theads'))
    .catch(err => res.json(err));
};

module.exports.remove = (req, res) => {
  Article.findOneAndDelete({ _id: req.params.article })
    .then(() => res.redirect('/theads'))
    .catch(err => res.json(err));
};

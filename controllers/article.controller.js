const fs = require('fs');
const slug = require('slug');
const moment = require('moment');
const Article = require('../models/article.model');
const Category = require('../models/category.model');

module.exports.getNew = (req, res, next) => {
  req.query.limit = 1;
  next();
};

module.exports.getAll = async (req, res) => {
  let itemperPage = req.query.limit * 1 || 3;
  let search = req.query.search || '';
  let page = req.query.page * 1 || 1;
  let start = (page - 1) * itemperPage;
  let end = page * itemperPage;

  let articles = await Article.find({ title: { $regex: '.*' + search + '.*' } })
    .populate('author')
    .populate('category')
    .sort({ _id: -1 });

  let totalPage = Math.ceil(articles.length / itemperPage);

  res.render('article/index', {
    host: `${req.protocol}://${req.get('host')}`,
    articles: articles.slice(start, end),
    page,
    totalPage,
    search,
  });
};

module.exports.create = async (req, res) => {
  const cates = await Category.find();
  res.render('article/create', { cates });
};

module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id).populate('category');
  const cates = await Category.find();

  if (article.author.toJSON() !== req.user._id.toJSON()) {
    req.flash('error_msg', 'Not Authorzed');
    res.redirect('back');
  }
  res.render('article/edit', {
    article,
    cates,
  });
};

module.exports.save = (req, res) => {
  let {title, body, description, category, tags, images, image_old } = req.body;
  let arrTag = [];

  req.file
    ? (images = req.file.path.replace(/\\/g, '/').split('/').slice(1).join('/'))
    : (images = image_old);

  for (item of JSON.parse(tags)) {
    arrTag.push(slug(item.value));
  }

  const data = {
    title,
    body,
    description,
    images,
    category,
    tags: arrTag,
    slug: slug(title) + '-' + ((Math.random() * 10000) | 0),
  };

  if (req.params.id) {
    Article.findByIdAndUpdate(req.params.id, data)
      .then(() => res.redirect('/posts'))
      .catch((err) => res.json({ Lỗi: err }));
  } else {
    const article = new Article({
      ...data,
      author: req.user,
      view: Math.floor(Math.random() * 999 + 100),
    });

    article
      .save()
      .then(() => {
        res.redirect('/posts');
      })
      .catch((err) => res.send(err.message));
  }
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id);

  if (article.author.toJSON() === req.user._id.toJSON()) {
    try {
      if (article.images !== undefined) {
        fs.unlinkSync(`public/${article.images}`);
      }
      article.remove();
      res.redirect('/posts');
    } catch (err) {
      res.json({ sss: err });
    }
  } else {
    req.flash('error_msg', 'Not Authorzed');
    res.redirect('back');
  }
};

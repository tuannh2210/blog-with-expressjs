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
  var itemperPage = req.query.limit * 1 || 3;
  var search = req.query.search || '';
  var page = req.query.page * 1 || 1;
  var start = (page - 1) * itemperPage;
  var end = page * itemperPage;

  var articles = await Article.find({ title: { $regex: '.*' + search + '.*' } })
    .populate('author').populate('category')
    .sort({ _id: -1 });
  var totalPage = Math.ceil(articles.length / itemperPage);

  res.render('article/index', {
    host: `${req.protocol}://${req.get('host')}`,
    articles: articles.slice(start, end),
    page,
    totalPage,
    search,
  });
};

module.exports.detail = async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug,
  }).populate('author').populate('category')

  const date = moment(article.createdAt).format('DD/MM/YYYY');
  const pageViewCount = article.view;
  const conunt = parseInt(pageViewCount + 1) || 1;

  Article.update({ slug: req.params.slug }, { view: conunt }).then(() =>
    res.render('article/detail', {
      article,
      date,
      conunt,
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

  const { title, body, description, images, category, tag } = req.body;

  console.log(tag)

  const article = new Article({
    title,
    body,
    description,
    images,
    category,
    author: req.user,
    view:Math.floor(Math.random() * 999 + 100),
    tagList: tag.split(' ').filter(item => item.length > 0)
  });
  article
    .save()
    .then(() => {
      res.redirect('/posts');
    })
    .catch((err) => res.send(err.message));
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
    slug: slug(title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0),
  };
  
  Article.findByIdAndUpdate(req.params.id, data)
    .then(() => res.redirect('/posts'))
    .catch((err) => res.json({ Lỗi: err }));
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id);
  
  if (article.author.toJSON() === req.user._id.toJSON()) {
    try {
      if(article.images !== undefined){
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

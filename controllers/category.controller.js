const Category = require('../models/category.model');
const Article = require('../models/article.model');
const slug = require('slug');

module.exports.getAll = async (req, res) => {
  var page = parseInt(req.query.page || 1);
  var search = req.query.search || '';
  var perPage = 3;

  var cates = await Category.find({ name: { $regex: '.*' + search + '.*' } });
  var totalPage = Math.ceil(cates.length / perPage);
  var start = (page - 1) * perPage;
  var end = page * perPage;
  res.render('category/index', {
    cates: cates.slice(start, end),
    page,
    totalPage,
    search,
  });
};

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const cate = await Category.findOne({ slug: slug });
  const articles = await Article.find({ category: cate._id }).populate([
    'author',
    'category',
  ]);
  res.render('category/article', { articles: articles });
};

module.exports.create = (req, res) => {
  res.render('category/create');
};

module.exports.saveCreate = async (req, res) => {
  const { name, description } = req.body;
  Category.create({ name, description });
  res.redirect('/categories');
};

module.exports.edit = (req, res) => {
  res.render('category/edit', { cate: req.params.cateId });
};

module.exports.saveEdit = (req, res) => {
  const { name, description } = req.body;
  const data = {
    name,
    description,
    slug: slug(name),
  };

  Category.findByIdAndUpdate(req.params.cateId, data).then(() =>
    res.redirect('/categories')
  );
};

module.exports.remove = async (req, res) => {
  const cateId = req.params.cateId;
  const articles = await Article.find({ category: cateId });
  articles.forEach((item) => item.remove());
  try {
    Category.remove({ _id: cateId });
    res.redirect('/categories');
  } catch (err) {
    res.json(err);
  }
};

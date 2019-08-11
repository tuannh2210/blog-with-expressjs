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
    search
  });
};

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const cate = await Category.findOne({ slug: slug });
  const articles = await Article.find({ category: cate._id }).populate([
    'author',
    'category'
  ]);
  res.render('category/article', { articles: articles });
};

module.exports.create = (req, res) => {
  res.render('category/create');
};

module.exports.saveCreate = (req, res) => {
  const { name, description } = req.body;
  const category = new Category({
    name,
    description
  });

  category.save().then(() => {
    res.redirect('/cates');
  });
};

module.exports.edit = (req, res) => {
  res.render('category/edit', { cate: req.cate });
};

module.exports.saveEdit = (req, res) => {
  const { name, description } = req.body;
  const data = {
    name,
    description,
    slug: slug(name)
  };
  Category.findByIdAndUpdate(req.params.cateId, data).then(() =>
    res.redirect('/cates')
  );
};
module.exports.remove = async (req, res) => {
  Category.remove({ _id: req.params.cateId })
    .then(() => res.redirect('/cates'))
    .catch(err => res.json(err));
};

const Category = require('../models/category.model');
const Article = require('../models/article.model');

module.exports.menu = async (req, res, next) => {
  const menu = await Category.find();
  res.locals.menu = menu;
  next();
};

module.exports.popular = async (req, res, next) => {
  const popular = await Article.find().sort({ view: -1 }).populate('author').limit(5);
  res.locals.popular = popular;
  next();
};
const Category = require('../models/category.model');
const Article = require('../models/article.model');

module.exports.menu = async (req, res, next) => {
  const menu = await Category.find();
  res.locals.menu = menu;
  next();
};

module.exports.popular = async (req, res, next) => {
  const popular = await Article.find()
    .sort({ view: -1 })
    .populate(['author', 'category'])
    .limit(4);
  res.locals.popular = popular;
  next();
};

module.exports.tagList = async (req, res, next) => {
  const articles = await Article.find();
  const arrTag = [];

  for (article of articles) {
    arrTag.push(article.tags);
  }
  tagList = [...new Set(arrTag.flat(Infinity))].slice(0, 20); 
  res.locals.tagList = tagList;
  next();
};

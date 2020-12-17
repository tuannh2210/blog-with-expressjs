const Category = require('../models/category.model');

module.exports.menu = async (req, res,next) => {
  const menu = await Category.find();
  res.locals.menu = menu;
  next()
}



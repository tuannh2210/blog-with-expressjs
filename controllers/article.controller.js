const mongoose = require('mongoose');
const User =  mongoose.model('User');
const Article = require('../models/article.model');

module.exports.getAll = async function(req, res){
  var articles = await Article.find();
  res.render('article/index' ,{
    articles: articles
  })
}

module.exports.createPost = ((req, res) => {
  res.render('article/create')
})

module.exports.saveCreate = ((req, res) => {
  const {title, body, description} = req.body;
  const article = new Article({
    title: title,
    body: body,
    description: description,
    // author: req.user._id
  });
  article.save().then(() => {
      res.redirect('/theads')
      // return res.json({article: article.toJSONFor(user)});
  });
});

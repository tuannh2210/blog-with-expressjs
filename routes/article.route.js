const router =  require('express').Router();

const controller = require('../controllers/article.controller');
const {ensureAuthenticated} = require('../middlewares/auth.middleware')

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = require('../models/article.model');

router.get('/', controller.getAll);

router.get('/create', ensureAuthenticated, controller.createPost)

router.post('/create', ensureAuthenticated, controller.saveCreate)




router.param('article', function(req, res, next, slug){
	Article.findOne({slug:slug})
	.then(article => {
		if(!article) { return res.sendStatus(404); }

		req.article = article;

		return next();
	}).catch(next())
});

module.exports = router

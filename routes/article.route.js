const express = require('express');
const router = express.Router();

const controller = require('../controllers/article.controller');

const upload = require('../middlewares/upload.middleware');

router.get('/', controller.getAll);

router.get('/create', controller.create);

router.post('/create', upload.single('images'), controller.save);

router.get('/edit/:id', controller.edit);

router.post('/edit/:id', upload.single('images'), controller.save);

router.get('/remove/:id', controller.remove);

module.exports = router;

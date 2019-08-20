require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const { ensureAuthenticated } = require('./middlewares/auth.middleware');
const logger = require('./middlewares/logger.middleware');
const session = require('./middlewares/session.middleware');
// create app
const app = express();
// passport config
require('./config/passport')(passport);

app.use(logger);
//connet mongoose
mongoose.connect(process.env.MONGO_URL);
// routes
const authRouter = require('./routes/auth.route');
const articleRouter = require('./routes/article.route');
const categoryRouter = require('./routes/category.route');
const indexRouter = require('./routes/index.route');

// pug template
app.set('view engine', 'pug');
app.set('views', './views');

// middewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session());

// psssport middewares
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// // set up route

app.use('/posts', articleRouter);
app.use('/cates', categoryRouter);
app.use('/', authRouter);
app.use('/', indexRouter);

app.use(express.static('public'));

app.use('*', (req, res) => {
  res.send('Not found');
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listenning on port ${port}`));

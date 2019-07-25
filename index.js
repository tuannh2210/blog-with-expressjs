require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const passport = require('passport');

const { ensureAuthenticated } = require('./middlewares/auth.middleware');

// create app
const app = express();
// passport config
require('./config/passport')(passport);

//connet mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`Connetion mongodb successfull`))
  .catch(err => console.log('Connetion error'));
// routes
const authRouter = require('./routes/auth.route');
const articleRouter = require('./routes/article.route');
// pug template
app.set('view engine', 'pug');
app.set('views', './views');
// middewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

// section
const IN_PROD = process.env.NODE_ENV === 'production';
const GMT = 1000 * 60 * 60 * 7;
app.use(
  session({
    name: 'sessionId',
    secret: 'SESS_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: null,
      sameSite: true,
      secure: IN_PROD
    }
  })
);

app.use(cookieParser());

// psssport middewares
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// app.use(function ( req, res, next) {
//   console.log(new Date(), req.method, req.path);
//   next()
// })

// set up route
app.use('/', authRouter);
app.use('/theads', articleRouter);

app.use('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard');
});

app.use(express.static('public'));

const post = 3000;

app.listen(post, () => console.log(`listenning on port ${post}`));

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const passport = require('passport');

const authMiddlewares = require('./middlewares/auth.middleware')

// create app
const app = express();
// passport config
require('./config/passport')(passport)
// setup env
dotenv.config()
//connet mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log(`Connetion mongodb successfull`))
.catch(err => console.log('Connetion error'))
// routes
const authRouter = require('./routes/auth.route');
const createError = require('http-errors')
// pug template
app.set('view engine', 'pug');
app.set('views', './views');
// middewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

app.use(session({
  store: new FileStore(),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}))

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
  res.cookie('session', req.sessionID)
  next();
});

// set up route
app.use('/',authRouter);

app.use(express.static('public'))

const post = 3000;

app.listen(post, () => console.log(`listenning on port ${post}`))

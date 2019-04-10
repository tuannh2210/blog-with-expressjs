const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const validate = require('./validate/user.validate')
const controller = require('./controllers/auth.controller')
// create app
const app = express();
// setup env
dotenv.config()
//connet mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log(`Connetion mongodb successfull`))
.catch(err => console.log('Connetion error'))
// routes
const authRouter = require('./routes/auth.route');

// pug template
app.set('view engine', 'pug');
app.set('views', './views');
// middewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}))

// set up route
app.use('/',authRouter);
//
const post = 3000;

app.listen(post, () => console.log(`listenning on port ${post}`))

require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//connet mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log(`Connetion mongodb successfull`))
.catch(err => console.log('Connetion error'))
// routes
const authRouter = require('./routes/auth.route');

// pug template
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

app.use('/', authRouter);
//
app.get('*',(req, res) => {
  res.send('1')
})

const post = 3000;

app.listen(post, () => console.log(`listenning on port ${post}`))

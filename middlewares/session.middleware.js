const expressSession = require('express-session');

const IN_PROD = process.env.NODE_ENV === 'production';
const MILLISECONDS_IN_A_HOUSE = 1000 * 60 * 60;
const GMT = 7;
const TIME = MILLISECONDS_IN_A_HOUSE * (2 + GMT);

const session = () => {
  return expressSession({
    name: 'sessionId',
    secret: 'SESS_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: TIME,
      sameSite: true,
      secure: IN_PROD,
    },
  });
};

module.exports = session;

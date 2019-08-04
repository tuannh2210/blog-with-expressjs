const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

const IN_PROD = process.env.NODE_ENV === 'production';
const MILLISECONDS_IN_A_HOUSE = 1000 * 60 * 60;
const GMT = 7;
const TIME = MILLISECONDS_IN_A_HOUSE * (2 + GMT);

const session = (req, res, next) => {
  return expressSession({
    store: new FileStore(),
    name: 'sessionId',
    secret: 'SESS_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: TIME,
      sameSite: true,
      secure: IN_PROD
    }
  });
};

module.exports = session;

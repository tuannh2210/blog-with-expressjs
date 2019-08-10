const moment = require('moment');
const fs = require('fs');

const logger = (req, res, next) => {

  const log = moment().format('DD/MM/YYYY hh:mm:ss') + ' --> ' + req.protocol + ':// ' + req.get('host') +
    req.originalUrl + ':' + '\n'

  fs.writeFileSync('./logger.log', log, { flag: 'a+' });
  next();
};

module.exports = logger;

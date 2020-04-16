const moment = require('moment');
const fs = require('fs');

const logger = (req, res, next) => {

  const date = moment().format('DD/MM/YYYY HH:mm:ss')
  const protocol = req.protocol
  const host = req.get('host')
  const url = req.originalUrl
  
  const log = `${date} --> ${protocol}://${host}${url} \n`

  fs.writeFileSync('./logger.log', log, { flag: 'a+' });
  next();
};

module.exports = logger;

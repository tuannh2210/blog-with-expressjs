const {port} = require('./config');
const app = require('./app');

app.listen(port, () => console.log(`listenning on port ${port}`))
  .on('error', e => console.error(e));
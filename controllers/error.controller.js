module.exports = (err, req, res, next) => {
  err.statusCode = res.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack : err.stack
  });
};

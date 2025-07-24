function requestLogger(req, res, next) {
  req._startTime = new Date();
  console.log(`[${req._startTime.toISOString()}] ${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    const status = res.statusCode;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}`);
  });
  next();
}

module.exports = {
  requestLogger,
}; 
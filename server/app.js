var express = require('express');
var path = require('path');
var { requestLogger } = require('./utils/logger');

var indexRouter = require('./routes/index');
var stocksRouter = require('./routes/stocks');

var app = express();

// Log every request (method, url, timestamp)
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/stocks', stocksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ error: 'Not found' });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

require('dotenv-flow').config();
var express = require('express');
var path = require('path');
var { requestLogger } = require('./utils/logger');
var cors = require('cors');

var indexRouter = require('./routes/index');
var stocksRouter = require('./routes/stocks');

var app = express();

// Allow only the origins specified in ALLOWED_ORIGINS env variable (comma-separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

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

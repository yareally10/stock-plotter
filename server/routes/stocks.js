const express = require('express');
const StockService = require('../services/StockService');
const router = express.Router();

// GET /stocks - list all stock tickers (filenames without extension)
router.get('/', (req, res) => {
  StockService.getAllTickers((err, tickers) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read processed directory' });
    }
    res.json({ stocks: tickers });
  });
});

// GET /stocks/:ticker/prices - return all available stock price data (date and close)
router.get('/:ticker/prices', (req, res) => {
  const ticker = req.params.ticker;
  StockService.getStockPrice(ticker, (err, prices) => {
    if (err) {
      return res.status(404).json({ error: 'Stock data not found' });
    }
    res.json({ prices });
  });
});

// GET /stocks/:ticker - return paginated JSON data from the stock's CSV file
router.get('/:ticker', (req, res) => {
  const ticker = req.params.ticker;
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 24;
  StockService.getPaginatedStockData(ticker, page, pageSize, (err, result) => {
    if (err) {
      if (err.message === 'Invalid page number') {
        return res.status(400).json({ error: 'Invalid page number' });
      }
      return res.status(404).json({ error: 'Stock data not found' });
    }
    res.json(result);
  });
});

module.exports = router; 
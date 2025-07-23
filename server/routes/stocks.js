const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// GET /stocks - list all stock tickers (filenames without extension)
router.get('/', (req, res) => {
  const processedDir = path.join(__dirname, '../data/processed');
  fs.readdir(processedDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read processed directory' });
    }
    // Filter for .csv files and strip extension
    const tickers = files
      .filter(file => path.extname(file) === '.csv')
      .map(file => path.basename(file, '.csv'));
    res.json({ stocks: tickers });
  });
});

// GET /stocks/:ticker - return paginated JSON data from the stock's CSV file
router.get('/:ticker', (req, res) => {
  const ticker = req.params.ticker;
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 24;
  const csvPath = path.join(__dirname, '../data/processed', `${ticker}.csv`);

  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Stock data not found' });
    }
    const lines = data.trim().split('\n');
    const headers = lines[0].split('|');
    const rows = lines.slice(1).map(line => {
      return line.split('|');
    });
    const totalItems = rows.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
    const startIdx = (page - 1) * pageSize;
    const paginatedRows = rows.slice(startIdx, startIdx + pageSize);
    const result = paginatedRows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: result
    });
  });
});

module.exports = router; 
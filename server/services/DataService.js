const fs = require('fs');
const path = require('path');

const PROCESSED_DIR = path.join(__dirname, '../data/processed');

class DataService {
  static getStocksFromFile(callback) {
    fs.readdir(PROCESSED_DIR, (err, files) => {
      if (err) return callback(err);
      // Only return .csv files (without extension)
      const tickers = files
        .filter(file => path.extname(file) === '.csv')
        .map(file => path.basename(file, '.csv'))
        .sort((a, b) => a.localeCompare(b));
      callback(null, tickers);
    });
  }

  static getPaginatedStockDataFromFile(ticker, page = 1, pageSize = 24, callback) {
    const csvPath = path.join(PROCESSED_DIR, `${ticker}.csv`);
    fs.readFile(csvPath, 'utf8', (err, data) => {
      if (err) return callback(err);
      const lines = data.trim().split('\n');
      const headers = lines[0].split('|');
      const rows = lines.slice(1).map(line => line.split('|'));
      // Sort rows by date descending (assume 'Date' is the first header)
      const dateIdx = headers.indexOf('Date');
      rows.sort((a, b) => (a[dateIdx] < b[dateIdx] ? 1 : a[dateIdx] > b[dateIdx] ? -1 : 0));
      const totalItems = rows.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      if (page < 1 || page > totalPages) {
        return callback(new Error('Invalid page number'));
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
      callback(null, {
        page,
        pageSize,
        totalItems,
        totalPages,
        data: result
      });
    });
  }
}

module.exports = DataService; 
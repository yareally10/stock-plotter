const DataService = require('./DataService');

class StockService {
  static getAllTickers(callback) {
    DataService.getStocksFromFile(callback);
  }

  static getPaginatedStockData(ticker, page = 1, pageSize = 24, callback) {
    DataService.getPaginatedStockDataFromFile(ticker, page, pageSize, callback);
  }

  static getStockPrice(ticker, callback) {
    // Use a very large pageSize to get all data in one call
    DataService.getPaginatedStockDataFromFile(ticker, 1, Number.MAX_SAFE_INTEGER, (err, result) => {
      if (err) return callback(err);
      // Extract date and closing price from each row
      const prices = result.data.map(row => ({
        date: row['Date'],
        close: row['Close']
      }));
      callback(null, prices);
    });
  }
}

module.exports = StockService; 
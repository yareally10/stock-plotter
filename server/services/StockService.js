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
      let startDate = null, endDate = null, priceChange = null, startPrice = null, endPrice = null, changePercentage = null;
      if (prices.length > 0) {
        // Data is sorted descending by date, so last is oldest, first is newest
        startDate = prices[prices.length - 1].date;
        endDate = prices[0].date;
        const startClose = parseFloat(prices[prices.length - 1].close);
        const endClose = parseFloat(prices[0].close);
        if (!isNaN(startClose) && !isNaN(endClose)) {
          priceChange = endClose - startClose;
          changePercentage = ((endClose - startClose) / startClose) * 100;
          startPrice = startClose;
          endPrice = endClose;
        }
      }
      callback(null, { prices, startDate, endDate, priceChange, changePercentage, startPrice, endPrice });
    });
  }
}

module.exports = StockService; 
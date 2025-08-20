const DataService = require('./DataService');

class StockService {
  static getAllTickers(callback) {
    DataService.getStocksFromFile(callback);
  }

  static getPaginatedStockData(ticker, page = 1, pageSize = 24, callback) {
    DataService.getPaginatedStockDataFromFile(ticker, page, pageSize, callback);
  }

  static getStockPrice(ticker, durationMonths = 60, callback) {
    // Validate duration first
    const pageSize = Number.isFinite(durationMonths) && durationMonths > 0
      ? Math.floor(durationMonths)
      : 60;

    // Request only the most recent N months using pageSize = durationMonths
    DataService.getPaginatedStockDataFromFile(ticker, 1, pageSize, (err, result) => {
      if (err) return callback(err);
      // Extract date and closing price from each row
      const prices = result.data.map(row => ({
        date: row['Date'],
        close: row['Close']
      }));
      let startDate = null, endDate = null, priceChange = null, startPrice = null, endPrice = null, changePercentage = null;
      if (prices.length > 0) {
        // Descending order: last is oldest within the window, first is newest
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
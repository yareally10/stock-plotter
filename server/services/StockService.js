const DataService = require('./DataService');

class StockService {
  static getAllTickers(callback) {
    DataService.getStocksFromFile(callback);
  }

  static getPaginatedStockData(ticker, page = 1, pageSize = 24, callback) {
    DataService.getPaginatedStockDataFromFile(ticker, page, pageSize, callback);
  }

  static getStockPrice(ticker, durationMonths = 60, callback) {
    // Use a very large pageSize to get all data in one call
    DataService.getPaginatedStockDataFromFile(ticker, 1, Number.MAX_SAFE_INTEGER, (err, result) => {
      if (err) return callback(err);
      // Extract date and closing price from each row
      const prices = result.data.map(row => ({
        date: row['Date'],
        close: row['Close']
      }));
      // Data is sorted descending by date (newest first). Limit to requested duration (most recent N months)
      const limit = Number.isFinite(durationMonths) && durationMonths > 0 ? Math.floor(durationMonths) : 60;
      const limitedPrices = prices.slice(0, limit);
      let startDate = null, endDate = null, priceChange = null, startPrice = null, endPrice = null, changePercentage = null;
      if (limitedPrices.length > 0) {
        // Descending order: last is oldest within the window, first is newest
        startDate = limitedPrices[limitedPrices.length - 1].date;
        endDate = limitedPrices[0].date;
        const startClose = parseFloat(limitedPrices[limitedPrices.length - 1].close);
        const endClose = parseFloat(limitedPrices[0].close);
        if (!isNaN(startClose) && !isNaN(endClose)) {
          priceChange = endClose - startClose;
          changePercentage = ((endClose - startClose) / startClose) * 100;
          startPrice = startClose;
          endPrice = endClose;
        }
      }
      callback(null, { prices: limitedPrices, startDate, endDate, priceChange, changePercentage, startPrice, endPrice });
    });
  }
}

module.exports = StockService; 
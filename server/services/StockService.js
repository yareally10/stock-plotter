const DataService = require('./DataService');

class StockService {
  static getAllTickers(callback) {
    DataService.getStocksFromFile(callback);
  }

  static getPaginatedStockData(ticker, page = 1, pageSize = 24, callback) {
    DataService.getPaginatedStockDataFromFile(ticker, page, pageSize, callback);
  }

  // Private helper: fetch the most recent prices (descending by date) and return prices array
  static _fetchRecentPrices(ticker, durationMonths) {
    const pageSize = Number.isFinite(durationMonths) && durationMonths > 0
      ? Math.floor(durationMonths)
      : 60;
    return new Promise((resolve, reject) => {
      DataService.getPaginatedStockDataFromFile(ticker, 1, pageSize, (err, result) => {
        if (err) return reject(err);
        const prices = (result.data || []).map(row => ({
          date: row['Date'],
          close: row['Close']
        }));
        resolve(prices);
      });
    });
  }

  static getStockPrice(ticker, durationMonths = 60, callback) {
    // Retrieve prices via util (promise) and return via callback
    StockService._fetchRecentPrices(ticker, durationMonths)
      .then(prices => {
        let startDate = null, endDate = null, priceChange = null, startPrice = null, endPrice = null, changePercentage = null;
        if (prices && prices.length > 0) {
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

        callback(null, { prices: prices || [], startDate, endDate, priceChange, changePercentage, startPrice, endPrice });
      })
      .catch(err => callback(err));
  }
}

module.exports = StockService; 
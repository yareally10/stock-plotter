const StockService = require('./StockService');
const DataService = require('./DataService');

jest.mock('./DataService');

describe('StockService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTickers', () => {
    it('should return tickers from DataService', done => {
      DataService.getStocksFromFile.mockImplementation(cb => {
        cb(null, ['AAPL', 'GOOG']);
      });
      StockService.getAllTickers((err, tickers) => {
        expect(err).toBeNull();
        expect(tickers).toEqual(['AAPL', 'GOOG']);
        done();
      });
    });

    it('should handle DataService error', done => {
      DataService.getStocksFromFile.mockImplementation(cb => {
        cb(new Error('fail'));
      });
      StockService.getAllTickers((err, tickers) => {
        expect(err).toBeInstanceOf(Error);
        expect(tickers).toBeUndefined();
        done();
      });
    });
  });

  describe('getPaginatedStockData', () => {
    it('should return paginated stock data from DataService', done => {
      const result = { page: 1, pageSize: 2, totalItems: 3, totalPages: 2, data: [{ Date: '2024-01-01', Close: '100' }] };
      DataService.getPaginatedStockDataFromFile.mockImplementation((ticker, page, pageSize, cb) => {
        cb(null, result);
      });
      StockService.getPaginatedStockData('AAPL', 1, 2, (err, res) => {
        expect(err).toBeNull();
        expect(res).toEqual(result);
        done();
      });
    });

    it('should handle DataService error', done => {
      DataService.getPaginatedStockDataFromFile.mockImplementation((ticker, page, pageSize, cb) => {
        cb(new Error('not found'));
      });
      StockService.getPaginatedStockData('AAPL', 1, 2, (err, res) => {
        expect(err).toBeInstanceOf(Error);
        expect(res).toBeUndefined();
        done();
      });
    });
  });

  describe('getStockPrice', () => {
    it('should return all date and close prices, startPrice, and endPrice', done => {
      const result = {
        data: [
          { Date: '2024-01-02', Close: '110', Open: '105' },
          { Date: '2024-01-01', Close: '100', Open: '90' }
        ]
      };
      DataService.getPaginatedStockDataFromFile.mockImplementation((ticker, page, pageSize, cb) => {
        cb(null, result);
      });
      StockService.getStockPrice('AAPL', (err, res) => {
        expect(err).toBeNull();
        expect(res.prices).toEqual([
          { date: '2024-01-02', close: '110' },
          { date: '2024-01-01', close: '100' }
        ]);
        // Data is sorted descending by date, so startDate is last, endDate is first
        expect(res.startDate).toBe('2024-01-01');
        expect(res.endDate).toBe('2024-01-02');
        expect(res.priceChange).toBe(10);
        expect(res.changePercentage).toBe(10);
        expect(res.startPrice).toBe(100);
        expect(res.endPrice).toBe(110);
        done();
      });
    });

    it('should handle DataService error', done => {
      DataService.getPaginatedStockDataFromFile.mockImplementation((ticker, page, pageSize, cb) => {
        cb(new Error('not found'));
      });
      StockService.getStockPrice('AAPL', (err, res) => {
        expect(err).toBeInstanceOf(Error);
        expect(res).toBeUndefined();
        done();
      });
    });
  });
}); 
const DataService = require('./DataService');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('DataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStocksFromFile', () => {
    it('should return tickers from csv files in ascending order', done => {
      fs.readdir.mockImplementation((dir, cb) => {
        cb(null, ['GOOG.csv', 'AAPL.csv', 'README.txt']);
      });
      DataService.getStocksFromFile((err, tickers) => {
        expect(err).toBeNull();
        expect(tickers).toEqual(['AAPL', 'GOOG']); // sorted ascending
        done();
      });
    });

    it('should handle fs.readdir error', done => {
      fs.readdir.mockImplementation((dir, cb) => {
        cb(new Error('fail'));
      });
      DataService.getStocksFromFile((err, tickers) => {
        expect(err).toBeInstanceOf(Error);
        expect(tickers).toBeUndefined();
        done();
      });
    });
  });

  describe('getPaginatedStockDataFromFile', () => {
    const csvData = 'Date|Close\n2024-01-01|100\n2024-01-03|120\n2024-01-02|110';
    it('should return paginated stock data sorted by date descending', done => {
      fs.readFile.mockImplementation((file, enc, cb) => {
        cb(null, csvData);
      });
      DataService.getPaginatedStockDataFromFile('AAPL', 1, 3, (err, result) => {
        expect(err).toBeNull();
        expect(result.data.map(row => row.Date)).toEqual(['2024-01-03', '2024-01-02', '2024-01-01']); // sorted descending
        done();
      });
    });

    it('should handle file not found', done => {
      fs.readFile.mockImplementation((file, enc, cb) => {
        cb(new Error('not found'));
      });
      DataService.getPaginatedStockDataFromFile('AAPL', 1, 2, (err, result) => {
        expect(err).toBeInstanceOf(Error);
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should handle invalid page number', done => {
      fs.readFile.mockImplementation((file, enc, cb) => {
        cb(null, csvData);
      });
      DataService.getPaginatedStockDataFromFile('AAPL', 5, 2, (err, result) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid page number');
        expect(result).toBeUndefined();
        done();
      });
    });
  });
}); 
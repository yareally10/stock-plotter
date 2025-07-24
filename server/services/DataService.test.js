const DataService = require('./DataService');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('DataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStocksFromFile', () => {
    it('should return tickers from csv files', done => {
      fs.readdir.mockImplementation((dir, cb) => {
        cb(null, ['AAPL.csv', 'GOOG.csv', 'README.txt']);
      });
      DataService.getStocksFromFile((err, tickers) => {
        expect(err).toBeNull();
        expect(tickers).toEqual(['AAPL', 'GOOG']);
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
    const csvData = 'Date|Close\n2024-01-01|100\n2024-01-02|110\n2024-01-03|120';
    it('should return paginated stock data', done => {
      fs.readFile.mockImplementation((file, enc, cb) => {
        cb(null, csvData);
      });
      DataService.getPaginatedStockDataFromFile('AAPL', 1, 2, (err, result) => {
        expect(err).toBeNull();
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(2);
        expect(result.totalItems).toBe(3);
        expect(result.totalPages).toBe(2);
        expect(result.data.length).toBe(2);
        expect(result.data[0]).toEqual({ Date: '2024-01-01', Close: '100' });
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
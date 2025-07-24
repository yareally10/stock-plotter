# Stock Plotter Server

This is the backend server for the Stock Plotter application. It is built with Express.js and serves stock data from CSV files.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The server will run on port 3001 by default.

## Folder Structure

- `data/processed/` — Contains processed stock CSV files (e.g., `aapl.csv`).
  - Columns: Date, Open, High, Low, Close, Adj. Close, Change, Volume
- `routes/` — Express route handlers.

## API Endpoints

### List All Stock Tickers
- **GET** `/stocks`
- Returns a list of all available stock tickers (filenames without extension) in `data/processed`.
- **Response Example:**
  ```json
  { "stocks": ["aapl", "msft", ...] }
  ```

### Get Paginated Stock Data
- **GET** `/stocks/:ticker?page=1`
- Returns paginated JSON data for the specified stock ticker from its CSV file.
- **Query Parameters:**
  - `page` (optional, default: 1): Page number (24 items per page)
- **Response Example:**
  ```json
  {
    "page": 1,
    "pageSize": 24,
    "totalItems": 100,
    "totalPages": 5,
    "data": [
      { "Date": "Jul 2025", "Open": "206.67", ... },
      ...
    ]
  }
  ```

## Notes
- Place your processed stock CSV files in `data/processed/`.
- The server expects each CSV to have a header row.

## License
MIT 
# Stock Plotter - Server Application

A Node.js/Express backend server that provides REST API endpoints for stock data visualization. The server processes CSV stock data files and serves them to the frontend client application.

## Features

- **RESTful API**: Clean endpoints for stock data retrieval
- **Data Processing**: Converts raw stock data to processed CSV format
- **Pagination**: Efficient data delivery with pagination support
- **Service Architecture**: Separated business logic and data access layers
- **Request Logging**: Global middleware for API request monitoring
- **Unit Testing**: Comprehensive test coverage for service layers

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Prepare data files:**
   ```bash
   # Create data directories if they don't exist
   mkdir -p data/raw data/processed
   ```

4. **Convert raw data to processed format:**
   ```bash
   node scripts/convertRawToProcessed.js
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The server will run on port 3001 by default.

### Development

```bash
# Start with nodemon for development
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test services/StockService.test.js
```

## API Routes

### Stock Data Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/stocks` | Get all available stock tickers | `{ "stocks": ["aapl", "msft", ...] }` |
| `GET` | `/stocks/:ticker` | Get paginated stock data | `{ page, pageSize, totalItems, totalPages, data: [...] }` |
| `GET` | `/stocks/:ticker/prices` | Get all price data for charting | `{ prices: [...], startDate, endDate, priceChange, startPrice, endPrice, changePercentage }` |

### Query Parameters

#### `/stocks/:ticker`
- `page` (optional, default: 1): Page number
- `pageSize` (optional, default: 24): Items per page

### Response Examples

#### Stock List
```json
{
  "stocks": ["aapl", "msft", "googl", "amzn"]
}
```

#### Paginated Stock Data
```json
{
  "page": 1,
  "pageSize": 24,
  "totalItems": 100,
  "totalPages": 5,
  "data": [
    {
      "Date": "2024-01-15",
      "Open": "206.67",
      "High": "208.45",
      "Low": "205.12",
      "Close": "207.23",
      "Adj. Close": "207.23",
      "Change": "0.56",
      "Volume": "12345678"
    }
  ]
}
```

#### Stock Price Data
```json
{
  "prices": [
    { "date": "2024-01-15", "close": "207.23" },
    { "date": "2024-01-14", "close": "206.67" }
  ],
  "startDate": "2023-01-01",
  "endDate": "2024-01-15",
  "priceChange": 15.67,
  "startPrice": 191.56,
  "endPrice": 207.23,
  "changePercentage": 8.18
}
```

## Data Format

### Raw Data Format (`data/raw/`)

Raw stock data files should be placed in `data/raw/` with `.raw` extension:

```
data/raw/
├── aapl.raw
├── msft.raw
├── googl.raw
└── ...
```

**Raw file format:**
- Tab or pipe (`|`) separated values
- First row contains headers
- Date format: `MMM YYYY` (e.g., "Jan 2024", "Dec 2023")
- Example:
  ```
  Date|Open|High|Low|Close|Adj. Close|Change|Volume
  Jan 2024|206.67|208.45|205.12|207.23|207.23|0.56|12345678
  Dec 2023|205.11|206.89|204.23|206.67|206.67|1.56|9876543
  ```

### Processed Data Format (`data/processed/`)

Processed files are automatically generated in `data/processed/` with `.csv` extension:

```
data/processed/
├── aapl.csv
├── msft.csv
├── googl.csv
└── ...
```

**Processed file format:**
- Pipe (`|`) separated values
- Standardized date format: `YYYY-MM-DD`
- Same column structure as raw files
- Example:
  ```
  Date|Open|High|Low|Close|Adj. Close|Change|Volume
  2024-01-01|206.67|208.45|205.12|207.23|207.23|0.56|12345678
  2023-12-01|205.11|206.89|204.23|206.67|206.67|1.56|9876543
  ```

## Data Processing

### Converting Raw to Processed Data

The server includes a script to convert raw data files to the processed format:

```bash
node scripts/convertRawToProcessed.js
```

**What the script does:**
1. Reads all `.raw` files from `data/raw/`
2. Converts date format from `MMM YYYY` to `YYYY-MM-DD`
3. Outputs processed files to `data/processed/`
4. Maintains pipe-separated format
5. Preserves all other data columns

### Adding New Stock Data

1. **Add raw data file:**
   ```bash
   # Place your .raw file in data/raw/
   cp your_stock_data.raw data/raw/ticker.raw
   ```

2. **Convert to processed format:**
   ```bash
   node scripts/convertRawToProcessed.js
   ```

3. **Restart server:**
   ```bash
   npm start
   ```

## Project Structure

```
server/
├── data/
│   ├── raw/              # Raw stock data files (.raw)
│   └── processed/        # Processed CSV files (.csv)
├── routes/
│   ├── index.js          # Main route handler
│   └── stocks.js         # Stock-specific routes
├── services/
│   ├── StockService.js   # Business logic layer
│   ├── DataService.js    # Data access layer
│   └── *.test.js         # Unit tests
├── utils/
│   └── logger.js         # Logging utilities
├── scripts/
│   └── convertRawToProcessed.js  # Data conversion script
├── app.js                # Express application setup
├── bin/www               # Server entry point
└── package.json          # Dependencies and scripts
```

## Service Architecture

### StockService
- **Purpose**: Business logic for stock data operations
- **Methods**:
  - `getAllTickers()`: Retrieve available stock tickers
  - `getPaginatedStockData()`: Get paginated stock data
  - `getStockPrice()`: Get complete price data with calculations

### DataService
- **Purpose**: File system operations and data processing
- **Methods**:
  - `getStocksFromFile()`: Read available stock files
  - `getPaginatedStockDataFromFile()`: Read and paginate CSV data

## Logging

The server includes global request logging middleware that logs:
- Request method and URL
- Response status code
- Timestamp for each request

## Testing

### Running Tests
```bash
# All tests
npm test

# Specific test file
npm test services/StockService.test.js
npm test services/DataService.test.js
```

### Test Coverage
- **StockService**: Tests business logic methods
- **DataService**: Tests file operations and data processing
- **Mocking**: Uses Jest mocks for isolated testing

## Configuration

### Environment Variables
- `PORT` (optional): Server port (default: 3001)

### Default Settings
- **Port**: 3001
- **Page Size**: 24 items per page
- **Data Directory**: `./data/`

## Troubleshooting

1. **Server won't start**: Check if port 3001 is available
2. **No data returned**: Ensure processed CSV files exist in `data/processed/`
3. **Date parsing errors**: Verify raw data format matches expected structure
4. **Test failures**: Clear Jest cache with `npm test -- --clearCache`

## API Error Responses

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request
- `404`: Stock not found
- `500`: Internal server error

## Contributing

1. Follow the service layer architecture
2. Add unit tests for new functionality
3. Update API documentation for new endpoints
4. Ensure data processing scripts handle edge cases 
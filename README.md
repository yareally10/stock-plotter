# Stock Plotter

Stock Plotter is a full-stack web application for visualizing and analyzing stock and ETF data. It consists of a React client and an Express.js server.

## Project Structure

- `client/` — React frontend for browsing and visualizing stock data
- `server/` — Express backend serving stock data from CSV files

## Setup

### 1. Server

```
cd server
npm install
npm start
```
The server runs on [http://localhost:3001](http://localhost:3001) by default.

### 2. Client

```
cd client
npm install
npm start
```
The client runs on [http://localhost:3000](http://localhost:3000) by default and proxies API requests to the server.

## Features
- Browse available stocks/ETFs
- View historical price data in table and chart form
- Paginated data table
- Responsive UI

## Data
- Place raw data files in `server/data/raw/` and processed (| separated) CSVs in `server/data/processed/`.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. 
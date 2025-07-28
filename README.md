# Stock Plotter

Stock Plotter is a full-stack web application for visualizing and analyzing stock and ETF data. It consists of a React (Vite) client and an Express.js server.

## Project Structure

- `client/` — Vite + React frontend for browsing and visualizing stock data
- `server/` — Express backend serving stock data from CSV files

## Installation & Setup

### 1. Server

```sh
cd server
npm install
npm start
```
- The server runs on [http://localhost:3001](http://localhost:3001) by default.
- CORS is enabled for the Vite dev frontend (`http://localhost:5173`).

### 2. Client (Vite + React)

```sh
cd client
npm install
```

#### Development
```sh
npm run dev
```
- The client runs on [http://localhost:5173](http://localhost:5173) by default.
- API requests use the `VITE_API_URL` environment variable (see below).

#### Environment Variables
Create a `.env.development` file in the `client` directory:
```
VITE_API_URL=http://localhost:3001
```

#### Production Build
```sh
npm run build
npm run preview
```

## Features
- Browse available stocks/ETFs
- View historical price data in table and chart form
- Paginated data table
- Responsive UI
- Stock comparison with multi-line chart

## Data
- Place raw data files in `server/data/raw/` and processed (| separated) CSVs in `server/data/processed/`.
- Use the provided script in `server/scripts/convertRawToProcessed.js` to convert raw data.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. 
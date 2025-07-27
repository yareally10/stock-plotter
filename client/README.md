# Stock Plotter - Client Application

A React-based frontend application for visualizing and comparing stock price data. This client application provides an interactive interface for viewing stock charts, comparing multiple stocks, and analyzing price trends over time.

## Features

- **Stock List View**: Browse all available stock tickers
- **Individual Stock Details**: View detailed price data and charts for specific stocks
- **Stock Comparison**: Compare up to 5 stocks simultaneously with interactive charts
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Data**: Fetches stock data from the backend API
- **Interactive Charts**: Built with Chart.js for smooth data visualization

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running on `localhost:3001`

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development

The app will automatically reload when you make changes to the code. You can also view any lint errors in the console.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Route Map

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/stocks` |
| `/stocks` | `Stocks` | Displays list of available stock tickers |
| `/stocks/:ticker` | `StockDetails` | Shows detailed view for a specific stock |
| `/stocks/comparison` | `StockComparison` | Compare up to 5 stocks with charts |

## Component Structure

### Core Components (`src/components/core/`)
- **`Page`**: Consistent page layout wrapper
- **`Button`**: Reusable button component
- **`Table`**: Responsive table component
- **`TablePaginationControls`**: Pagination controls
- **`List`**: Generic list rendering component

### Page Components (`src/components/pages/`)
- **`Stocks`**: Main stock listing page
- **`StockDetails`**: Individual stock detail view
- **`StockComparison`**: Multi-stock comparison interface

### Stock Components (`src/components/stocks/`)
- **`StockChart`**: Interactive chart component (supports single/multiple stocks)
- **`StockTable`**: Paginated data table

## API Integration

The client communicates with the backend API running on `localhost:3001`:

- `GET /stocks` - Fetch list of available stock tickers
- `GET /stocks/:ticker` - Fetch paginated stock data
- `GET /stocks/:ticker/prices` - Fetch all price data for charting

## Key Technologies

- **React 18**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **React Router DOM**: Client-side routing
- **Chart.js & react-chartjs-2**: Data visualization
- **CSS-in-JS**: Component styling

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── core/          # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   └── stocks/        # Stock-specific components
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── package.json           # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (if configured)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

1. **Blank page**: Ensure the backend server is running on port 3001
2. **Chart not loading**: Check browser console for API errors
3. **Build errors**: Clear `node_modules` and reinstall dependencies

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Test your changes in multiple browsers
4. Ensure responsive design works on mobile devices

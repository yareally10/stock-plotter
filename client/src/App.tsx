import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Stocks from './components/pages/Stocks';
import StockDetails from './components/pages/StockDetails';
import StockComparison from './components/pages/StockComparison';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stocks/comparison" element={<StockComparison />} />
        <Route path="/stocks/:ticker" element={<StockDetails />} />
        {/* Optionally, redirect root to /stocks */}
        <Route path="/" element={<Navigate to="/stocks" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

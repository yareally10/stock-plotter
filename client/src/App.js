import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Stocks from './components/Stocks';
import StockDetails from './components/StockDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stocks/:ticker" element={<StockDetails />} />
        <Route path="*" element={<Stocks />} />
      </Routes>
    </Router>
  );
}

export default App; 
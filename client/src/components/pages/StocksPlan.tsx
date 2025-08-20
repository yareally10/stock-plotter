import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../core/buttons/Button';
import Dropdown from '../core/Dropdown';
import Tab, { TabItem } from '../core/Tab';
import InvestmentChartView from '../stocks/InvestmentChartView';
import InvestmentTableView from '../stocks/InvestmentTableView';
import { StockService, InvestmentProjection } from '../../services/StockService';
import { useStockContext } from '../../context/StockContext';

interface StockOption {
  value: string;
  label: string;
}

interface StockAllocation {
  ticker: string;
  percentage: number;
}

const StocksPlan: React.FC = () => {
  const [startingInvestment, setStartingInvestment] = useState(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState('1');
  const [selectedStocks, setSelectedStocks] = useState<StockAllocation[]>([
    { ticker: '', percentage: 0 }
  ]);
  const [stockOptions, setStockOptions] = useState<StockOption[]>([]);
  const { tickers, loadingTickers: loading, tickersError: error } = useStockContext();
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [projections, setProjections] = useState<InvestmentProjection[]>([]);

  useEffect(() => {
    const options = (tickers || []).map(ticker => ({
      value: ticker,
      label: `${ticker.toUpperCase()}`
    }));
    setStockOptions(options);
  }, [tickers]);

  const totalPercentage = selectedStocks.reduce((sum, stock) => sum + stock.percentage, 0);
  const isValidAllocation = totalPercentage === 100;

  // Get available stock options excluding already selected stocks
  const getAvailableStockOptions = (currentIndex: number): StockOption[] => {
    const selectedTickers = selectedStocks
      .map((stock, index) => index !== currentIndex ? stock.ticker : '')
      .filter(ticker => ticker !== '');
    
    return stockOptions.filter(option => !selectedTickers.includes(option.value));
  };

  const handleStockChange = (index: number, ticker: string) => {
    const updatedStocks = [...selectedStocks];
    updatedStocks[index].ticker = ticker;
    setSelectedStocks(updatedStocks);
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    const updatedStocks = [...selectedStocks];
    updatedStocks[index].percentage = percentage;
    setSelectedStocks(updatedStocks);
  };

  const addStock = () => {
    if (selectedStocks.length < 6) {
      setSelectedStocks([...selectedStocks, { ticker: '', percentage: 0 }]);
    }
  };

  const removeStock = (index: number) => {
    if (selectedStocks.length > 1) {
      const updatedStocks = selectedStocks.filter((_, i) => i !== index);
      setSelectedStocks(updatedStocks);
    }
  };

  const handleSubmit = async () => {
    if (!isValidAllocation) {
      alert('Please ensure total allocation is 100%.');
      return;
    }

    // Validate that all stocks are selected
    const hasEmptyTickers = selectedStocks.some(stock => !stock.ticker);
    if (hasEmptyTickers) {
      alert('Please select all stocks before calculating.');
      return;
    }
    
    setCalculating(true);
    setCalculationError(null);
    setProjections([]);

    try {
      const duration = parseInt(investmentPeriod);
      const projectionPromises = selectedStocks.map(async (stock) => {
        const stockInvestment = (startingInvestment * stock.percentage) / 100;
        return await StockService.calculateInvestmentProjection(
          stock.ticker,
          stockInvestment,
          duration
        );
      });

      const results = await Promise.all(projectionPromises);
      setProjections(results);
    } catch (err) {
      setCalculationError(err instanceof Error ? err.message : 'Failed to calculate investment projections');
    } finally {
      setCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  // Tab content components using the new separate components
  const TableView = () => <InvestmentTableView projections={projections} />;
  const ChartView = () => <InvestmentChartView projections={projections} />;

  // Tab configuration
  const tabs: TabItem[] = [
    {
      id: 'table',
      label: 'Table View',
      content: <TableView />
    },
    {
      id: 'chart',
      label: 'Chart View',
      content: <ChartView />
    }
  ];

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading available stocks...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link to="/stocks">
          <Button className="mb-4">
            ← Back to Stocks
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Investment Plan Calculator</h1>
      
      <div className="space-y-6">
        {/* Starting Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={startingInvestment}
              onChange={(e) => setStartingInvestment(Number(e.target.value))}
              className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Investment Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Time Period
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="1"
                checked={investmentPeriod === '1'}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="form-radio text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">1 Year</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="3"
                checked={investmentPeriod === '3'}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="form-radio text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">3 Years</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="5"
                checked={investmentPeriod === '5'}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="form-radio text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">5 Years</span>
            </label>
          </div>
        </div>

        {/* Stock Allocations */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stock Allocations</h2>
            {selectedStocks.length < 6 && (
              <Button onClick={addStock} className="text-sm">
                Add Stock
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {selectedStocks.map((stock, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock {index + 1}
                  </label>
                  <Dropdown
                    options={getAvailableStockOptions(index)}
                    value={stock.ticker}
                    onChange={(value) => handleStockChange(index, value)}
                    placeholder="Select a stock"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation %
                  </label>
                  <input
                    type="number"
                    value={stock.percentage}
                    onChange={(e) => handlePercentageChange(index, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                
                {selectedStocks.length > 1 && (
                  <button
                    onClick={() => removeStock(index)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Total Percentage Display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Allocation:</span>
              <span className={`font-bold ${isValidAllocation ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage}%
              </span>
            </div>
            {!isValidAllocation && (
              <p className="text-red-600 text-sm mt-1">
                Total allocation must equal 100%
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValidAllocation || calculating}
            className="w-full"
          >
            {calculating ? 'Calculating...' : 'Calculate Investment Plan'}
          </Button>
        </div>

        {/* Calculation Error */}
        {calculationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{calculationError}</p>
          </div>
        )}

        {/* Portfolio Summary - Always Visible */}
        {projections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Portfolio Summary</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Investment Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Initial Investment</p>
                  <p className="font-bold">{formatCurrency(startingInvestment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Final Value</p>
                  <p className="font-bold">{formatCurrency(projections.reduce((sum, p) => sum + p.finalValue, 0))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Return</p>
                  <p className="font-bold">{formatCurrency(projections.reduce((sum, p) => sum + p.totalReturn, 0))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Return %</p>
                  <p className="font-bold">{formatPercentage(projections.reduce((sum, p) => sum + p.totalReturn, 0) / startingInvestment * 100)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Projections Tabs */}
        {projections.length > 0 && (
          <div className="mt-6">
            <Tab tabs={tabs} defaultActiveTab="table" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StocksPlan; 
import React, { useEffect, useState } from 'react';
import Page from '../core/Page';
import Button from '../core/buttons/Button';
import Dropdown from '../core/Dropdown';
import List from '../core/List';
import StockChart from '../stocks/StockChart';
import StockSummaryTable from '../stocks/StockSummaryTable';
import { Link } from 'react-router-dom';
import { StockService, StockSummary, StockChartData } from '../../services/StockService';
import { useStockContext } from '../../context/StockContext';

interface StockRow {
  [key: string]: string;
}

const StockComparison: React.FC = () => {
  const { tickers } = useStockContext();
  const [selected, setSelected] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [summaries, setSummaries] = useState<Record<string, StockSummary>>({});
  const [chartData, setChartData] = useState<StockChartData[]>([]);

  // tickers are provided by context

  // Fetch summary for each selected ticker
  useEffect(() => {
    selected.forEach(ticker => {
      if (!summaries[ticker]) {
        setSummaries(prev => ({
          ...prev,
          [ticker]: {
            ticker,
            startDate: null,
            endDate: null,
            priceChange: null,
            startPrice: null,
            endPrice: null,
            changePercentage: null,
            loading: true
          }
        }));
        StockService.getStockSummary(ticker)
          .then(summary => {
            setSummaries(prev => ({
              ...prev,
              [ticker]: { ...summary, loading: false }
            }));
          })
          .catch(() => {
            setSummaries(prev => ({
              ...prev,
              [ticker]: {
                ticker,
                startDate: null,
                endDate: null,
                priceChange: null,
                startPrice: null,
                endPrice: null,
                changePercentage: null,
                loading: false,
                error: 'Failed to fetch data'
              }
            }));
          });
      }
    });
  }, [selected]);

  // Fetch chart data for all selected stocks
  useEffect(() => {
    const fetchChartData = async () => {
      const chartDataPromises = selected.map(async (ticker) => {
        try {
          const data = await StockService.getStockChartData(ticker);
          return { ticker, data };
        } catch (error) {
          console.error(`Failed to fetch chart data for ${ticker}:`, error);
          return { ticker, data: [] };
        }
      });
      const results = await Promise.all(chartDataPromises);
      setChartData(results.filter(item => item.data.length > 0));
    };
    if (selected.length > 0) {
      fetchChartData();
    } else {
      setChartData([]);
    }
  }, [selected]);

  const handleAdd = () => {
    if (current && !selected.includes(current) && selected.length < 5) {
      setSelected(prev => [...prev, current]);
      setCurrent('');
    }
  };

  const handleRemove = (ticker: string) => {
    setSelected(prev => prev.filter(t => t !== ticker));
    setSummaries(prev => {
      const copy = { ...prev };
      delete copy[ticker];
      return copy;
    });
  };

  const availableTickers = tickers.filter(t => !selected.includes(t));
  const dropdownOptions = availableTickers.map(ticker => ({
    value: ticker,
    label: ticker.toUpperCase()
  }));



  return (
    <Page>
      <div className="mb-4">
        <Link to="/stocks">
          <Button>&larr; Back to Stocks</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Stock Comparison</h1>
      <p>Select up to 5 tickers:</p>
      <div className="flex items-center gap-2 mb-4">
        <Dropdown
          value={current}
          onChange={setCurrent}
          options={dropdownOptions}
          placeholder={availableTickers.length === 0 ? 'No more tickers' : 'Select a ticker'}
          disabled={selected.length >= 5 || availableTickers.length === 0}
        />
        <Button
          onClick={handleAdd}
          disabled={!current || selected.length >= 5}
        >
          Add
        </Button>
      </div>

      <StockSummaryTable selectedTickers={selected} summaries={summaries} onRemove={handleRemove} />
      {chartData.length > 0 && (
        <div className="mt-8">
          <h2>Price Chart</h2>
          <StockChart stocksData={chartData} title="Stock Price Comparison" />
        </div>
      )}
    </Page>
  );
};

export default StockComparison; 
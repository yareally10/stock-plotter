import React, { useEffect, useState } from 'react';
import Page from '../core/Page';
import Button from '../core/Button';
import Dropdown from '../core/Dropdown';
import List from '../core/List';
import StockChart from '../stocks/StockChart';
import StockSummaryTable from '../stocks/StockSummaryTable';
import SelectedTicker from '../stocks/SelectedTicker';
import { Link } from 'react-router-dom';

interface StockRow {
  [key: string]: string;
}

interface StockSummary {
  ticker: string;
  startDate: string | null;
  endDate: string | null;
  priceChange: number | null;
  startPrice: number | null;
  endPrice: number | null;
  changePercentage: number | null;
  loading: boolean;
  error?: string;
}

interface StockChartData {
  ticker: string;
  data: StockRow[];
}

const StockComparison: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [summaries, setSummaries] = useState<Record<string, StockSummary>>({});
  const [chartData, setChartData] = useState<StockChartData[]>([]);

  useEffect(() => {
    fetch('/stocks')
      .then(res => res.json())
      .then(json => setTickers(json.stocks || []));
  }, []);

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
        fetch(`/stocks/${ticker}/prices`)
          .then(res => res.json())
          .then(json => {
            setSummaries(prev => ({
              ...prev,
              [ticker]: {
                ticker,
                startDate: json.startDate || null,
                endDate: json.endDate || null,
                priceChange: typeof json.priceChange === 'number' ? json.priceChange : null,
                startPrice: typeof json.startPrice === 'number' ? json.startPrice : null,
                endPrice: typeof json.endPrice === 'number' ? json.endPrice : null,
                changePercentage: typeof json.changePercentage === 'number' ? json.changePercentage : null,
                loading: false
              }
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
          const response = await fetch(`/stocks/${ticker}/prices`);
          const json = await response.json();
          // Map the prices array to StockRow format expected by StockChart
          const stockRows = (json.prices || []).map((row: any) => ({
            Date: row.date,
            Close: row.close
          }));
          return { ticker, data: stockRows };
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

  const renderSelectedTicker = (ticker: string) => (
    <SelectedTicker key={ticker} ticker={ticker} onRemove={handleRemove} />
  );

  return (
    <Page>
      <div style={{ marginBottom: 16 }}>
        <Link to="/stocks">
          <Button>&larr; Back to Stocks</Button>
        </Link>
      </div>
      <h1>Stock Comparison</h1>
      <p>Select up to 5 tickers:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
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
      <div>
        <h2>Chosen Tickers:</h2>
        <List items={selected} renderItem={renderSelectedTicker} />
      </div>
      <StockSummaryTable selectedTickers={selected} summaries={summaries} />
      {chartData.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>Price Chart</h2>
          <StockChart stocksData={chartData} title="Stock Price Comparison" />
        </div>
      )}
    </Page>
  );
};

export default StockComparison; 
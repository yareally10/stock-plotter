import React, { useEffect, useState } from 'react';
import Page from '../core/Page';
import Button from '../core/Button';
import Table from '../core/Table';
import { Link } from 'react-router-dom';

interface StockSummary {
  ticker: string;
  startDate: string | null;
  endDate: string | null;
  priceChange: number | null;
  loading: boolean;
  error?: string;
}

const StockComparison: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [summaries, setSummaries] = useState<Record<string, StockSummary>>({});

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
          [ticker]: { ticker, startDate: null, endDate: null, priceChange: null, loading: true }
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
                loading: false,
                error: 'Failed to fetch data'
              }
            }));
          });
      }
    });
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
        <select
          value={current}
          onChange={e => setCurrent(e.target.value)}
          disabled={selected.length >= 5 || availableTickers.length === 0}
          style={{ padding: '6px', borderRadius: 4 }}
        >
          <option value="" disabled>
            {availableTickers.length === 0 ? 'No more tickers' : 'Select a ticker'}
          </option>
          {availableTickers.map(ticker => (
            <option key={ticker} value={ticker}>
              {ticker.toUpperCase()}
            </option>
          ))}
        </select>
        <Button
          onClick={handleAdd}
          disabled={!current || selected.length >= 5}
        >
          Add
        </Button>
      </div>
      <div>
        <h2>Chosen Tickers:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {selected.map(ticker => (
            <li key={ticker} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span>{ticker.toUpperCase()}</span>
              <Button
                onClick={() => handleRemove(ticker)}
                style={{ background: '#e57373' }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {selected.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>Comparison Table</h2>
          <Table>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Ticker</th>
                <th style={{ textAlign: 'right' }}>Start Date</th>
                <th style={{ textAlign: 'right' }}>End Date</th>
                <th style={{ textAlign: 'right' }}>Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {selected.map(ticker => {
                const summary = summaries[ticker];
                return (
                  <tr key={ticker}>
                    <td style={{ fontWeight: 600 }}>{ticker.toUpperCase()}</td>
                    <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : summary?.startDate || '-'}</td>
                    <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : summary?.endDate || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {summary?.loading
                        ? 'Loading...'
                        : summary?.error
                        ? summary.error
                        : typeof summary?.priceChange === 'number' && isFinite(summary.priceChange)
                        ? `${(summary.priceChange * 100).toFixed(2)}%`
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Page>
  );
};

export default StockComparison; 
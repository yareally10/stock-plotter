import React, { useEffect, useState } from 'react';
import Page from '../core/Page';
import Button from '../core/Button';

const StockComparison: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    fetch('/stocks')
      .then(res => res.json())
      .then(json => setTickers(json.stocks || []));
  }, []);

  const handleAdd = () => {
    if (current && !selected.includes(current) && selected.length < 5) {
      setSelected(prev => [...prev, current]);
      setCurrent('');
    }
  };

  const handleRemove = (ticker: string) => {
    setSelected(prev => prev.filter(t => t !== ticker));
  };

  const availableTickers = tickers.filter(t => !selected.includes(t));

  return (
    <Page>
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
    </Page>
  );
};

export default StockComparison; 
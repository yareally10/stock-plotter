import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../core/Page';
import Button from '../core/Button';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data.stocks || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch stocks');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Page>
      <div style={{ marginBottom: 16 }}>
        <a href="/stocks/comparison">
          <Button>
            Compare Stocks
          </Button>
        </a>
      </div>
      <h1>Stocks</h1>
      <ul>
        {stocks.map(ticker => (
          <li key={ticker}>
            <Link to={`/stocks/${ticker}`}>{ticker.toUpperCase()}</Link>
          </li>
        ))}
      </ul>
    </Page>
  );
};

export default Stocks; 
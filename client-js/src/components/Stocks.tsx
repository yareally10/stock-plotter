import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div>
      <h1>Stocks</h1>
      <ul>
        {stocks.map(ticker => (
          <li key={ticker}>
            <Link to={`/stocks/${ticker}`}>{ticker.toUpperCase()}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stocks; 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../core/Page';
import Button from '../core/buttons/Button';
import List from '../core/List';
import { StockService } from '../../services/StockService';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    StockService.getAllTickers()
      .then(data => {
        setStocks(data || []);
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
      <div className="mb-4">
        <a href="/stocks/comparison">
          <Button>
            Compare Stocks
          </Button>
        </a>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Stocks</h1>
      <List
        items={stocks}
        renderItem={ticker => (
          <li key={ticker}>
            <Link to={`/stocks/${ticker}`}>{ticker.toUpperCase()}</Link>
          </li>
        )}
      />
    </Page>
  );
};

export default Stocks; 
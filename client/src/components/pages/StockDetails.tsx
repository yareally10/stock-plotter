import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import StockChart from '../stocks/StockChart';
import StockTable from '../stocks/StockTable';
import Page from '../core/Page';
import { StockService, StockRow } from '../../services/StockService';

const StockDetails: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<StockRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [chartData, setChartData] = useState<StockRow[]>([]);

  // Fetch all data for the chart (from /stocks/:ticker/prices)
  useEffect(() => {
    if (!ticker) return;
    StockService.getStockChartData(ticker)
      .then(setChartData);
  }, [ticker]);

  // Fetch paginated data for the table
  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    StockService.getPaginatedStockData(ticker, page)
      .then(({ data, totalPages }) => {
        if (data && data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
        setData(data || []);
        setTotalPages(totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch stock data');
        setLoading(false);
      });
  }, [ticker, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({ page: String(newPage) });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Page>
      <h1>{ticker?.toUpperCase()} Stock Data</h1>
      <Link to="/stocks">&larr; Back to Stocks</Link>
      <StockChart stocksData={[{ ticker: ticker || '', data: chartData }]} />
      <StockTable data={data} headers={headers} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
    </Page>
  );
};

export default StockDetails; 
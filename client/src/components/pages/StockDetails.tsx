import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import StockChart from '../stocks/StockChart';
import StockTable from '../stocks/StockTable';
import Page from '../core/Page';

interface StockRow {
  [key: string]: string;
}

const StockDetails: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<StockRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [allChartData, setAllChartData] = useState<StockRow[]>([]);

  // Fetch all data for the chart (from /stocks/:ticker/prices)
  useEffect(() => {
    fetch(`/stocks/${ticker}/prices`)
      .then(res => res.json())
      .then(json => {
        // The endpoint returns { prices: [{ date, close }, ...], ... }
        // Map to StockRow format expected by StockChart
        const chartRows = (json.prices || []).map((row: any) => ({
          Date: row.date,
          Close: row.close
        }));
        setAllChartData(chartRows);
      });
  }, [ticker]);

  // Fetch paginated data for the table
  useEffect(() => {
    setLoading(true);
    fetch(`/stocks/${ticker}?page=${page}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stock data');
        return res.json();
      })
      .then(json => {
        if (json.data && json.data.length > 0) {
          setHeaders(Object.keys(json.data[0]));
        }
        setData(json.data || []);
        setTotalPages(json.totalPages || 1);
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
      <StockChart allChartData={allChartData} ticker={ticker || ''} />
      <StockTable data={data} headers={headers} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
    </Page>
  );
};

export default StockDetails; 
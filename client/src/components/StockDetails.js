import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import StockChart from './StockChart';
import StockTable from './StockTable';

function StockDetails() {
  const { ticker } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [allChartData, setAllChartData] = useState([]);

  // Fetch all data for the chart (unpaginated)
  useEffect(() => {
    fetch(`/stocks/${ticker}?page=1`)
      .then(res => res.json())
      .then(json => {
        if (json.totalPages > 1) {
          // Fetch all pages and combine
          const fetches = [];
          for (let p = 1; p <= json.totalPages; p++) {
            fetches.push(
              fetch(`/stocks/${ticker}?page=${p}`).then(res => res.json())
            );
          }
          Promise.all(fetches).then(results => {
            const allRows = results.flatMap(r => r.data || []);
            setAllChartData(allRows);
          });
        } else {
          setAllChartData(json.data || []);
        }
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{ticker.toUpperCase()} Stock Data</h1>
      <Link to="/stocks">&larr; Back to Stocks</Link>
      <StockChart allChartData={allChartData} ticker={ticker} />
      <StockTable data={data} headers={headers} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
    </div>
  );
}

export default StockDetails; 
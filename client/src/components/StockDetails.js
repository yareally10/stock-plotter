import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';

function StockDetails() {
  const { ticker } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

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
      <table border="1" cellPadding="6" style={{ marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map(header => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
        <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next</button>
      </div>
    </div>
  );
}

export default StockDetails; 
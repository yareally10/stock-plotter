import React from 'react';

interface StockRow {
  [key: string]: string;
}

interface StockTableProps {
  data: StockRow[];
  headers: string[];
  page: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}

const StockTable: React.FC<StockTableProps> = ({ data, headers, page, totalPages, handlePageChange }) => {
  const reversedData = [...data].reverse();
  return (
    <>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
        <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next</button>
      </div>
      <div style={{ overflowX: 'auto', marginLeft: 20, marginRight: 20 }}>
        <table border={1} cellPadding={6} style={{ marginTop: 16, borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header} style={{ textAlign: 'right' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reversedData.map((row, idx) => (
              <tr key={idx}>
                {headers.map(header => (
                  <td key={header} style={{ textAlign: 'right' }}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
        <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next</button>
      </div>
    </>
  );
};

export default StockTable; 
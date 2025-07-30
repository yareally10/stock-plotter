import React from 'react';
import Button from '../core/buttons/Button';
import Table from '../core/Table';
import TablePaginationControls from '../core/TablePaginationControls';

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
  return (
    <>
      <div className="mb-4">
        <TablePaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Table>
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
      </Table>
      <TablePaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
};

export default StockTable; 
import React from 'react';
import Table from '../core/Table';

interface StockSummary {
  ticker: string;
  startDate: string | null;
  endDate: string | null;
  priceChange: number | null;
  startPrice: number | null;
  endPrice: number | null;
  changePercentage: number | null;
  loading: boolean;
  error?: string;
}

interface StockSummaryTableProps {
  selectedTickers: string[];
  summaries: Record<string, StockSummary>;
}

const StockSummaryTable: React.FC<StockSummaryTableProps> = ({ selectedTickers, summaries }) => {
  if (selectedTickers.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Comparison Table</h2>
      <Table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Start Price</th>
            <th>End Price</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {selectedTickers.map(ticker => {
            const summary = summaries[ticker];
            return (
              <tr key={ticker}>
                <td>{ticker.toUpperCase()}</td>
                <td>{summary?.loading ? 'Loading...' : summary?.startDate || '-'}</td>
                <td>{summary?.loading ? 'Loading...' : summary?.endDate || '-'}</td>
                <td>{summary?.loading ? 'Loading...' : typeof summary?.startPrice === 'number' && isFinite(summary.startPrice) ? summary.startPrice.toFixed(2) : '-'}</td>
                <td>{summary?.loading ? 'Loading...' : typeof summary?.endPrice === 'number' && isFinite(summary.endPrice) ? summary.endPrice.toFixed(2) : '-'}</td>
                <td>
                  {summary?.loading
                    ? 'Loading...'
                    : typeof summary?.changePercentage === 'number' && isFinite(summary.changePercentage)
                    ? `${summary.changePercentage.toFixed(2)}%`
                    : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default StockSummaryTable; 
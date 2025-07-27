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
            <th style={{ textAlign: 'left' }}>Ticker</th>
            <th style={{ textAlign: 'right' }}>Start Date</th>
            <th style={{ textAlign: 'right' }}>End Date</th>
            <th style={{ textAlign: 'right' }}>Start Price</th>
            <th style={{ textAlign: 'right' }}>End Price</th>
            <th style={{ textAlign: 'right' }}>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {selectedTickers.map(ticker => {
            const summary = summaries[ticker];
            return (
              <tr key={ticker}>
                <td style={{ fontWeight: 600 }}>{ticker.toUpperCase()}</td>
                <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : summary?.startDate || '-'}</td>
                <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : summary?.endDate || '-'}</td>
                <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : typeof summary?.startPrice === 'number' && isFinite(summary.startPrice) ? summary.startPrice.toFixed(2) : '-'}</td>
                <td style={{ textAlign: 'right' }}>{summary?.loading ? 'Loading...' : typeof summary?.endPrice === 'number' && isFinite(summary.endPrice) ? summary.endPrice.toFixed(2) : '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  {summary?.loading
                    ? 'Loading...'
                    : summary?.error
                    ? summary.error
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
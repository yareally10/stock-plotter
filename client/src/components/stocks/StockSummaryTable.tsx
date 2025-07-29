import React from 'react';
import Table from '../core/Table';
import StockSummaryTableRow from './StockSummaryTableRow';

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
  onRemove?: (ticker: string) => void;
}

const StockSummaryTable: React.FC<StockSummaryTableProps> = ({ selectedTickers, summaries, onRemove }) => {
  if (selectedTickers.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Comparison Table</h2>
      <Table>
        <thead>
          <tr>
            <th></th>
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
              <StockSummaryTableRow
                key={ticker}
                ticker={ticker}
                summary={summary}
                onRemove={onRemove}
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default StockSummaryTable; 
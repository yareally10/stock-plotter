import React from 'react';
import IconButton from '../core/buttons/IconButton';

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

interface StockSummaryTableRowProps {
  ticker: string;
  summary: StockSummary;
  onRemove?: (ticker: string) => void;
}

const StockSummaryTableRow: React.FC<StockSummaryTableRowProps> = ({ 
  ticker, 
  summary, 
  onRemove 
}) => {
  return (
    <tr>
      <td>
        {onRemove && (
          <IconButton
            onClick={() => onRemove(ticker)}
            size="small"
            variant="transparent"
            icon="🗑️"
          />
        )}
      </td>
      <td>{ticker.toUpperCase()}</td>
      <td>{summary?.loading ? 'Loading...' : summary?.startDate || '-'}</td>
      <td>{summary?.loading ? 'Loading...' : summary?.endDate || '-'}</td>
      <td>
        {summary?.loading 
          ? 'Loading...' 
          : typeof summary?.startPrice === 'number' && isFinite(summary.startPrice) 
            ? summary.startPrice.toFixed(2) 
            : '-'
        }
      </td>
      <td>
        {summary?.loading 
          ? 'Loading...' 
          : typeof summary?.endPrice === 'number' && isFinite(summary.endPrice) 
            ? summary.endPrice.toFixed(2) 
            : '-'
        }
      </td>
      <td>
        {summary?.loading
          ? 'Loading...'
          : typeof summary?.changePercentage === 'number' && isFinite(summary.changePercentage)
            ? `${summary.changePercentage.toFixed(2)}%`
            : '-'
        }
      </td>
    </tr>
  );
};

export default StockSummaryTableRow; 
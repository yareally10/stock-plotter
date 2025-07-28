import React from 'react';
import Button from '../core/Button';

interface SelectedTickerProps {
  ticker: string;
  onRemove: (ticker: string) => void;
}

const SelectedTicker: React.FC<SelectedTickerProps> = ({ ticker, onRemove }) => {
  return (
    <li className="flex items-center gap-2 mb-1">
      <span className="font-medium">{ticker.toUpperCase()}</span>
      <Button
        onClick={() => onRemove(ticker)}
        style={{ background: '#e57373' }}
      >
        Remove
      </Button>
    </li>
  );
};

export default SelectedTicker; 
import React from 'react';
import Button from '../core/Button';

interface SelectedTickerProps {
  ticker: string;
  onRemove: (ticker: string) => void;
}

const SelectedTicker: React.FC<SelectedTickerProps> = ({ ticker, onRemove }) => {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span>{ticker.toUpperCase()}</span>
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
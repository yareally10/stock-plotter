import React from 'react';
import IconButton from '../core/buttons/IconButton';


interface SelectedTickerProps {
  ticker: string;
  onRemove: (ticker: string) => void;
}

const SelectedTicker: React.FC<SelectedTickerProps> = ({ ticker, onRemove }) => {
  return (
    <li className="flex items-center gap-2 mb-1">
      <IconButton
        onClick={() => onRemove(ticker)}
        size="small"
        variant="transparent"
        icon="🗑️"
      />
      <span className="font-medium">{ticker.toUpperCase()}</span>
    </li>
  );
};

export default SelectedTicker; 
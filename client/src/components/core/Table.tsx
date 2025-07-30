import React, { ReactNode } from 'react';
import './Table.css';

const Table: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="table-container">
    <table className="table" style={style}>
      {children}
    </table>
  </div>
);

export default Table; 
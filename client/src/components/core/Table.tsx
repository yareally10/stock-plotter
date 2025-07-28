import React, { ReactNode } from 'react';

const Table: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="overflow-x-auto">
    <table className={"min-w-[700px] w-full border-collapse "} style={style}>
      {children}
    </table>
  </div>
);

export default Table; 
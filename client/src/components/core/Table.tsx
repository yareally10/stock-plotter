import React, { ReactNode } from 'react';

const Table: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="overflow-x-auto overflow-y-auto max-h-96 border-2 border-gray-300 rounded">
    <table className="min-w-[700px] w-full border-collapse [&_th]:text-right [&_td]:text-right [&_th]:p-3 [&_td]:p-3 [&_th]:border-r [&_td]:border-r [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0 [&_thead]:border-b-2 [&_thead]:border-gray-300 [&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-white [&_thead]:z-10 [&_tbody_tr:nth-child(even)]:bg-gray-50 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:hover]:bg-gray-100" style={style}>
      {children}
    </table>
  </div>
);

export default Table; 
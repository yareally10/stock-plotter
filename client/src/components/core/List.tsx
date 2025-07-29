import React from 'react';

interface ListProps {
  items: string[];
  renderItem: (item: string) => React.ReactNode;
  style?: React.CSSProperties;
}

const List: React.FC<ListProps> = ({ items, renderItem, style }) => (
  <ul className={`${items.length > 0 ? 'border border-gray-300 rounded-lg overflow-hidden' : ''}`} style={{ listStyle: 'none', padding: 0, margin: 0, ...style }}>
    {items.map((item, index) => (
      <li
        key={index}
        className={`p-3 border-b border-gray-200 ${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        } hover:bg-gray-100 transition-colors duration-150`}
      >
        {renderItem(item)}
      </li>
    ))}
  </ul>
);

export default List; 
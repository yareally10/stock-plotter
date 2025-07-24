import React from 'react';

interface ListProps {
  items: string[];
  renderItem: (item: string) => React.ReactNode;
  style?: React.CSSProperties;
}

const List: React.FC<ListProps> = ({ items, renderItem, style }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, ...style }}>
    {items.map(item => renderItem(item))}
  </ul>
);

export default List; 
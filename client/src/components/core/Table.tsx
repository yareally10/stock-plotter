import React, { ReactNode } from 'react';

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  minWidth: 700,
};
const thStyle: React.CSSProperties = {
  textAlign: 'right',
  padding: '8px 6px',
  background: '#f5f5f5',
  fontWeight: 600,
  borderBottom: '1px solid #e0e0e0',
};
const tdStyle: React.CSSProperties = {
  textAlign: 'right',
  padding: '8px 6px',
};
const trBodyStyle: React.CSSProperties = {
  borderBottom: '1px solid #f0f0f0',
};

function styleTableChildren(children: ReactNode, inTbody = false): ReactNode {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    const el = child as React.ReactElement<{ children?: ReactNode; style?: React.CSSProperties }>;
    if (el.type === 'thead') {
      return React.cloneElement(el, undefined, styleTableChildren(el.props.children, false));
    }
    if (el.type === 'tbody') {
      return React.cloneElement(el, undefined, styleTableChildren(el.props.children, true));
    }
    if (el.type === 'tr') {
      const style = inTbody ? { ...el.props.style, ...trBodyStyle } : el.props.style;
      return React.cloneElement(el, { ...el.props, style }, styleTableChildren(el.props.children, inTbody));
    }
    if (el.type === 'th') {
      const style = { ...el.props.style, ...thStyle };
      return React.cloneElement(el, { ...el.props, style });
    }
    if (el.type === 'td') {
      const style = { ...el.props.style, ...tdStyle };
      return React.cloneElement(el, { ...el.props, style });
    }
    return el;
  });
}

const Table: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <table style={{ ...tableStyle, ...style }}>
    {styleTableChildren(children)}
  </table>
);

export default Table; 
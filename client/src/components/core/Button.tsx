import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => (
  <button
    {...props}
    style={{
      padding: '6px 14px',
      borderRadius: 4,
      background: props.disabled ? '#b0b0b0' : '#1976d2',
      color: '#fff',
      border: 'none',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'bold',
      opacity: props.disabled ? 0.5 : 1,
      ...style,
    }}
  >
    {children}
  </button>
);

export default Button; 
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => (
  <button
    {...props}
    className={
      `px-4 py-1.5 rounded bg-blue-700 text-white font-bold ` +
      (props.disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'hover:bg-blue-800 cursor-pointer')
    }
    style={style}
  >
    {children}
  </button>
);

export default Button; 
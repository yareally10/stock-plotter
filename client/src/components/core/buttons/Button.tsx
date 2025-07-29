import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  size?: 'base' | 'small';
}

const Button: React.FC<ButtonProps> = ({ children, style, size = 'base', ...props }) => {
  const baseClasses = 'rounded font-bold cursor-pointer';
  const disabledClasses = 'bg-gray-400 cursor-not-allowed opacity-50';
  
  const sizeClasses = {
    base: 'px-4 py-1.5 text-white',
    small: 'px-1.5 py-0.5 text-xs text-white'
  };
  
  const colorClasses = props.disabled 
    ? disabledClasses 
    : 'bg-blue-700 hover:bg-blue-800';

  return (
    <button
      {...props}
      className={`${baseClasses} ${sizeClasses[size]} ${colorClasses}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button; 
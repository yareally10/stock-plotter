import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'base' | 'small';
  variant?: 'primary' | 'secondary' | 'danger' | 'transparent';
  style?: React.CSSProperties;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  size = 'base', 
  variant = 'primary',
  style, 
  ...props 
}) => {
  const baseClasses = 'rounded font-bold cursor-pointer flex items-center justify-center';
  const disabledClasses = 'bg-gray-400 cursor-not-allowed opacity-50';
  
  const sizeClasses = {
    base: 'w-8 h-8',
    small: 'w-6 h-6'
  };
  
  const variantClasses = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    transparent: 'bg-transparent hover:bg-gray-100 text-gray-600'
  };
  
  const colorClasses = props.disabled 
    ? disabledClasses 
    : variantClasses[variant];

  return (
    <button
      {...props}
      className={`${baseClasses} ${sizeClasses[size]} ${colorClasses}`}
      style={style}
    >
      {icon}
    </button>
  );
};

export default IconButton; 
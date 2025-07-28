import React from 'react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option',
  disabled = false,
  style 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={
        `px-2 py-1 rounded border border-gray-300 min-w-[120px] text-sm ` +
        (disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 cursor-pointer')
      }
      style={style}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map(option => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown; 
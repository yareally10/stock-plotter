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
      style={{
        padding: '6px',
        borderRadius: 4,
        border: '1px solid #ccc',
        backgroundColor: disabled ? '#f5f5f5' : '#fff',
        color: disabled ? '#999' : '#333',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        minWidth: '120px',
        ...style,
      }}
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
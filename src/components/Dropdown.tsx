import React from 'react';

interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropdown({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}: DropdownProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-white border border-gray-300 rounded-lg
          text-gray-700 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-200
          hover:border-gray-400
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

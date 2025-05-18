
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  className = "",
  id,
  "aria-label": ariaLabel
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        aria-label={ariaLabel}
        className={`w-full border rounded-md h-12 pl-3 pr-10 text-sm text-gray-700 appearance-none bg-white ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="" disabled className="text-gray-400">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-700 py-2">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  );
};

export default FilterDropdown;

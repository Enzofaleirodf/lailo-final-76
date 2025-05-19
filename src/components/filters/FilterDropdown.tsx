
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
  // Check if value equals default values like "Todas", "Todos"
  const isDefaultValue = value === "Todas" || value === "Todos";

  return (
    <div className="relative">
      <select
        id={id}
        aria-label={ariaLabel}
        className={`w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white ${isDefaultValue ? 'text-brand-700' : 'text-gray-700'} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ height: '40px' }}
      >
        {placeholder && <option value="" disabled className="text-gray-500 font-normal">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className={option.value === "Todas" || option.value === "Todos" ? "text-brand-700 font-normal" : "text-gray-700 font-normal"}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  );
};

export default FilterDropdown;

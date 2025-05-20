
import React from 'react';
import { Input } from '@/components/ui/input';

interface FilterRangeInputProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
  ariaLabelMin?: string;
  ariaLabelMax?: string;
}

const FilterRangeInput: React.FC<FilterRangeInputProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  className = "",
  ariaLabelMin = "Valor mínimo",
  ariaLabelMax = "Valor máximo"
}) => {
  // Handle negative or invalid number inputs
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty values for clearing the filter
    if (value === '') {
      onMinChange('');
      return;
    }
    
    // Only accept numeric values 
    if (/^\d*$/.test(value)) {
      onMinChange(value);
      
      // If min is greater than max and max is not empty, update max to min
      if (maxValue && parseInt(value) > parseInt(maxValue)) {
        onMaxChange(value);
      }
    }
  };
  
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty values for clearing the filter
    if (value === '') {
      onMaxChange('');
      return;
    }
    
    // Only accept numeric values
    if (/^\d*$/.test(value)) {
      onMaxChange(value);
      
      // If max is less than min and min is not empty, update min to max
      if (minValue && parseInt(value) < parseInt(minValue)) {
        onMinChange(value);
      }
    }
  };

  return (
    <div 
      className={`flex gap-2 ${className}`}
      role="group"
      aria-label="Intervalo de valores"
    >
      <Input 
        type="text" 
        placeholder={minPlaceholder} 
        className="h-10 text-sm" 
        value={minValue}
        onChange={handleMinInputChange}
        aria-label={ariaLabelMin}
        id="filter-range-min"
        inputMode="numeric"
        pattern="\d*"
      />
      <Input 
        type="text" 
        placeholder={maxPlaceholder} 
        className="h-10 text-sm" 
        value={maxValue}
        onChange={handleMaxInputChange}
        aria-label={ariaLabelMax}
        id="filter-range-max"
        inputMode="numeric"
        pattern="\d*"
      />
    </div>
  );
};

export default React.memo(FilterRangeInput);

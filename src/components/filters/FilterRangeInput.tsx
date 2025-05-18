
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
  return (
    <div className={`flex gap-2 ${className}`}>
      <Input 
        type="text" 
        placeholder={minPlaceholder} 
        className="h-10 text-sm" 
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
        aria-label={ariaLabelMin}
      />
      <Input 
        type="text" 
        placeholder={maxPlaceholder} 
        className="h-10 text-sm" 
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
        aria-label={ariaLabelMax}
      />
    </div>
  );
};

export default FilterRangeInput;

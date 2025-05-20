
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { cn } from '@/lib/utils';

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
  allowDecimals?: boolean;
  allowNegative?: boolean;
  minAllowed?: number;
  maxAllowed?: number;
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
  ariaLabelMax = "Valor máximo",
  allowDecimals = false,
  allowNegative = false,
  minAllowed,
  maxAllowed
}) => {
  // Use o hook de validação para tratar valores de intervalo
  const {
    handleMinChange,
    handleMaxChange,
    minError,
    maxError
  } = useFilterRangeValidator(minValue, maxValue, {
    onMinChange,
    onMaxChange,
    allowDecimals,
    allowNegative,
    minAllowed,
    maxAllowed,
    autoValidate: true,
    validationDelay: 300
  });

  return (
    <div 
      className="space-y-1"
      role="group"
      aria-label="Intervalo de valores"
    >
      <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder={minPlaceholder} 
            className={cn(
              "h-10 text-sm",
              minError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={minValue}
            onChange={(e) => handleMinChange(e.target.value)}
            aria-label={ariaLabelMin}
            aria-invalid={!!minError}
            aria-describedby={minError ? "min-error" : undefined}
            id="filter-range-min"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
        </div>
        
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder={maxPlaceholder} 
            className={cn(
              "h-10 text-sm",
              maxError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={maxValue}
            onChange={(e) => handleMaxChange(e.target.value)}
            aria-label={ariaLabelMax}
            aria-invalid={!!maxError}
            aria-describedby={maxError ? "max-error" : undefined}
            id="filter-range-max"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
        </div>
      </div>
      
      {/* Error messages with proper aria attributes */}
      {(minError || maxError) && (
        <div className="flex justify-between text-xs">
          {minError && (
            <p id="min-error" className="text-red-500" role="alert">
              {minError}
            </p>
          )}
          {maxError && (
            <p id="max-error" className="text-red-500 ml-auto" role="alert">
              {maxError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterRangeInput);

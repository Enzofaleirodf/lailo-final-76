
import React from 'react';
import { Input } from '@/components/ui/input';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { useRangeDisplayFormat } from '@/hooks/useRangeDisplayFormat';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  inputPrefix?: string;
  inputSuffix?: string;
  isFilterActive?: boolean;
  defaultMin?: string;
  defaultMax?: string;
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
  maxAllowed,
  inputPrefix,
  inputSuffix,
  isFilterActive = false,
  defaultMin,
  defaultMax
}) => {
  // Usar o novo hook de formatação
  const { formatDisplayValue } = useRangeDisplayFormat({ allowDecimals });

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
            placeholder={inputPrefix ? `${inputPrefix} ${minPlaceholder}` : minPlaceholder} 
            className={cn(
              "h-10 text-sm",
              minError ? "border-red-300 focus:ring-red-500" : 
              isFilterActive ? "border-brand-300 focus:ring-brand-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={formatDisplayValue(minValue)}
            onChange={(e) => handleMinChange(e.target.value.replace(/[^\d.,\-]/g, ''))}
            aria-label={ariaLabelMin}
            aria-invalid={!!minError}
            aria-describedby={minError ? "min-error" : undefined}
            id="filter-range-min"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
          {inputPrefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{inputPrefix}</span>
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder={inputPrefix ? `${inputPrefix} ${maxPlaceholder}` : maxPlaceholder}
            className={cn(
              "h-10 text-sm",
              maxError ? "border-red-300 focus:ring-red-500" : 
              isFilterActive ? "border-brand-300 focus:ring-brand-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={formatDisplayValue(maxValue)}
            onChange={(e) => handleMaxChange(e.target.value.replace(/[^\d.,\-]/g, ''))}
            aria-label={ariaLabelMax}
            aria-invalid={!!maxError}
            aria-describedby={maxError ? "max-error" : undefined}
            id="filter-range-max"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
          {inputPrefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{inputPrefix}</span>
            </div>
          )}
        </div>

        {isFilterActive && (
          <Badge 
            variant="outline" 
            className="bg-brand-50 text-brand-700 border-brand-200 h-10 flex items-center"
            aria-label="Filtro ativo"
          >
            Ativo
          </Badge>
        )}
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

      {/* Indicador visual de range ativo */}
      {isFilterActive && defaultMin && defaultMax && (
        <div className="text-xs text-brand-600 mt-1">
          <p>
            {minValue !== defaultMin || maxValue !== defaultMax ? 
              "Filtro personalizado aplicado" : 
              "Mostrando todos os itens"}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterRangeInput);

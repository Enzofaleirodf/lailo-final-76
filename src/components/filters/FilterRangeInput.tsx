import React from 'react';
import { Input } from '@/components/ui/input';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { useRangeDisplayFormat } from '@/hooks/useRangeDisplayFormat';
import { cn } from '@/lib/utils';
import { COLORS, COMPONENT_STYLES } from '@/constants/designSystem';
import { getInputStyles } from '@/utils/styleUtils';
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
  useThousandSeparator?: boolean;
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
  defaultMax,
  useThousandSeparator = true
}) => {
  // Usar o novo hook de formatação
  const { formatDisplayValue } = useRangeDisplayFormat({ 
    allowDecimals, 
    useThousandSeparator 
  });

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

  // Calcular o padding-left necessário para acomodar o prefixo sem sobreposição
  const prefixPaddingClass = inputPrefix ? "pl-12" : "";
  // Calcular o padding-right necessário para acomodar o sufixo sem sobreposição
  const suffixPaddingClass = inputSuffix ? "pr-12" : "";

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
            className={cn(getInputStyles(!!minError, isFilterActive), prefixPaddingClass, suffixPaddingClass)}
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
              <span className={`${COLORS.text.gray[500]} text-sm font-medium mr-2`}>{inputPrefix}</span>
            </div>
          )}
          
          {inputSuffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className={`${COLORS.text.gray[500]} text-sm ml-3`}>{inputSuffix}</span>
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder={inputPrefix ? `${inputPrefix} ${maxPlaceholder}` : maxPlaceholder}
            className={cn(getInputStyles(!!maxError, isFilterActive), prefixPaddingClass, suffixPaddingClass)}
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
              <span className={`${COLORS.text.gray[500]} text-sm font-medium mr-2`}>{inputPrefix}</span>
            </div>
          )}
          
          {inputSuffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className={`${COLORS.text.gray[500]} text-sm ml-3`}>{inputSuffix}</span>
            </div>
          )}
        </div>

        {isFilterActive && (
          <Badge 
            variant="outline"
            className={`${COLORS.bg.brand[50]} ${COLORS.text.brand[700]} ${COLORS.border.brand[200]} h-10 flex items-center`}
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
            <p id="min-error" className={COLORS.text.error} role="alert">
              {minError}
            </p>
          )}
          {maxError && (
            <p id="max-error" className={`${COLORS.text.error} ml-auto`} role="alert">
              {maxError}
            </p>
          )}
        </div>
      )}

      {/* Indicador visual de range ativo */}
      {isFilterActive && defaultMin && defaultMax && (
        <div className={`text-xs ${COLORS.text.brand[600]} mt-1`}>
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
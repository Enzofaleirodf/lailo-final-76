
import React from 'react';
import { Badge } from '@/components/ui/badge';
import RangeInputField from './RangeInputField';
import { useRangeFilter, RangeValues } from '@/hooks/useRangeFilter';
import { cn } from '@/lib/utils';

export interface RangeFilterProps {
  initialValues: RangeValues;
  defaultValues?: RangeValues;
  onChange?: (values: RangeValues) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  ariaLabelMin?: string;
  ariaLabelMax?: string;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  minAllowed?: number;
  maxAllowed?: number;
  inputPrefix?: string;
  inputSuffix?: string;
  className?: string;
  showActiveBadge?: boolean;
  formatterOptions?: {
    useThousandSeparator?: boolean;
    formatDisplay?: boolean;
  };
}

/**
 * Componente simplificado para filtros de intervalo
 * Unifica o comportamento visual e funcional dos filtros de intervalo
 */
const SimplifiedRangeFilter: React.FC<RangeFilterProps> = ({
  initialValues,
  defaultValues = { min: '', max: '' },
  onChange,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  ariaLabelMin = "Valor mínimo",
  ariaLabelMax = "Valor máximo",
  allowDecimals = false,
  allowNegative = false,
  minAllowed,
  maxAllowed,
  inputPrefix,
  inputSuffix,
  className = "",
  showActiveBadge = true,
  formatterOptions = {}
}) => {
  // Usar nosso novo hook para gerenciar estado e validação
  const {
    values,
    errors,
    isActive,
    handleMinChange,
    handleMaxChange,
    formatValue
  } = useRangeFilter(initialValues, {
    defaultMin: defaultValues.min,
    defaultMax: defaultValues.max,
    allowDecimals,
    allowNegative,
    minAllowed, 
    maxAllowed,
    onChange,
    ...formatterOptions
  });
  
  // ID único para acessibilidade
  const filterGroupId = React.useId();
  const minErrorId = `min-error-${filterGroupId}`;
  const maxErrorId = `max-error-${filterGroupId}`;
  
  return (
    <div className="space-y-2">
      <div className={cn("flex gap-2 items-center", className)}>
        <RangeInputField
          id={`min-${filterGroupId}`}
          value={formatValue(values.min)}
          placeholder={minPlaceholder}
          onChange={(e) => handleMinChange(e.target.value)}
          ariaLabel={ariaLabelMin}
          ariaInvalid={!!errors.min}
          ariaDescribedBy={errors.min ? minErrorId : undefined}
          isError={!!errors.min}
          isActive={isActive}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
        />
        
        <RangeInputField
          id={`max-${filterGroupId}`}
          value={formatValue(values.max)}
          placeholder={maxPlaceholder}
          onChange={(e) => handleMaxChange(e.target.value)}
          ariaLabel={ariaLabelMax}
          ariaInvalid={!!errors.max}
          ariaDescribedBy={errors.max ? maxErrorId : undefined}
          isError={!!errors.max}
          isActive={isActive}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
        />
        
        {showActiveBadge && isActive && (
          <Badge 
            variant="outline" 
            className="bg-brand-50 text-brand-700 border-brand-200 h-10 flex items-center"
            aria-label="Filtro ativo"
          >
            Ativo
          </Badge>
        )}
      </div>
      
      {/* Mensagens de erro */}
      {(errors.min || errors.max) && (
        <div className="flex justify-between text-xs">
          {errors.min && (
            <p id={minErrorId} className="text-red-500" role="alert">
              {errors.min}
            </p>
          )}
          {errors.max && (
            <p id={maxErrorId} className="text-red-500 ml-auto" role="alert">
              {errors.max}
            </p>
          )}
        </div>
      )}
      
      {/* Indicador visual de filtro ativo */}
      {isActive && defaultValues.min && defaultValues.max && (
        <div className="text-xs text-brand-600 mt-1">
          <p>Filtro personalizado aplicado</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(SimplifiedRangeFilter);

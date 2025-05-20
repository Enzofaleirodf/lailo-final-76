
import React from 'react';
import RangeInputField from './RangeInputField';
import { useRangeFilter, RangeValues } from '@/hooks/useRangeFilter';
import { cn } from '@/lib/utils';
import RangeErrorMessages from './RangeErrorMessages';

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
  formatterOptions = {}
}) => {
  // Usar nosso hook atualizado para gerenciar estado e validação
  const {
    values,
    displayValues,
    errors,
    handleMinChange,
    handleMaxChange,
    handleBlur,
    formatValue,
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
          value={displayValues.min}
          placeholder={minPlaceholder}
          onChange={(e) => handleMinChange(e.target.value)}
          onBlur={() => handleBlur(true)}
          ariaLabel={ariaLabelMin}
          ariaInvalid={!!errors.min}
          ariaDescribedBy={errors.min ? minErrorId : undefined}
          isError={!!errors.min}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
        />
        
        <RangeInputField
          id={`max-${filterGroupId}`}
          value={displayValues.max}
          placeholder={maxPlaceholder}
          onChange={(e) => handleMaxChange(e.target.value)}
          onBlur={() => handleBlur(false)}
          ariaLabel={ariaLabelMax}
          ariaInvalid={!!errors.max}
          ariaDescribedBy={errors.max ? maxErrorId : undefined}
          isError={!!errors.max}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
        />
      </div>
      
      {/* Mensagens de erro */}
      <RangeErrorMessages 
        minError={errors.min}
        maxError={errors.max}
        minErrorId={minErrorId}
        maxErrorId={maxErrorId}
      />
    </div>
  );
};

export default React.memo(SimplifiedRangeFilter);

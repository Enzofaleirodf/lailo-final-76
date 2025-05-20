
import React, { useMemo } from 'react';
import RangeInputField from './RangeInputField';
import { useRangeFilter, RangeValues } from '@/hooks/useRangeFilter';
import { cn } from '@/lib/utils';
import RangeErrorMessages from './RangeErrorMessages';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveConsistency } from '@/hooks/useResponsiveConsistency';

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
  isActive?: boolean;
  formatterOptions?: {
    useThousandSeparator?: boolean;
    formatDisplay?: boolean;
  };
}

/**
 * Componente simplificado para filtros de intervalo
 * Unifica o comportamento visual e funcional dos filtros de intervalo
 * Otimizado para desempenho com grandes conjuntos de dados
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
  isActive = false,
  formatterOptions = {}
}) => {
  // Verificar consistência em diferentes tamanhos de tela
  useResponsiveConsistency({ 
    targetElements: [
      {
        selector: '[data-testid="range-filter"] input',
        properties: ['border-color', 'border-radius', 'padding', 'background-color']
      }
    ],
    logInconsistencies: true
  });
  
  const isMobile = useIsMobile();
  
  // Usar nosso hook atualizado para gerenciar estado e validação
  const {
    values,
    displayValues,
    errors,
    handleMinChange,
    handleMaxChange,
    handleBlur,
  } = useRangeFilter(initialValues, {
    defaultMin: defaultValues.min,
    defaultMax: defaultValues.max,
    allowDecimals,
    allowNegative,
    minAllowed, 
    maxAllowed,
    onChange,
    prefix: inputPrefix,
    suffix: inputSuffix,
    ...formatterOptions
  });
  
  // ID único para acessibilidade
  const filterGroupId = React.useId();
  const minErrorId = `min-error-${filterGroupId}`;
  const maxErrorId = `max-error-${filterGroupId}`;
  
  // Calcular placeholder específico para dispositivo
  const getResponsivePlaceholder = (placeholder: string) => {
    if (isMobile && placeholder.length > 4) {
      // Abreviar placeholder em dispositivos móveis
      return placeholder.substring(0, 3) + '.';
    }
    return placeholder;
  };
  
  // Usar memo para evitar recálculos desnecessários
  const responsiveMinPlaceholder = useMemo(() => 
    getResponsivePlaceholder(minPlaceholder), 
    [minPlaceholder, isMobile]
  );
  
  const responsiveMaxPlaceholder = useMemo(() => 
    getResponsivePlaceholder(maxPlaceholder), 
    [maxPlaceholder, isMobile]
  );
  
  return (
    <div className="space-y-2" data-testid="range-filter">
      <div className={cn("flex gap-2 items-center", className)}>
        <RangeInputField
          id={`min-${filterGroupId}`}
          value={displayValues.min}
          placeholder={responsiveMinPlaceholder}
          onChange={(e) => handleMinChange(e.target.value)}
          onBlur={() => handleBlur(true)}
          ariaLabel={ariaLabelMin}
          ariaInvalid={!!errors.min}
          ariaDescribedBy={errors.min ? minErrorId : undefined}
          isError={!!errors.min}
          isActive={isActive}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
          dataTestId="range-input-min"
        />
        
        <RangeInputField
          id={`max-${filterGroupId}`}
          value={displayValues.max}
          placeholder={responsiveMaxPlaceholder}
          onChange={(e) => handleMaxChange(e.target.value)}
          onBlur={() => handleBlur(false)}
          ariaLabel={ariaLabelMax}
          ariaInvalid={!!errors.max}
          ariaDescribedBy={errors.max ? maxErrorId : undefined}
          isError={!!errors.max}
          isActive={isActive}
          inputPrefix={inputPrefix}
          inputSuffix={inputSuffix}
          className="flex-1"
          dataTestId="range-input-max"
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

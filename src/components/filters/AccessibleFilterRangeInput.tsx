
import React, { useId, useEffect } from 'react';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { useRangeDisplayFormat } from '@/hooks/useRangeDisplayFormat';
import { generateRangeDescription, announceValueChange, setupLiveRegion } from '@/utils/accessibilityUtils';
import AccessibleRangeInputField from './AccessibleRangeInputField';
import RangeErrorMessages from './RangeErrorMessages';

interface AccessibleFilterRangeInputProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
  ariaLabelMin?: string;
  ariaLabelMax?: string;
  ariaDescription?: string;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  minAllowed?: number;
  maxAllowed?: number;
  fieldName?: string;
  inputPrefix?: string;
  inputSuffix?: string;
}

/**
 * Versão altamente acessível do componente FilterRangeInput
 * Implementa todas as melhores práticas de ARIA para inputs numéricos
 */
const AccessibleFilterRangeInput: React.FC<AccessibleFilterRangeInputProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = "Mín",
  maxPlaceholder = "Máx",
  className = "",
  ariaLabelMin = "Valor mínimo",
  ariaLabelMax = "Valor máximo",
  ariaDescription = "Insira um intervalo de valores",
  allowDecimals = false,
  allowNegative = false,
  minAllowed,
  maxAllowed,
  fieldName = "valor",
  inputPrefix,
  inputSuffix
}) => {
  // Gerar IDs únicos para acessibilidade
  const uniqueId = useId();
  const groupId = `filter-range-group-${uniqueId}`;
  const minId = `filter-range-min-${uniqueId}`;
  const maxId = `filter-range-max-${uniqueId}`;
  const descriptionId = `filter-range-description-${uniqueId}`;
  const minErrorId = `min-error-${uniqueId}`;
  const maxErrorId = `max-error-${uniqueId}`;
  
  // Use o hook para formatar valores de exibição
  const { formatDisplayValue } = useRangeDisplayFormat({ allowDecimals });
  
  // Use o hook de validação para tratar valores de intervalo
  const {
    handleMinChange: onMinChangeInternal,
    handleMaxChange: onMaxChangeInternal,
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

  // Configurar região live para anúncios de leitores de tela
  useEffect(() => {
    return setupLiveRegion(fieldName);
  }, [fieldName]);

  // Manipulador de teclas para acessibilidade
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isMin: boolean) => {
    // Implementar controles de teclado para incrementar/decrementar valores
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const currentValue = isMin ? minValue : maxValue;
      if (!currentValue) return;
      
      const numValue = parseFloat(currentValue);
      if (isNaN(numValue)) return;
      
      const step = allowDecimals ? 0.1 : 1;
      const newValue = e.key === 'ArrowUp' ? numValue + step : numValue - step;
      
      // Aplicar restrições se definidas
      if (minAllowed !== undefined && newValue < minAllowed) return;
      if (maxAllowed !== undefined && newValue > maxAllowed) return;
      
      // Formatar e atualizar
      const formatted = allowDecimals ? newValue.toFixed(1) : Math.floor(newValue).toString();
      if (isMin) {
        onMinChangeInternal(formatted);
      } else {
        onMaxChangeInternal(formatted);
      }
      
      // Anunciar para leitores de tela
      announceValueChange(isMin ? 'mínimo' : 'máximo', formatted, fieldName);
    }
  };

  // Preparar placeholders com prefixo se fornecido
  const minInputPlaceholder = inputPrefix ? `${inputPrefix} ${minPlaceholder}` : minPlaceholder;
  const maxInputPlaceholder = inputPrefix ? `${inputPrefix} ${maxPlaceholder}` : maxPlaceholder;

  // Gerar descrição acessível completa
  const fullDescription = generateRangeDescription(
    ariaDescription,
    minAllowed,
    maxAllowed,
    allowDecimals,
    allowNegative
  );
  
  return (
    <div 
      className="space-y-1"
      role="group"
      aria-labelledby={`${groupId}-label`}
      aria-describedby={descriptionId}
      id={groupId}
    >
      <div id={`${groupId}-label`} className="sr-only">Intervalo de {fieldName}</div>
      <div id={descriptionId} className="sr-only">{fullDescription}</div>
      
      <div className={`flex gap-2 ${className}`}>
        <AccessibleRangeInputField
          id={minId}
          value={formatDisplayValue(minValue)}
          placeholder={minInputPlaceholder}
          error={minError}
          onChange={(e) => onMinChangeInternal(e.target.value.replace(/[^\d.,\-]/g, ''))}
          onKeyDown={(e) => handleKeyDown(e, true)}
          ariaLabel={ariaLabelMin}
          ariaDescribedBy={`${descriptionId}${minError ? ` ${minErrorId}` : ''}`}
          isMin={true}
          inputSuffix={inputSuffix}
        />
        
        <AccessibleRangeInputField
          id={maxId}
          value={formatDisplayValue(maxValue)}
          placeholder={maxInputPlaceholder}
          error={maxError}
          onChange={(e) => onMaxChangeInternal(e.target.value.replace(/[^\d.,\-]/g, ''))}
          onKeyDown={(e) => handleKeyDown(e, false)}
          ariaLabel={ariaLabelMax}
          ariaDescribedBy={`${descriptionId}${maxError ? ` ${maxErrorId}` : ''}`}
          isMin={false}
          inputSuffix={inputSuffix}
        />
      </div>
      
      <RangeErrorMessages
        minError={minError}
        maxError={maxError}
        minErrorId={minErrorId}
        maxErrorId={maxErrorId}
      />
    </div>
  );
};

export default React.memo(AccessibleFilterRangeInput);

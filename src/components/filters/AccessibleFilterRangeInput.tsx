
import React, { useId } from 'react';
import { Input } from '@/components/ui/input';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { cn } from '@/lib/utils';

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
  
  // Format value with thousand separator
  const formatDisplayValue = (value: string): string => {
    if (!value) return '';
    
    // Parse the value as a number
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numValue)) return value;
    
    // Format with thousand separator
    return numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: true
    });
  };
  
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

  // Gerar texto de descrição para leitores de tela
  const getAriaDescription = () => {
    let desc = ariaDescription;
    
    if (minAllowed !== undefined && maxAllowed !== undefined) {
      desc += `. Valores permitidos: de ${minAllowed} a ${maxAllowed}`;
    } else if (minAllowed !== undefined) {
      desc += `. Valor mínimo permitido: ${minAllowed}`;
    } else if (maxAllowed !== undefined) {
      desc += `. Valor máximo permitido: ${maxAllowed}`;
    }
    
    if (allowDecimals) {
      desc += `. Valores decimais são permitidos`;
    } else {
      desc += `. Apenas números inteiros`;
    }
    
    if (allowNegative) {
      desc += `. Valores negativos são permitidos`;
    }
    
    return desc;
  };

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
        handleMinChange(formatted);
      } else {
        handleMaxChange(formatted);
      }
      
      // Anunciar para leitores de tela
      announceValueChange(isMin ? 'mínimo' : 'máximo', formatted);
    }
  };
  
  // Função para anunciar mudanças para leitores de tela
  const announceValueChange = (type: string, value: string) => {
    const liveRegion = document.getElementById('filter-range-live-region');
    if (liveRegion) {
      liveRegion.textContent = `${fieldName} ${type} alterado para ${value}`;
    }
  };
  
  // Garantir que a região ao vivo existe
  React.useEffect(() => {
    if (!document.getElementById('filter-range-live-region')) {
      const region = document.createElement('div');
      region.id = 'filter-range-live-region';
      region.className = 'sr-only';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    
    return () => {
      const region = document.getElementById('filter-range-live-region');
      if (region && region.textContent?.includes(fieldName)) {
        region.textContent = '';
      }
    };
  }, [fieldName]);

  return (
    <div 
      className="space-y-1"
      role="group"
      aria-labelledby={`${groupId}-label`}
      aria-describedby={descriptionId}
      id={groupId}
    >
      <div id={`${groupId}-label`} className="sr-only">Intervalo de {fieldName}</div>
      <div id={descriptionId} className="sr-only">{getAriaDescription()}</div>
      
      <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Input 
            type="text" 
            id={minId}
            placeholder={inputPrefix ? `${inputPrefix} ${minPlaceholder}` : minPlaceholder}
            className={cn(
              "h-10 text-sm",
              minError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={formatDisplayValue(minValue)}
            onChange={(e) => handleMinChange(e.target.value.replace(/[^\d.,\-]/g, ''))}
            onKeyDown={(e) => handleKeyDown(e, true)}
            aria-label={ariaLabelMin}
            aria-invalid={!!minError}
            aria-describedby={`${descriptionId}${minError ? ` ${minErrorId}` : ''}`}
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
          <label htmlFor={minId} className="sr-only">{ariaLabelMin}</label>
          {inputSuffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{inputSuffix}</span>
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <Input 
            type="text" 
            id={maxId}
            placeholder={inputPrefix ? `${inputPrefix} ${maxPlaceholder}` : maxPlaceholder}
            className={cn(
              "h-10 text-sm",
              maxError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-brand-500"
            )}
            value={formatDisplayValue(maxValue)}
            onChange={(e) => handleMaxChange(e.target.value.replace(/[^\d.,\-]/g, ''))}
            onKeyDown={(e) => handleKeyDown(e, false)}
            aria-label={ariaLabelMax}
            aria-invalid={!!maxError}
            aria-describedby={`${descriptionId}${maxError ? ` ${maxErrorId}` : ''}`}
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "\\d*"}
          />
          <label htmlFor={maxId} className="sr-only">{ariaLabelMax}</label>
          {inputSuffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{inputSuffix}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Error messages with proper aria attributes */}
      {(minError || maxError) && (
        <div className="flex justify-between text-xs">
          {minError && (
            <p id={minErrorId} className="text-red-500" role="alert">
              {minError}
            </p>
          )}
          {maxError && (
            <p id={maxErrorId} className="text-red-500 ml-auto" role="alert">
              {maxError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(AccessibleFilterRangeInput);

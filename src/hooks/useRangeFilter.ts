
import { useCallback, useEffect } from 'react';
import { useRangeValues, RangeValues } from './useRangeValues';
import { useRangeFormatting } from './useRangeFormatting';
import { useRangeValidation } from './useRangeValidation';

export type { RangeValues } from './useRangeValues';

export interface RangeFilterOptions {
  defaultMin?: string;
  defaultMax?: string;
  allowDecimals?: boolean;
  allowNegative?: boolean;
  minAllowed?: number;
  maxAllowed?: number;
  onChange?: (values: RangeValues) => void;
  formatDisplay?: boolean;
  useThousandSeparator?: boolean;
}

/**
 * Hook unificado para gerenciar filtros de intervalo
 * Combina formatação, validação e gerenciamento de estado
 * Agora refatorado para usar hooks especializados
 */
export function useRangeFilter(initialValues: RangeValues, options: RangeFilterOptions = {}) {
  const {
    defaultMin,
    defaultMax,
    allowDecimals = false,
    allowNegative = false,
    minAllowed,
    maxAllowed,
    onChange,
    formatDisplay = true,
    useThousandSeparator = true,
  } = options;
  
  // Usar hook especializado para gerenciar valores
  const {
    values,
    isActive,
    editingField,
    userInteracted,
    handleMinChange: setMinValue,
    handleMaxChange: setMaxValue,
    finishEditing,
    resetValues,
    updateValues,
    hasInteracted
  } = useRangeValues({
    defaultMin,
    defaultMax,
    onChange,
    initialMin: initialValues.min,
    initialMax: initialValues.max
  });
  
  // Usar hook especializado para formatação
  const { formatValue, sanitizeInput } = useRangeFormatting({
    allowDecimals,
    useThousandSeparator,
    formatDisplay
  });
  
  // Usar hook especializado para validação
  const { errors, validateValue, correctValue } = useRangeValidation({
    minAllowed,
    maxAllowed,
    values
  });
  
  // Processar mudança no valor mínimo
  const handleMinChange = useCallback((newValue: string) => {
    // Sanitizar o valor antes de atualizar
    const sanitizedValue = sanitizeInput(newValue, allowNegative);
    setMinValue(sanitizedValue);
  }, [sanitizeInput, setMinValue, allowNegative]);
  
  // Processar mudança no valor máximo
  const handleMaxChange = useCallback((newValue: string) => {
    // Sanitizar o valor antes de atualizar
    const sanitizedValue = sanitizeInput(newValue, allowNegative);
    setMaxValue(sanitizedValue);
  }, [sanitizeInput, setMaxValue, allowNegative]);
  
  // Validar e corrigir valores ao sair do campo
  const handleBlur = useCallback((isMin: boolean) => {
    // Finalizar edição
    finishEditing();
    
    const fieldName = isMin ? 'min' : 'max';
    const valueToValidate = values[fieldName];
    
    // Se o campo estiver vazio após a edição, não fazer nada
    if (!valueToValidate) {
      return;
    }
    
    // Corrigir o valor se necessário
    const correctedValue = correctValue(valueToValidate, isMin);
    
    // Atualizar apenas se o valor foi corrigido
    if (correctedValue !== valueToValidate) {
      updateValues({ [fieldName]: correctedValue });
    }
  }, [finishEditing, values, correctValue, updateValues]);
  
  // Calcular valores de exibição formatados
  const displayValues = {
    min: formatValue(values.min, editingField.current === 'min'),
    max: formatValue(values.max, editingField.current === 'max')
  };
  
  // Inicializar com valores padrão para exibição se os valores iniciais estiverem vazios
  useEffect(() => {
    if (!values.min && !values.max && defaultMin && defaultMax) {
      updateValues({ min: defaultMin, max: defaultMax });
    }
  }, [defaultMin, defaultMax, values.min, values.max, updateValues]);
  
  return {
    values,
    displayValues,
    errors,
    isActive,
    handleMinChange,
    handleMaxChange,
    handleBlur,
    resetValues,
    userHasInteracted: hasInteracted
  };
}

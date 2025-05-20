
import { useCallback, useEffect, useRef } from 'react';
import { useRangeValues, RangeValues } from './useRangeValues';
import { useRangeFormatting } from './useRangeFormatting';
import { useRangeValidation } from './useRangeValidation';
import { throttle } from '@/utils/performanceUtils';

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
  prefix?: string;
  suffix?: string;
}

/**
 * Hook unificado para gerenciar filtros de intervalo
 * Combina formatação, validação e gerenciamento de estado
 * Otimizado para desempenho com grandes conjuntos de dados
 */
export function useRangeFilter(initialValues: RangeValues, options: RangeFilterOptions = {}) {
  const {
    defaultMin = '',
    defaultMax = '',
    allowDecimals = false,
    allowNegative = false,
    minAllowed,
    maxAllowed,
    onChange,
    formatDisplay = true,
    useThousandSeparator = true,
    prefix = '',
    suffix = '',
  } = options;
  
  // Prevent initialization loops
  const hasInitialized = useRef(false);
  
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
  const { formatValue, sanitizeInput, addAffixes, removeAffixes } = useRangeFormatting({
    allowDecimals,
    useThousandSeparator,
    formatDisplay,
    prefix,
    suffix
  });
  
  // Usar hook especializado para validação
  const { errors, validateValue, correctValue } = useRangeValidation({
    minAllowed,
    maxAllowed,
    values
  });
  
  // Processar mudança no valor mínimo - otimizado com throttle para melhor desempenho
  const handleMinChange = useCallback(throttle((newValue: string) => {
    // Sanitizar o valor antes de atualizar
    const sanitizedValue = sanitizeInput(newValue, allowNegative);
    setMinValue(sanitizedValue);
  }, 16), [sanitizeInput, setMinValue, allowNegative]);
  
  // Processar mudança no valor máximo - otimizado com throttle para melhor desempenho
  const handleMaxChange = useCallback(throttle((newValue: string) => {
    // Sanitizar o valor antes de atualizar
    const sanitizedValue = sanitizeInput(newValue, allowNegative);
    setMaxValue(sanitizedValue);
  }, 16), [sanitizeInput, setMaxValue, allowNegative]);
  
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
    min: editingField.current === 'min' ? values.min : addAffixes(formatValue(values.min, false)),
    max: editingField.current === 'max' ? values.max : addAffixes(formatValue(values.max, false))
  };
  
  // Inicializar com valores padrão para exibição se os valores iniciais estiverem vazios
  useEffect(() => {
    // Prevent initialization loops by only running once
    if (hasInitialized.current) return;
    
    if (!values.min && !values.max && defaultMin && defaultMax) {
      updateValues({ min: defaultMin, max: defaultMax });
    }
    
    hasInitialized.current = true;
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
    userHasInteracted: hasInteracted,
    // Expor métodos de formatação para uso externo se necessário
    formatValue,
    sanitizeInput,
    addAffixes,
    removeAffixes
  };
}

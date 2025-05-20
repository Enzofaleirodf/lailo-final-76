
import { useState, useCallback, useEffect } from 'react';

export interface RangeValues {
  min: string;
  max: string;
}

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
  
  // Estado do filtro
  const [values, setValues] = useState<RangeValues>(initialValues);
  const [errors, setErrors] = useState<{min: string | null, max: string | null}>({min: null, max: null});
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Determinar se o filtro está ativo (valores diferentes dos padrões)
  useEffect(() => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const active = values.min !== defaultMin || values.max !== defaultMax;
      setIsActive(active);
    }
  }, [values, defaultMin, defaultMax]);
  
  // Validar valores de entrada
  const validateValue = useCallback((value: string, isMin: boolean): string | null => {
    if (!value) return null;
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Valor inválido';
    }
    
    if (isMin) {
      if (minAllowed !== undefined && numValue < minAllowed) {
        return `Mínimo: ${minAllowed}`;
      }
      if (values.max && Number(values.max) < numValue) {
        return 'Maior que máximo';
      }
    } else {
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        return `Máximo: ${maxAllowed}`;
      }
      if (values.min && Number(values.min) > numValue) {
        return 'Menor que mínimo';
      }
    }
    
    return null;
  }, [values.min, values.max, minAllowed, maxAllowed]);
  
  // Formatar valor para exibição
  const formatValue = useCallback((value: string): string => {
    if (!value || !formatDisplay) return value;
    
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numValue)) return value;
    
    return numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: useThousandSeparator
    });
  }, [allowDecimals, formatDisplay, useThousandSeparator]);
  
  // Processar mudança no valor mínimo
  const handleMinChange = useCallback((newValue: string) => {
    // Sanitizar entrada
    let cleanValue = newValue;
    
    if (allowDecimals) {
      const regex = allowNegative ? /[^\d.-]/g : /[^\d.]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
      
      if (allowNegative && cleanValue.includes('-')) {
        cleanValue = `-${cleanValue.replace(/-/g, '')}`;
      }
    } else {
      const regex = allowNegative ? /[^\d-]/g : /\D/g;
      cleanValue = cleanValue.replace(regex, '');
      
      if (allowNegative && cleanValue.includes('-')) {
        cleanValue = `-${cleanValue.replace(/-/g, '')}`;
      }
    }
    
    // Atualizar estado
    const newValues = { ...values, min: cleanValue };
    setValues(newValues);
    
    // Validar
    const error = validateValue(cleanValue, true);
    setErrors(prev => ({ ...prev, min: error }));
    
    // Notificar mudança
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, validateValue, allowDecimals, allowNegative]);
  
  // Processar mudança no valor máximo
  const handleMaxChange = useCallback((newValue: string) => {
    // Sanitizar entrada
    let cleanValue = newValue;
    
    if (allowDecimals) {
      const regex = allowNegative ? /[^\d.-]/g : /[^\d.]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
      
      if (allowNegative && cleanValue.includes('-')) {
        cleanValue = `-${cleanValue.replace(/-/g, '')}`;
      }
    } else {
      const regex = allowNegative ? /[^\d-]/g : /\D/g;
      cleanValue = cleanValue.replace(regex, '');
      
      if (allowNegative && cleanValue.includes('-')) {
        cleanValue = `-${cleanValue.replace(/-/g, '')}`;
      }
    }
    
    // Atualizar estado
    const newValues = { ...values, max: cleanValue };
    setValues(newValues);
    
    // Validar
    const error = validateValue(cleanValue, false);
    setErrors(prev => ({ ...prev, max: error }));
    
    // Notificar mudança
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, validateValue, allowDecimals, allowNegative]);
  
  // Resetar para valores padrão
  const resetValues = useCallback(() => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const defaultValues = { min: defaultMin, max: defaultMax };
      setValues(defaultValues);
      setErrors({ min: null, max: null });
      
      if (onChange) {
        onChange(defaultValues);
      }
    }
  }, [defaultMin, defaultMax, onChange]);
  
  return {
    values,
    errors,
    isActive,
    handleMinChange,
    handleMaxChange,
    resetValues,
    formatValue
  };
}

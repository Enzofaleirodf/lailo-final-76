
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRangeValidation } from './useRangeValidation';
import { useRangeDisplayFormat } from './useRangeDisplayFormat';

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
  prefix?: string;
  suffix?: string;
}

/**
 * Hook para gerenciar campos de entrada de intervalo com estado, validação e formatação
 * Versão otimizada com memoização e cache para reduzir recálculos
 */
export function useRangeFilter(
  initialValues: RangeValues,
  options: RangeFilterOptions = {}
) {
  // Desestruturar opções com valores padrão
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
    prefix,
    suffix
  } = options;

  // Cache de valores processados anteriormente para evitar recálculos
  const formatCache = useRef<Record<string, string>>({});
  const onChangeCallRef = useRef(false);
  
  // Estado para rastrear valores de entrada
  const [values, setValues] = useState<RangeValues>({
    min: initialValues.min || defaultMin,
    max: initialValues.max || defaultMax
  });

  // Usar hooks especializados para validação e formatação
  const { errors, validateValue, correctValue } = useRangeValidation({
    minAllowed,
    maxAllowed,
    values
  });

  const { formatDisplayValue } = useRangeDisplayFormat({
    allowDecimals,
    useThousandSeparator
  });

  // Formatar valores para exibição com cache
  const displayValues = useMemo(() => {
    const getCachedFormat = (value: string, type: 'min' | 'max') => {
      const cacheKey = `${type}:${value}:${useThousandSeparator}:${formatDisplay}:${prefix}:${suffix}`;
      
      if (!formatCache.current[cacheKey] && value) {
        formatCache.current[cacheKey] = formatDisplayValue(value);
      }
      
      return value ? (formatCache.current[cacheKey] || formatDisplayValue(value)) : '';
    };
    
    return {
      min: getCachedFormat(values.min, 'min'),
      max: getCachedFormat(values.max, 'max')
    };
  }, [values.min, values.max, formatDisplayValue, useThousandSeparator, formatDisplay, prefix, suffix]);

  // Atualizar o componente pai quando os valores mudarem
  useEffect(() => {
    // Evitar a chamada de onChange na primeira renderização
    if (!onChangeCallRef.current) {
      onChangeCallRef.current = true;
      return;
    }
    
    if (onChange) {
      onChange(values);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  // Manipuladores de eventos para campos min/max
  const handleMinChange = useCallback((value: string) => {
    setValues(prev => ({ ...prev, min: value }));
  }, []);

  const handleMaxChange = useCallback((value: string) => {
    setValues(prev => ({ ...prev, max: value }));
  }, []);

  // Validar valores quando o usuário sai do campo
  const handleBlur = useCallback((isMin: boolean) => {
    const value = isMin ? values.min : values.max;
    const { error } = validateValue(value, isMin);
    
    // Se houver erro, corrigir o valor
    if (error) {
      const correctedValue = correctValue(value, isMin);
      if (isMin) {
        setValues(prev => ({ ...prev, min: correctedValue }));
      } else {
        setValues(prev => ({ ...prev, max: correctedValue }));
      }
    }
  }, [validateValue, correctValue, values]);

  // Reset para valores padrão
  const resetToDefaults = useCallback(() => {
    setValues({
      min: defaultMin,
      max: defaultMax
    });
  }, [defaultMin, defaultMax]);

  return {
    values,
    displayValues,
    errors,
    handleMinChange,
    handleMaxChange,
    handleBlur,
    resetToDefaults
  };
}

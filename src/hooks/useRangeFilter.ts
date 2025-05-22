
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
 * Versão otimizada com memoização e controle para evitar loops de renderização
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
  const prevValues = useRef<RangeValues>({min: '', max: ''});
  
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
      // Se não há valor, retornar string vazia
      if (!value) return '';
      
      // Criar chave única para cache
      const cacheKey = `${type}:${value}:${useThousandSeparator}:${formatDisplay}:${prefix}:${suffix}`;
      
      // Usar valor em cache se existir
      if (formatCache.current[cacheKey]) {
        return formatCache.current[cacheKey];
      }
      
      // Caso contrário, calcular e armazenar em cache
      const formattedValue = formatDisplayValue(value);
      formatCache.current[cacheKey] = formattedValue;
      
      return formattedValue;
    };
    
    return {
      min: getCachedFormat(values.min, 'min'),
      max: getCachedFormat(values.max, 'max')
    };
  }, [values.min, values.max, formatDisplayValue, useThousandSeparator, formatDisplay, prefix, suffix]);

  // Handler para evitar chamadas desnecessárias ao onChange
  const notifyChange = useCallback(() => {
    if (!onChange) return;
    
    // Verificar se os valores realmente mudaram
    if (
      prevValues.current.min !== values.min || 
      prevValues.current.max !== values.max
    ) {
      prevValues.current = {...values};
      onChange(values);
    }
  }, [onChange, values]);

  // Atualizar o componente pai quando os valores mudarem
  useEffect(() => {
    // Evitar a chamada de onChange na primeira renderização
    if (!onChangeCallRef.current) {
      onChangeCallRef.current = true;
      prevValues.current = {...values};
      return;
    }
    
    // Usar timeout para evitar múltiplas chamadas em sequência
    const timer = setTimeout(() => {
      notifyChange();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [values, notifyChange]);

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


import { useState, useCallback, useEffect } from 'react';
import { RangeValues } from './useRangeValues';

interface UseRangeValidationOptions {
  minAllowed?: number;
  maxAllowed?: number;
  values: RangeValues;
}

/**
 * Hook especializado na validação de valores de intervalo
 */
export function useRangeValidation(options: UseRangeValidationOptions) {
  const { 
    minAllowed,
    maxAllowed,
    values
  } = options;
  
  // Estado de erro para validação
  const [errors, setErrors] = useState<{min: string | null, max: string | null}>({min: null, max: null});
  
  // Validar valores após edição completa
  const validateValue = useCallback((value: string, isMin: boolean): {
    value: string,
    error: string | null
  } => {
    // Se o valor for vazio, não há erro
    if (!value) {
      return { value, error: null };
    }
    
    // Converter para número
    let numValue = Number(value);
    
    // Verificar se é um número válido
    if (isNaN(numValue)) {
      return { value, error: 'Valor inválido' };
    }
    
    let error: string | null = null;
    
    // Verificar limites permitidos
    if (isMin) {
      // Para campo de valor mínimo
      if (minAllowed !== undefined && numValue < minAllowed) {
        error = `Mín: ${minAllowed}`;
      }
      // Se o valor for maior que o máximo selecionado e o máximo não estiver vazio
      else if (values.max && Number(values.max) < numValue) {
        error = 'Maior que máximo';
      }
    } else {
      // Para campo de valor máximo
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        error = `Máx: ${maxAllowed}`;
      }
      // Se o valor for menor que o mínimo selecionado e o mínimo não estiver vazio
      else if (values.min && Number(values.min) > numValue) {
        error = 'Menor que mínimo';
      }
    }
    
    // Retornar valor e possível erro
    return { value, error };
  }, [values.min, values.max, minAllowed, maxAllowed]);
  
  // Validar valores quando mudam
  useEffect(() => {
    // Validar valor mínimo
    if (values.min) {
      const { error } = validateValue(values.min, true);
      setErrors(prev => ({ ...prev, min: error }));
    } else {
      setErrors(prev => ({ ...prev, min: null }));
    }
    
    // Validar valor máximo
    if (values.max) {
      const { error } = validateValue(values.max, false);
      setErrors(prev => ({ ...prev, max: error }));
    } else {
      setErrors(prev => ({ ...prev, max: null }));
    }
  }, [values, validateValue]);
  
  // Corrigir valor de acordo com validação
  const correctValue = useCallback((value: string, isMin: boolean): string => {
    if (!value) return value;
    
    const numValue = Number(value);
    if (isNaN(numValue)) return value;
    
    let correctedValue = value;
    
    if (isMin) {
      // Ajustar valor mínimo se estiver fora dos limites
      if (minAllowed !== undefined && numValue < minAllowed) {
        correctedValue = String(minAllowed);
      }
      // Se for maior que o máximo, corrigir para o valor máximo
      else if (values.max && numValue > Number(values.max)) {
        correctedValue = values.max;
      }
    } else {
      // Ajustar valor máximo se estiver fora dos limites
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        correctedValue = String(maxAllowed);
      }
      // Se for menor que o mínimo, corrigir para o valor mínimo
      else if (values.min && numValue < Number(values.min)) {
        correctedValue = values.min;
      }
    }
    
    return correctedValue;
  }, [values.min, values.max, minAllowed, maxAllowed]);
  
  return {
    errors,
    validateValue,
    correctValue
  };
}

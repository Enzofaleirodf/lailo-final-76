
import { useState, useEffect, useCallback } from 'react';

interface RangeValidationOptions {
  /**
   * Valor mínimo permitido
   */
  minAllowed?: number;
  /**
   * Valor máximo permitido
   */
  maxAllowed?: number;
  /**
   * Callback para lidar com a atualização do valor mínimo
   */
  onMinChange: (value: string) => void;
  /**
   * Callback para lidar com a atualização do valor máximo
   */
  onMaxChange: (value: string) => void;
  /**
   * Se deve permitir valores decimais
   * @default false
   */
  allowDecimals?: boolean;
  /**
   * Se deve permitir valores negativos
   * @default false
   */
  allowNegative?: boolean;
  /**
   * Número máximo de caracteres permitidos
   * @default 10
   */
  maxLength?: number;
  /**
   * Se deve validar automaticamente após um atraso
   * @default true
   */
  autoValidate?: boolean;
  /**
   * Atraso em ms para validação automática
   * @default 500
   */
  validationDelay?: number;
}

/**
 * Hook personalizado para validação de filtros de intervalo
 * com tratamento aprimorado para casos extremos e de borda
 * 
 * @param minValue Valor mínimo atual
 * @param maxValue Valor máximo atual
 * @param options Opções de validação
 */
export const useFilterRangeValidator = (
  minValue: string,
  maxValue: string,
  options: RangeValidationOptions
) => {
  const {
    minAllowed,
    maxAllowed,
    onMinChange,
    onMaxChange,
    allowDecimals = false,
    allowNegative = false,
    maxLength = 10,
    autoValidate = true,
    validationDelay = 500,
  } = options;
  
  const [minError, setMinError] = useState<string | null>(null);
  const [maxError, setMaxError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Função para validar um valor numérico
  const validateNumericValue = useCallback((value: string, isMin: boolean): string | null => {
    // Se vazio, não há erro
    if (!value) return null;
    
    // Verificar se é um número válido
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Digite um número válido';
    }
    
    // Verificar limites
    if (isMin) {
      if (minAllowed !== undefined && numValue < minAllowed) {
        return `Valor mínimo: ${minAllowed}`;
      }
      if (maxValue && numValue > Number(maxValue)) {
        return 'Menor que valor máximo';
      }
    } else {
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        return `Valor máximo: ${maxAllowed}`;
      }
      if (minValue && numValue < Number(minValue)) {
        return 'Maior que valor mínimo';
      }
    }
    
    return null;
  }, [minAllowed, maxAllowed, minValue, maxValue]);
  
  // Validar valores quando alterados
  useEffect(() => {
    if (!isDirty && !autoValidate) return;
    
    const minValidationTimeout = setTimeout(() => {
      setMinError(validateNumericValue(minValue, true));
    }, validationDelay);
    
    const maxValidationTimeout = setTimeout(() => {
      setMaxError(validateNumericValue(maxValue, false));
    }, validationDelay);
    
    return () => {
      clearTimeout(minValidationTimeout);
      clearTimeout(maxValidationTimeout);
    };
  }, [minValue, maxValue, validateNumericValue, isDirty, autoValidate, validationDelay]);
  
  // Funções para validação e atualização com tratamento melhorado
  const handleMinChange = useCallback((value: string) => {
    // Marcar como sujo para iniciar validação
    setIsDirty(true);
    
    // Tratar diferentes casos de entrada
    let cleanValue = value;
    
    // Impedir valores muito longos
    if (cleanValue.length > maxLength) {
      cleanValue = cleanValue.slice(0, maxLength);
    }
    
    // Tratar valores numéricos com base nas opções
    if (allowDecimals) {
      // Permitir apenas dígitos, ponto decimal e sinal negativo opcional
      const regex = allowNegative ? /[^\d.-]/g : /[^\d.]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      // Garantir apenas um ponto decimal
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
      
      // Garantir apenas um sinal negativo no início
      if (allowNegative && cleanValue.includes('-')) {
        if (cleanValue.indexOf('-') !== 0) {
          cleanValue = cleanValue.replace(/-/g, '');
        } else {
          cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
        }
      }
    } else {
      // Permitir apenas dígitos e sinal negativo opcional
      const regex = allowNegative ? /[^\d-]/g : /[^\d]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      // Garantir apenas um sinal negativo no início
      if (allowNegative && cleanValue.includes('-')) {
        if (cleanValue.indexOf('-') !== 0) {
          cleanValue = cleanValue.replace(/-/g, '');
        } else {
          cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
        }
      }
    }
    
    // Validar imediatamente para feedback rápido
    if (autoValidate) {
      setMinError(validateNumericValue(cleanValue, true));
    }
    
    // Chamar callback
    onMinChange(cleanValue);
  }, [onMinChange, validateNumericValue, allowDecimals, allowNegative, maxLength, autoValidate]);
  
  const handleMaxChange = useCallback((value: string) => {
    setIsDirty(true);
    
    let cleanValue = value;
    
    // Impedir valores muito longos
    if (cleanValue.length > maxLength) {
      cleanValue = cleanValue.slice(0, maxLength);
    }
    
    // Tratar valores numéricos com base nas opções
    if (allowDecimals) {
      const regex = allowNegative ? /[^\d.-]/g : /[^\d.]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
      
      if (allowNegative && cleanValue.includes('-')) {
        if (cleanValue.indexOf('-') !== 0) {
          cleanValue = cleanValue.replace(/-/g, '');
        } else {
          cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
        }
      }
    } else {
      const regex = allowNegative ? /[^\d-]/g : /[^\d]/g;
      cleanValue = cleanValue.replace(regex, '');
      
      if (allowNegative && cleanValue.includes('-')) {
        if (cleanValue.indexOf('-') !== 0) {
          cleanValue = cleanValue.replace(/-/g, '');
        } else {
          cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
        }
      }
    }
    
    if (autoValidate) {
      setMaxError(validateNumericValue(cleanValue, false));
    }
    
    onMaxChange(cleanValue);
  }, [onMaxChange, validateNumericValue, allowDecimals, allowNegative, maxLength, autoValidate]);
  
  // Validar explicitamente e retornar se há erros
  const validateRange = useCallback((): boolean => {
    const minResult = validateNumericValue(minValue, true);
    const maxResult = validateNumericValue(maxValue, false);
    
    setMinError(minResult);
    setMaxError(maxResult);
    
    return !minResult && !maxResult;
  }, [minValue, maxValue, validateNumericValue]);
  
  // Limpar erros
  const clearErrors = useCallback(() => {
    setMinError(null);
    setMaxError(null);
    setIsDirty(false);
  }, []);
  
  return {
    minError,
    maxError,
    handleMinChange,
    handleMaxChange,
    validateRange,
    clearErrors,
    hasErrors: !!minError || !!maxError,
  };
};

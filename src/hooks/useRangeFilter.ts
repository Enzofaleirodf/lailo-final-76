
import { useState, useCallback, useEffect, useRef } from 'react';

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
  const [values, setValues] = useState<RangeValues>({
    min: initialValues.min || '',
    max: initialValues.max || ''
  });
  
  // Estado de exibição para permitir formatação diferente do valor real
  const [displayValues, setDisplayValues] = useState<RangeValues>({
    min: initialValues.min || '',
    max: initialValues.max || ''
  });
  
  const [errors, setErrors] = useState<{min: string | null, max: string | null}>({min: null, max: null});
  
  // Referência para rastrear interações do usuário
  const userHasInteracted = useRef<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Efeito para garantir que os valores padrão sejam exibidos
  useEffect(() => {
    if (defaultMin || defaultMax) {
      // Mostrar valores padrão apenas para exibição, sem marcar como filtro ativo
      setDisplayValues(prev => ({
        min: prev.min || defaultMin || '',
        max: prev.max || defaultMax || ''
      }));
      
      // Se os valores reais estiverem vazios, mas temos valores padrão
      if (!values.min && !values.max) {
        setValues({
          min: defaultMin || '',
          max: defaultMax || ''
        });
      }
    }
  }, [defaultMin, defaultMax]);

  // Determinar se o filtro está ativo apenas se o usuário tiver interagido com ele
  // e os valores forem diferentes dos padrões
  useEffect(() => {
    if (!userHasInteracted.current) return;
    
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const active = values.min !== defaultMin || values.max !== defaultMax;
      setIsActive(active);
    }
  }, [values, defaultMin, defaultMax]);
  
  // Validar valores após edição completa (saída do campo)
  const validateValues = useCallback((value: string, isMin: boolean): {
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
    
    // Aplicar limites e restrições
    if (isMin) {
      // Para campo de valor mínimo
      if (minAllowed !== undefined && numValue < minAllowed) {
        error = `Mín: ${minAllowed}`;
      }
      
      // Se o valor for maior que o máximo selecionado e o máximo não estiver vazio
      if (values.max && Number(values.max) < numValue) {
        error = 'Maior que máximo';
      }
    } else {
      // Para campo de valor máximo
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        error = `Máx: ${maxAllowed}`;
      }
      
      // Se o valor for menor que o mínimo selecionado e o mínimo não estiver vazio
      if (values.min && Number(values.min) > numValue) {
        error = 'Menor que mínimo';
      }
    }
    
    // Retornar valor e possível erro
    return { value, error };
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
    // Marcar que o usuário interagiu com o filtro
    userHasInteracted.current = true;
    
    // Atualizar o valor de exibição imediatamente para feedback do usuário
    setDisplayValues(prev => ({ ...prev, min: newValue }));
    
    // Para o valor real, vamos sanitizar de forma menos agressiva
    let cleanValue = newValue;
    if (!allowDecimals) {
      cleanValue = cleanValue.replace(/[^\d-]/g, '');
    } else if (allowDecimals) {
      // Permitir números e um ponto decimal
      cleanValue = cleanValue.replace(/[^\d.-]/g, '');
      
      // Garantir apenas um ponto decimal
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    }
    
    if (allowNegative && cleanValue.startsWith('-')) {
      // Manter o sinal negativo apenas no início
      cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
    } else if (!allowNegative) {
      cleanValue = cleanValue.replace(/-/g, '');
    }
    
    // Atualizar o valor real
    const newValues = { ...values, min: cleanValue };
    setValues(newValues);
    
    // Notificar mudança mesmo durante digitação
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, allowDecimals, allowNegative]);
  
  // Processar mudança no valor máximo
  const handleMaxChange = useCallback((newValue: string) => {
    // Marcar que o usuário interagiu com o filtro
    userHasInteracted.current = true;
    
    // Atualizar o valor de exibição imediatamente para feedback do usuário
    setDisplayValues(prev => ({ ...prev, max: newValue }));
    
    // Para o valor real, vamos sanitizar de forma menos agressiva
    let cleanValue = newValue;
    if (!allowDecimals) {
      cleanValue = cleanValue.replace(/[^\d-]/g, '');
    } else if (allowDecimals) {
      // Permitir números e um ponto decimal
      cleanValue = cleanValue.replace(/[^\d.-]/g, '');
      
      // Garantir apenas um ponto decimal
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    }
    
    if (allowNegative && cleanValue.startsWith('-')) {
      // Manter o sinal negativo apenas no início
      cleanValue = `-${cleanValue.substring(1).replace(/-/g, '')}`;
    } else if (!allowNegative) {
      cleanValue = cleanValue.replace(/-/g, '');
    }
    
    // Atualizar o valor real
    const newValues = { ...values, max: cleanValue };
    setValues(newValues);
    
    // Notificar mudança mesmo durante digitação
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, allowDecimals, allowNegative]);
  
  // Validar valor quando o usuário termina a edição
  const handleBlur = useCallback((isMin: boolean) => {
    const valueToValidate = isMin ? values.min : values.max;
    const { value, error } = validateValues(valueToValidate, isMin);
    
    // Atualizar erros
    setErrors(prev => ({
      ...prev,
      [isMin ? 'min' : 'max']: error
    }));
    
    // Se o campo estiver vazio após a edição, restaurar para o valor padrão
    if (!valueToValidate) {
      const defaultValue = isMin ? defaultMin : defaultMax;
      if (defaultValue) {
        if (isMin) {
          handleMinChange(defaultValue);
          setDisplayValues(prev => ({ ...prev, min: defaultValue }));
        } else {
          handleMaxChange(defaultValue);
          setDisplayValues(prev => ({ ...prev, max: defaultValue }));
        }
      }
    }
    
    // Se houver erro de validação, corrigir o valor quando apropriado
    if (error) {
      if (isMin && minAllowed !== undefined && Number(valueToValidate) < minAllowed) {
        handleMinChange(String(minAllowed));
        setDisplayValues(prev => ({ ...prev, min: String(minAllowed) }));
      } else if (!isMin && maxAllowed !== undefined && Number(valueToValidate) > maxAllowed) {
        handleMaxChange(String(maxAllowed));
        setDisplayValues(prev => ({ ...prev, max: String(maxAllowed) }));
      }
    }
  }, [values, validateValues, defaultMin, defaultMax, handleMinChange, handleMaxChange, minAllowed, maxAllowed]);
  
  // Resetar para valores padrão
  const resetValues = useCallback(() => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const defaultValues = { min: defaultMin, max: defaultMax };
      setValues(defaultValues);
      setDisplayValues(defaultValues);
      setErrors({ min: null, max: null });
      userHasInteracted.current = false;
      setIsActive(false);
      
      if (onChange) {
        onChange(defaultValues);
      }
    }
  }, [defaultMin, defaultMax, onChange]);
  
  return {
    values,
    displayValues,
    errors,
    isActive,
    handleMinChange,
    handleMaxChange,
    handleBlur,
    resetValues,
    formatValue,
    userHasInteracted: userHasInteracted.current
  };
}

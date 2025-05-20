
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
    min: initialValues.min || (defaultMin || ''),
    max: initialValues.max || (defaultMax || '')
  });
  const [errors, setErrors] = useState<{min: string | null, max: string | null}>({min: null, max: null});
  
  // Referências para rastrear interações do usuário
  const userHasInteracted = useRef<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Efeito para garantir que os valores iniciais sejam sempre exibidos
  useEffect(() => {
    // Se os valores iniciais estiverem vazios mas temos valores padrão, use os valores padrão 
    // apenas para exibição, sem marcar como interação de usuário
    if ((!values.min && defaultMin) || (!values.max && defaultMax)) {
      setValues({
        min: values.min || defaultMin || '',
        max: values.max || defaultMax || ''
      });
    }
  }, [values.min, values.max, defaultMin, defaultMax]);

  // Determinar se o filtro está ativo apenas se o usuário tiver interagido com ele
  // e os valores forem diferentes dos padrões
  useEffect(() => {
    if (!userHasInteracted.current) return;
    
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const active = values.min !== defaultMin || values.max !== defaultMax;
      setIsActive(active);
    }
  }, [values, defaultMin, defaultMax]);
  
  // Validar valores de entrada e aplicar limites
  const validateAndConstrainValue = useCallback((value: string, isMin: boolean): {
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
    
    let newValue = value;
    let error: string | null = null;
    
    // Aplicar limites e restrições
    if (isMin) {
      // Para campo de valor mínimo
      if (minAllowed !== undefined && numValue < minAllowed) {
        numValue = minAllowed;
        newValue = String(minAllowed);
        error = null; // Não mostramos erro, apenas corrigimos
      }
      
      // Se o valor for maior que o máximo selecionado
      if (values.max && Number(values.max) < numValue) {
        return { value, error: 'Maior que máximo' };
      }
    } else {
      // Para campo de valor máximo
      if (maxAllowed !== undefined && numValue > maxAllowed) {
        numValue = maxAllowed;
        newValue = String(maxAllowed);
        error = null; // Não mostramos erro, apenas corrigimos
      }
      
      // Se o valor for menor que o mínimo selecionado
      if (values.min && Number(values.min) > numValue) {
        return { value, error: 'Menor que mínimo' };
      }
    }
    
    // Retornar valor possivelmente corrigido e mensagem de erro
    return { value: newValue, error };
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
    
    // Validar e restringir o valor
    const { value: constrainedValue, error } = validateAndConstrainValue(cleanValue, true);
    
    // Atualizar estado
    const newValues = { ...values, min: constrainedValue };
    setValues(newValues);
    
    // Atualizar erros
    setErrors(prev => ({ ...prev, min: error }));
    
    // Notificar mudança
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, validateAndConstrainValue, allowDecimals, allowNegative]);
  
  // Processar mudança no valor máximo
  const handleMaxChange = useCallback((newValue: string) => {
    // Marcar que o usuário interagiu com o filtro
    userHasInteracted.current = true;
    
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
    
    // Validar e restringir o valor
    const { value: constrainedValue, error } = validateAndConstrainValue(cleanValue, false);
    
    // Atualizar estado
    const newValues = { ...values, max: constrainedValue };
    setValues(newValues);
    
    // Atualizar erros
    setErrors(prev => ({ ...prev, max: error }));
    
    // Notificar mudança
    if (onChange) {
      onChange(newValues);
    }
  }, [values, onChange, validateAndConstrainValue, allowDecimals, allowNegative]);
  
  // Lidar com o caso do campo ficar vazio e o usuário sair do campo
  const handleBlur = useCallback((isMin: boolean) => {
    if (isMin && !values.min) {
      // Se o campo mínimo estiver vazio, restaurar para o mínimo permitido
      if (minAllowed !== undefined) {
        handleMinChange(String(minAllowed));
      } else if (defaultMin) {
        handleMinChange(defaultMin);
      }
    } else if (!isMin && !values.max) {
      // Se o campo máximo estiver vazio, restaurar para o máximo permitido
      if (maxAllowed !== undefined) {
        handleMaxChange(String(maxAllowed));
      } else if (defaultMax) {
        handleMaxChange(defaultMax);
      }
    }
  }, [values.min, values.max, minAllowed, maxAllowed, defaultMin, defaultMax, handleMinChange, handleMaxChange]);
  
  // Resetar para valores padrão
  const resetValues = useCallback(() => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const defaultValues = { min: defaultMin, max: defaultMax };
      setValues(defaultValues);
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

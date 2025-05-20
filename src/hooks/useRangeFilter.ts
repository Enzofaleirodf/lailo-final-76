
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
  
  // Estado do filtro - valores reais (sem formatação)
  const [values, setValues] = useState<RangeValues>({
    min: initialValues.min || '',
    max: initialValues.max || ''
  });
  
  // Estado de exibição para permitir formatação diferente do valor real
  const [displayValues, setDisplayValues] = useState<RangeValues>({
    min: formatDisplay ? formatValue(initialValues.min || '') : initialValues.min || '',
    max: formatDisplay ? formatValue(initialValues.max || '') : initialValues.max || ''
  });
  
  // Estado de erro para validação
  const [errors, setErrors] = useState<{min: string | null, max: string | null}>({min: null, max: null});
  
  // Referência para rastrear interações do usuário - crucial para não contar valores iniciais como filtros ativos
  const userHasInteracted = useRef<{min: boolean, max: boolean}>({min: false, max: false});
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Campo em modo de edição (para evitar formatação durante digitação)
  const editingField = useRef<'min' | 'max' | null>(null);
  
  // Função para formatar valor para exibição
  function formatValue(value: string): string {
    if (!value || !formatDisplay) return value;
    
    // Se estiver em modo de edição, não formate
    if ((editingField.current === 'min' && value === values.min) || 
        (editingField.current === 'max' && value === values.max)) {
      return value;
    }
    
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numValue)) return value;
    
    return numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: useThousandSeparator
    });
  }
  
  // Determinar se o filtro está ativo apenas se o usuário tiver interagido com ele
  // e os valores forem diferentes dos padrões
  useEffect(() => {
    const hasInteracted = userHasInteracted.current.min || userHasInteracted.current.max;
    
    if (defaultMin !== undefined && defaultMax !== undefined && hasInteracted) {
      const active = values.min !== defaultMin || values.max !== defaultMax;
      setIsActive(active);
    }
  }, [values, defaultMin, defaultMax]);
  
  // Limpar input - remove formatação e caracteres não numéricos
  const sanitizeInput = useCallback((value: string): string => {
    let sanitizedValue = value;
    
    // Permitir números, vírgulas e pontos
    if (!allowDecimals) {
      sanitizedValue = sanitizedValue.replace(/[^\d-]/g, '');
    } else {
      // Permitir decimais, manter vírgulas e pontos
      sanitizedValue = sanitizedValue.replace(/[^\d.,-]/g, '');
      
      // Converter vírgulas para pontos para cálculos
      sanitizedValue = sanitizedValue.replace(/,/g, '.');
      
      // Garantir apenas um ponto decimal
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    }
    
    // Tratar números negativos
    if (allowNegative && sanitizedValue.startsWith('-')) {
      // Manter o sinal negativo apenas no início
      sanitizedValue = `-${sanitizedValue.substring(1).replace(/-/g, '')}`;
    } else if (!allowNegative) {
      sanitizedValue = sanitizedValue.replace(/-/g, '');
    }
    
    return sanitizedValue;
  }, [allowDecimals, allowNegative]);
  
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
  
  // Processar mudança no valor mínimo
  const handleMinChange = useCallback((newValue: string) => {
    // Marcar campo como em edição
    editingField.current = 'min';
    
    // Marcar que o usuário interagiu com este campo específico
    userHasInteracted.current = { ...userHasInteracted.current, min: true };
    
    // Durante a digitação, mostrar o valor exato que o usuário está digitando
    setDisplayValues(prev => ({ ...prev, min: newValue }));
    
    // Para o valor real, sanitizar sem formatação
    const sanitizedValue = sanitizeInput(newValue);
    
    // Atualizar o valor real
    setValues(prev => ({ ...prev, min: sanitizedValue }));
    
    // Notificar mudança
    if (onChange) {
      onChange({ ...values, min: sanitizedValue });
    }
  }, [values, onChange, sanitizeInput]);
  
  // Processar mudança no valor máximo
  const handleMaxChange = useCallback((newValue: string) => {
    // Marcar campo como em edição
    editingField.current = 'max';
    
    // Marcar que o usuário interagiu com este campo específico
    userHasInteracted.current = { ...userHasInteracted.current, max: true };
    
    // Durante a digitação, mostrar o valor exato que o usuário está digitando
    setDisplayValues(prev => ({ ...prev, max: newValue }));
    
    // Para o valor real, sanitizar sem formatação
    const sanitizedValue = sanitizeInput(newValue);
    
    // Atualizar o valor real
    setValues(prev => ({ ...prev, max: sanitizedValue }));
    
    // Notificar mudança
    if (onChange) {
      onChange({ ...values, max: sanitizedValue });
    }
  }, [values, onChange, sanitizeInput]);
  
  // Validar valor quando o usuário termina a edição
  const handleBlur = useCallback((isMin: boolean) => {
    // Limpar indicador de campo em edição
    editingField.current = null;
    
    const fieldName = isMin ? 'min' : 'max';
    const valueToValidate = values[fieldName];
    const { value, error } = validateValues(valueToValidate, isMin);
    
    // Atualizar erros
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    // Se o campo estiver vazio após a edição, restaurar para o valor padrão
    if (!valueToValidate) {
      const defaultValue = isMin ? defaultMin : defaultMax;
      if (defaultValue) {
        // Atualizar valores
        setValues(prev => ({ ...prev, [fieldName]: defaultValue }));
        
        // Aplicar formatação para exibição
        const formattedValue = formatDisplay ? formatValue(defaultValue) : defaultValue;
        setDisplayValues(prev => ({ ...prev, [fieldName]: formattedValue }));
        
        // Notificar mudança
        if (onChange) {
          onChange({ ...values, [fieldName]: defaultValue });
        }
      }
    } else if (error) {
      // Se houver erro de validação, corrigir o valor quando apropriado
      let correctedValue = valueToValidate;
      
      if (isMin) {
        // Ajustar valor mínimo se estiver fora dos limites
        if (minAllowed !== undefined && Number(valueToValidate) < minAllowed) {
          correctedValue = String(minAllowed);
        }
        // Se for maior que o máximo, corrigir para o valor máximo
        else if (values.max && Number(valueToValidate) > Number(values.max)) {
          correctedValue = values.max;
        }
      } else {
        // Ajustar valor máximo se estiver fora dos limites
        if (maxAllowed !== undefined && Number(valueToValidate) > maxAllowed) {
          correctedValue = String(maxAllowed);
        }
        // Se for menor que o mínimo, corrigir para o valor mínimo
        else if (values.min && Number(valueToValidate) < Number(values.min)) {
          correctedValue = values.min;
        }
      }
      
      // Atualizar valores se houve correção
      if (correctedValue !== valueToValidate) {
        setValues(prev => ({ ...prev, [fieldName]: correctedValue }));
        
        // Aplicar formatação para exibição
        const formattedValue = formatDisplay ? formatValue(correctedValue) : correctedValue;
        setDisplayValues(prev => ({ ...prev, [fieldName]: formattedValue }));
        
        // Limpar o erro após a correção
        setErrors(prev => ({ ...prev, [fieldName]: null }));
        
        // Notificar mudança
        if (onChange) {
          onChange({ ...values, [fieldName]: correctedValue });
        }
      }
    } else {
      // Sem erro, apenas aplicar formatação para exibição após sair do campo
      const formattedValue = formatDisplay ? formatValue(valueToValidate) : valueToValidate;
      setDisplayValues(prev => ({ ...prev, [fieldName]: formattedValue }));
    }
  }, [values, validateValues, defaultMin, defaultMax, onChange, formatDisplay, minAllowed, maxAllowed]);
  
  // Resetar para valores padrão
  const resetValues = useCallback(() => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      const defaultValues = { min: defaultMin, max: defaultMax };
      setValues(defaultValues);
      
      // Aplicar formatação para valores de exibição
      setDisplayValues({
        min: formatDisplay ? formatValue(defaultMin) : defaultMin,
        max: formatDisplay ? formatValue(defaultMax) : defaultMax
      });
      
      setErrors({ min: null, max: null });
      userHasInteracted.current = { min: false, max: false };
      setIsActive(false);
      
      if (onChange) {
        onChange(defaultValues);
      }
    }
  }, [defaultMin, defaultMax, onChange, formatDisplay]);
  
  // Atualizar valores de exibição quando os valores reais mudam externamente
  useEffect(() => {
    if (!editingField.current) {
      setDisplayValues({
        min: formatDisplay ? formatValue(values.min) : values.min,
        max: formatDisplay ? formatValue(values.max) : values.max
      });
    }
  }, [values, formatDisplay]);
  
  // Inicializar com valores padrão para exibição se os valores iniciais estiverem vazios
  useEffect(() => {
    if (!values.min && !values.max && defaultMin && defaultMax) {
      setValues({ min: defaultMin, max: defaultMax });
      
      setDisplayValues({
        min: formatDisplay ? formatValue(defaultMin) : defaultMin,
        max: formatDisplay ? formatValue(defaultMax) : defaultMax
      });
    }
  }, [defaultMin, defaultMax, formatDisplay]);
  
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
    userHasInteracted: userHasInteracted.current.min || userHasInteracted.current.max
  };
}

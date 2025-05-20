
import { useState, useRef, useEffect } from 'react';

export interface RangeValues {
  min: string;
  max: string;
}

interface UseRangeValuesOptions {
  defaultMin?: string;
  defaultMax?: string;
  onChange?: (values: RangeValues) => void;
  initialMin?: string;
  initialMax?: string;
}

/**
 * Hook para gerenciar apenas os valores de intervalo
 * Separa a lógica de estado dos valores do resto da funcionalidade
 */
export function useRangeValues(options: UseRangeValuesOptions = {}) {
  const {
    defaultMin = '',
    defaultMax = '',
    onChange,
    initialMin = '',
    initialMax = ''
  } = options;

  // Estado do filtro - valores reais (sem formatação)
  const [values, setValues] = useState<RangeValues>({
    min: initialMin || '',
    max: initialMax || ''
  });
  
  // Referência para rastrear interações do usuário
  const userInteracted = useRef<{min: boolean, max: boolean}>({min: false, max: false});
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Campo em modo de edição (para evitar formatação durante digitação)
  const editingField = useRef<'min' | 'max' | null>(null);
  
  // Store previous values to avoid unnecessary updates
  const prevValuesRef = useRef<RangeValues>({ min: initialMin || '', max: initialMax || '' });
  
  // Determinar se o filtro está ativo apenas se o usuário tiver interagido com ele
  // e os valores forem diferentes dos padrões
  useEffect(() => {
    // Skip this effect if values haven't actually changed (prevents infinite loop)
    if (values.min === prevValuesRef.current.min && 
        values.max === prevValuesRef.current.max) {
      return;
    }
    
    // Update previous values reference
    prevValuesRef.current = {...values};
    
    const hasInteracted = userInteracted.current.min || userInteracted.current.max;
    
    if (hasInteracted) {
      // Verificar se os valores são realmente diferentes dos padrões
      // Considerando que valores vazios são iguais aos valores padrão
      const isMinDefault = !values.min || values.min === defaultMin;
      const isMaxDefault = !values.max || values.max === defaultMax;
      const active = !isMinDefault || !isMaxDefault;
      
      setIsActive(active);
    }
  }, [values, defaultMin, defaultMax]);

  // Atualizar valores
  const updateValues = (newValues: Partial<RangeValues>) => {
    const updatedValues = { ...values, ...newValues };
    
    // Skip update if nothing changed (prevents update loops)
    if (updatedValues.min === values.min && updatedValues.max === values.max) {
      return;
    }
    
    setValues(updatedValues);
    
    // Only trigger onChange if values actually changed
    if (onChange && 
        (updatedValues.min !== prevValuesRef.current.min || 
         updatedValues.max !== prevValuesRef.current.max)) {
      onChange(updatedValues);
    }
  };

  // Processar mudança no valor mínimo
  const handleMinChange = (newValue: string) => {
    // Marcar campo como em edição
    editingField.current = 'min';
    
    // Marcar que o usuário interagiu com este campo específico
    userInteracted.current = { ...userInteracted.current, min: true };
    
    // Atualizar o valor
    updateValues({ min: newValue });
  };
  
  // Processar mudança no valor máximo
  const handleMaxChange = (newValue: string) => {
    // Marcar campo como em edição
    editingField.current = 'max';
    
    // Marcar que o usuário interagiu com este campo específico
    userInteracted.current = { ...userInteracted.current, max: true };
    
    // Atualizar o valor
    updateValues({ max: newValue });
  };
  
  // Finalizar edição de campo
  const finishEditing = () => {
    editingField.current = null;
  };
  
  // Resetar para valores padrão
  const resetValues = () => {
    if (defaultMin !== undefined && defaultMax !== undefined) {
      // Skip if already at default values
      if (values.min === defaultMin && values.max === defaultMax) {
        return;
      }
      
      setValues({ min: defaultMin, max: defaultMax });
      userInteracted.current = { min: false, max: false };
      setIsActive(false);
      
      // Update previous values reference
      prevValuesRef.current = { min: defaultMin, max: defaultMax };
      
      if (onChange) {
        onChange({ min: defaultMin, max: defaultMax });
      }
    }
  };
  
  return {
    values,
    isActive,
    editingField,
    userInteracted: userInteracted.current,
    handleMinChange,
    handleMaxChange,
    finishEditing,
    resetValues,
    updateValues,
    hasInteracted: userInteracted.current.min || userInteracted.current.max
  };
}

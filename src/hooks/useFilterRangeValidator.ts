
import { useState, useEffect } from 'react';

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
}

/**
 * Hook personalizado para validação de filtros de intervalo
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
  const { minAllowed, maxAllowed, onMinChange, onMaxChange } = options;
  
  const [minError, setMinError] = useState<string | null>(null);
  const [maxError, setMaxError] = useState<string | null>(null);
  
  // Validar valores quando alterados
  useEffect(() => {
    // Validar valor mínimo
    if (minValue) {
      const numValue = Number(minValue);
      
      if (isNaN(numValue)) {
        setMinError('Digite um número válido');
      } else if (minAllowed !== undefined && numValue < minAllowed) {
        setMinError(`Valor mínimo: ${minAllowed}`);
      } else if (maxValue && numValue > Number(maxValue)) {
        setMinError('Menor que valor máximo');
      } else {
        setMinError(null);
      }
    } else {
      setMinError(null);
    }
    
    // Validar valor máximo
    if (maxValue) {
      const numValue = Number(maxValue);
      
      if (isNaN(numValue)) {
        setMaxError('Digite um número válido');
      } else if (maxAllowed !== undefined && numValue > maxAllowed) {
        setMaxError(`Valor máximo: ${maxAllowed}`);
      } else if (minValue && numValue < Number(minValue)) {
        setMaxError('Maior que valor mínimo');
      } else {
        setMaxError(null);
      }
    } else {
      setMaxError(null);
    }
  }, [minValue, maxValue, minAllowed, maxAllowed]);
  
  // Funções para validação e atualização
  const handleMinChange = (value: string) => {
    // Permitir apenas dígitos e limpar valor
    const cleanValue = value.replace(/[^\d]/g, '');
    onMinChange(cleanValue);
  };
  
  const handleMaxChange = (value: string) => {
    // Permitir apenas dígitos e limpar valor
    const cleanValue = value.replace(/[^\d]/g, '');
    onMaxChange(cleanValue);
  };
  
  return {
    minError,
    maxError,
    handleMinChange,
    handleMaxChange
  };
};

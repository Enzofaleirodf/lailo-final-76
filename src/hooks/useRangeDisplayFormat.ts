
import { useCallback } from 'react';

interface UseRangeDisplayFormatOptions {
  allowDecimals?: boolean;
  useThousandSeparator?: boolean;
}

/**
 * Hook para formatar valores de exibição em filtros de intervalo
 */
export const useRangeDisplayFormat = (options: UseRangeDisplayFormatOptions = {}) => {
  const { allowDecimals = false, useThousandSeparator = true } = options;
  
  /**
   * Formata o valor com separador de milhar
   */
  const formatDisplayValue = useCallback((value: string): string => {
    if (!value) return '';
    
    // Parse the value as a number (mantendo o separador de milhar)
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numValue)) return value;
    
    // Format with thousand separator only if enabled
    return numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: useThousandSeparator
    });
  }, [allowDecimals, useThousandSeparator]);
  
  return { formatDisplayValue };
};


import { useCallback } from 'react';

interface UseRangeFormattingOptions {
  allowDecimals?: boolean;
  useThousandSeparator?: boolean;
  formatDisplay?: boolean;
}

/**
 * Hook especializado em formatação de valores para filtros de intervalo
 */
export function useRangeFormatting(options: UseRangeFormattingOptions = {}) {
  const {
    allowDecimals = false,
    useThousandSeparator = true,
    formatDisplay = true
  } = options;
  
  // Função para formatar valor para exibição
  const formatValue = useCallback((value: string, isEditing: boolean = false): string => {
    if (!value || !formatDisplay || isEditing) return value;
    
    // Remover formatação para processar o valor numérico
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) return value;
    
    // Aplicar formatação em português brasileiro
    return numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: useThousandSeparator
    });
  }, [allowDecimals, useThousandSeparator, formatDisplay]);
  
  // Limpar input - remove formatação e caracteres não numéricos
  const sanitizeInput = useCallback((value: string, allowNegative: boolean = false): string => {
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
  }, [allowDecimals]);
  
  return {
    formatValue,
    sanitizeInput
  };
}

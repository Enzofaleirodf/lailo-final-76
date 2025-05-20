
import { useCallback } from 'react';

interface UseRangeFormattingOptions {
  allowDecimals?: boolean;
  useThousandSeparator?: boolean;
  formatDisplay?: boolean;
  prefix?: string;
  suffix?: string;
}

/**
 * Hook especializado em formatação de valores para filtros de intervalo
 * Melhorado para tratar prefixos e sufixos de forma consistente em todos os tamanhos de tela
 */
export function useRangeFormatting(options: UseRangeFormattingOptions = {}) {
  const {
    allowDecimals = false,
    useThousandSeparator = true,
    formatDisplay = true,
    prefix = '',
    suffix = ''
  } = options;
  
  // Função para formatar valor para exibição
  const formatValue = useCallback((value: string, isEditing: boolean = false): string => {
    if (!value || !formatDisplay || isEditing) return value;
    
    // Remover formatação para processar o valor numérico
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) return value;
    
    // Aplicar formatação em português brasileiro
    const formattedValue = numValue.toLocaleString('pt-BR', {
      maximumFractionDigits: allowDecimals ? 2 : 0,
      useGrouping: useThousandSeparator
    });
    
    return formattedValue;
  }, [allowDecimals, useThousandSeparator, formatDisplay]);
  
  // Limpar input - remove formatação e caracteres não numéricos
  const sanitizeInput = useCallback((value: string, allowNegative: boolean = false): string => {
    // Remover prefixo e sufixo se existirem
    let sanitizedValue = value;
    if (prefix && sanitizedValue.startsWith(prefix)) {
      sanitizedValue = sanitizedValue.slice(prefix.length);
    }
    
    if (suffix && sanitizedValue.endsWith(suffix)) {
      sanitizedValue = sanitizedValue.slice(0, -suffix.length);
    }
    
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
  }, [prefix, suffix, allowDecimals]);
  
  // Adicionar prefixo e sufixo para apresentação visual
  const addAffixes = useCallback((value: string): string => {
    if (!value) return value;
    
    let result = value;
    if (prefix && !result.startsWith(prefix)) {
      result = prefix + result;
    }
    
    if (suffix && !result.endsWith(suffix)) {
      result = result + suffix;
    }
    
    return result;
  }, [prefix, suffix]);
  
  // Remover prefixo e sufixo para processamento numérico
  const removeAffixes = useCallback((value: string): string => {
    let result = value;
    
    if (prefix && result.startsWith(prefix)) {
      result = result.slice(prefix.length);
    }
    
    if (suffix && result.endsWith(suffix)) {
      result = result.slice(0, -suffix.length);
    }
    
    return result;
  }, [prefix, suffix]);
  
  return {
    formatValue,
    sanitizeInput,
    addAffixes,
    removeAffixes
  };
}

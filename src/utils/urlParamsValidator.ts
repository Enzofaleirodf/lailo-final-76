
/**
 * @fileoverview Utilitários para validação de parâmetros de URL
 */
import { FilterState } from '@/types/filters';

/**
 * Verifica se um valor é um formato válido
 */
export type ValidFormat = 'Todos' | 'Alienação Particular' | 'Leilão' | 'Venda Direta';
export const isValidFormat = (format: string | null): format is ValidFormat => {
  if (!format) return false;
  return ['Todos', 'Alienação Particular', 'Leilão', 'Venda Direta'].includes(format);
};

/**
 * Verifica se um valor é uma origem válida
 */
export type ValidOrigin = 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
export const isValidOrigin = (origin: string | null): origin is ValidOrigin => {
  if (!origin) return false;
  return ['Todas', 'Extrajudicial', 'Judicial', 'Particular', 'Público'].includes(origin);
};

/**
 * Verifica se um valor é uma etapa válida
 */
export type ValidPlace = 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
export const isValidPlace = (place: string | null): place is ValidPlace => {
  if (!place) return false;
  return ['Todas', 'Praça única', '1ª Praça', '2ª Praça', '3ª Praça'].includes(place);
};

/**
 * Função que valida parâmetros numéricos de range
 */
export const validateNumericRange = (
  minParam: string | null, 
  maxParam: string | null, 
  minDefault: string, 
  maxDefault: string
) => {
  const result = {
    isValid: true,
    minValue: minParam || minDefault,
    maxValue: maxParam || maxDefault,
    hasChanges: false
  };
  
  // Verificar se os valores são numéricos
  if (minParam !== null && isNaN(Number(minParam))) {
    result.minValue = minDefault;
    result.isValid = false;
    result.hasChanges = true;
  }
  
  if (maxParam !== null && isNaN(Number(maxParam))) {
    result.maxValue = maxDefault;
    result.isValid = false;
    result.hasChanges = true;
  }
  
  // Verificar se min > max
  if (minParam !== null && maxParam !== null && Number(minParam) > Number(maxParam)) {
    result.minValue = minDefault;
    result.maxValue = maxDefault;
    result.isValid = false;
    result.hasChanges = true;
  }
  
  return result;
};

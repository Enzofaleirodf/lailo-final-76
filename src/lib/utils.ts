
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um número com as opções especificadas
 * @param value Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada
 */
export function formatNumber(value: number | string, options: {
  useThousandSeparator?: boolean,
  decimals?: number,
  locale?: string
} = {}): string {
  const {
    useThousandSeparator = true,
    decimals = 0,
    locale = 'pt-BR'
  } = options;

  // Converter para número se for string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Se não for um número válido, retornar string vazia
  if (isNaN(numValue)) return '';
  
  return numValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: useThousandSeparator
  });
}

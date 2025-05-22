
import { useCallback, useRef } from 'react';

/**
 * Hook para criar uma versão com debounce de uma função
 * Evita execução excessiva de funções durante eventos rápidos
 * 
 * @param callback Função a ser executada após o período de debounce
 * @param delay Tempo de espera em milissegundos antes da execução
 * @returns Função com debounce
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

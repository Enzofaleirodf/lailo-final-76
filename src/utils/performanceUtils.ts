
import React from 'react';

/**
 * Utilitários para melhorar o desempenho com grandes conjuntos de dados
 */

/**
 * Divide um grande conjunto de dados em chunks menores para processamento mais eficiente
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) return [array];
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Processa um grande conjunto de dados de forma assíncrona para evitar bloqueio da UI
 */
export async function processLargeDataSet<T, R>(
  items: T[],
  processFunction: (item: T) => R,
  chunkSize: number = 50,
  delayBetweenChunks: number = 0
): Promise<R[]> {
  const chunks = chunkArray(items, chunkSize);
  const results: R[] = [];
  
  for (const chunk of chunks) {
    const chunkResults = chunk.map(processFunction);
    results.push(...chunkResults);
    
    if (delayBetweenChunks > 0) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
    } else {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

/**
 * Mede performance de funções
 */
export function measurePerformance(label: string, threshold: number = 16) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        
        if (duration > threshold) {
          console.warn(`⚠️ Performance issue in ${label}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
        }
      }
      
      return duration;
    }
  };
}

/**
 * Throttle function para limitar execuções
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      return fn(...args);
    }
  };
}

/**
 * Debounce function para atrasar execuções
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Memoização simples para funções
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Hook para lazy loading de componentes
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return React.lazy(importFn);
}

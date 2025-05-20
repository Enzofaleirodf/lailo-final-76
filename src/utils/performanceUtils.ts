
/**
 * Utilitários para melhorar o desempenho com grandes conjuntos de dados
 */

/**
 * Divide um grande conjunto de dados em chunks menores para processamento mais eficiente
 * @param array Array a ser dividido
 * @param chunkSize Tamanho de cada chunk
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
 * @param items Itens a serem processados
 * @param processFunction Função para processar cada item
 * @param chunkSize Tamanho de cada chunk
 * @param delayBetweenChunks Atraso entre processamento de chunks em ms
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
    // Processar um chunk
    const chunkResults = chunk.map(processFunction);
    results.push(...chunkResults);
    
    // Adicionar atraso para não bloquear a UI
    if (delayBetweenChunks > 0) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
    } else {
      // Yield para o loop de eventos
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

/**
 * Hook para medir e registrar o desempenho
 * @param label Rótulo para o teste
 * @param threshold Limite em ms para alertas
 */
export function measurePerformance(label: string, threshold: number = 16) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      
      if (duration > threshold) {
        console.warn(`⚠️ Desempenho lento em ${label}: ${duration.toFixed(2)}ms (limite: ${threshold}ms)`);
      }
      
      return duration;
    }
  };
}

/**
 * Executa uma função apenas quando necessário (throttle)
 * @param fn Função a ser executada
 * @param wait Tempo de espera em ms
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
 * Memoiza uma função para evitar recálculos desnecessários
 * @param fn Função a ser memoizada
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

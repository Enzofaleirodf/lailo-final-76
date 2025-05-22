
import { useEffect, useRef } from 'react';
import { FilterState, ContentType } from '@/types/filters';

interface CacheOptions {
  key: string;
  expirationTime?: number; // em milissegundos
  contentType: ContentType;
}

/**
 * Hook para gerenciar cache de filtros no localStorage
 * Permite persistência entre sessões e recarregamentos de página
 */
export function useFilterCache({
  key,
  expirationTime = 1000 * 60 * 60 * 24, // 24 horas
  contentType
}: CacheOptions) {
  const cacheInitialized = useRef(false);

  // Gerar chave única baseada no tipo de conteúdo
  const cacheKey = `filter_cache_${contentType}_${key}`;

  // Carregar filtros do cache
  const loadFromCache = (): FilterState | null => {
    try {
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > expirationTime;
      
      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return data as FilterState;
    } catch (error) {
      console.warn('Erro ao carregar filtros do cache:', error);
      return null;
    }
  };

  // Salvar filtros no cache
  const saveToCache = (filters: FilterState): void => {
    try {
      const dataToCache = {
        data: filters,
        timestamp: Date.now()
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    } catch (error) {
      console.warn('Erro ao salvar filtros no cache:', error);
    }
  };

  // Limpar cache
  const clearCache = (): void => {
    localStorage.removeItem(cacheKey);
  };

  // Inicializar flag quando o hook é montado
  useEffect(() => {
    cacheInitialized.current = true;
  }, []);

  return {
    loadFromCache,
    saveToCache,
    clearCache,
    isInitialized: cacheInitialized.current
  };
}

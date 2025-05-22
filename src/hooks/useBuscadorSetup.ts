
import { useEffect, useRef } from 'react';
import { ContentType } from '@/types/filters';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useFilterCache } from '@/hooks/useFilterCache';

/**
 * Hook personalizado que encapsula toda a lógica de inicialização
 * e configuração para os componentes de buscador de imóveis ou veículos
 * Versão otimizada com caching e prevenção de loops
 */
export const useBuscadorSetup = (contentType: ContentType) => {
  const { updateFilter, filters, setFilters } = useFilterStoreSelector(contentType);
  const initialSetupDone = useRef(false);
  
  // Integrar sistema de cache
  const { loadFromCache, saveToCache, isInitialized } = useFilterCache({
    key: `buscador_${contentType}_state`,
    contentType
  });
  
  // Sincronizar URL com estado de filtros e ordenação
  const urlParams = useUrlParams(contentType);

  // Definir o tipo de conteúdo e gerenciar cache
  useEffect(() => {
    // Evitar inicialização duplicada
    if (initialSetupDone.current) return;

    // Sempre garantir que o tipo de conteúdo está definido corretamente
    updateFilter('contentType', contentType);
    
    // Carregar do cache se disponível e não tiver parâmetros na URL
    if (isInitialized && (window.location.search === '' || window.location.search === '?page=1')) {
      const cachedFilters = loadFromCache();
      
      if (cachedFilters) {
        // Preservar o tipo de conteúdo atual e usar setFilters em vez de updateFilter
        setFilters({ ...cachedFilters, contentType });
      }
    }
    
    initialSetupDone.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]); // Executar apenas quando o contentType mudar
  
  // Salvar no cache quando os filtros mudarem
  useEffect(() => {
    // Não salvar durante a inicialização
    if (!initialSetupDone.current || !isInitialized) return;
    
    // Salvar no cache apenas após a primeira renderização
    saveToCache(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Depender dos filtros para salvar quando mudarem
      
  return { 
    initialSetupDone: initialSetupDone.current,
    ...urlParams 
  };
};

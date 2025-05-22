
import { useEffect, useRef } from 'react';
import { ContentType } from '@/types/filters';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';

/**
 * Hook personalizado que encapsula toda a lógica de inicialização
 * e configuração para os componentes de buscador de imóveis ou veículos
 */
export const useBuscadorSetup = (contentType: ContentType) => {
  const { updateFilter, filters } = useFilterStoreSelector(contentType);
  const initialSetupDone = useRef(false);
  
  // Sincronizar URL com estado de filtros e ordenação
  useUrlParams(contentType);

  // Definir o tipo de conteúdo quando a página carregar
  useEffect(() => {
    // Evitar inicialização duplicada
    if (initialSetupDone.current) return;

    // Sempre garantir que o tipo de conteúdo está definido corretamente
    updateFilter('contentType', contentType);
    
    initialSetupDone.current = true;
  }, [updateFilter, contentType]);
      
  return { initialSetupDone };
};

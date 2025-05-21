
import { useEffect, useRef } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import { useUrlParams } from '@/hooks/useUrlParams';

/**
 * Hook personalizado que encapsula toda a lógica de inicialização
 * e configuração para os componentes de buscador de imóveis ou veículos
 */
export const useBuscadorSetup = (contentType: ContentType) => {
  const { updateFilter, filters } = useFilterStore();
  const initialSetupDone = useRef(false);
  
  // Sincronizar URL com estado de filtros e ordenação
  useUrlParams();

  // Definir o tipo de conteúdo quando a página carregar
  useEffect(() => {
    // Evitar inicialização duplicada
    if (initialSetupDone.current) return;

    // Verificar se acabamos de navegar para esta página (não se já estávamos nela)
    const needsUpdate = filters.contentType !== contentType;
    
    if (needsUpdate) {
      console.log(`Buscador: Setting content type to ${contentType}`);
      updateFilter('contentType', contentType);

      // Limpar filtros específicos com base no tipo de conteúdo
      if (contentType === 'property') {
        // Limpar quaisquer filtros específicos de veículos
        if (filters.vehicleTypes.length > 0 || filters.brand !== 'todas' || filters.model !== 'todos') {
          console.log('Cleaning vehicle-specific filters');
          updateFilter('vehicleTypes', []);
          updateFilter('brand', 'todas');
          updateFilter('model', 'todos');
          updateFilter('color', 'todas');
        }
      } else if (contentType === 'vehicle') {
        // Limpar quaisquer filtros específicos de imóveis
        if (filters.propertyTypes.length > 0 || filters.usefulArea.min !== '' || filters.usefulArea.max !== '') {
          console.log('Cleaning property-specific filters');
          updateFilter('propertyTypes', []);
          updateFilter('usefulArea', {
            min: '',
            max: ''
          });
        }
      }
    }
    
    initialSetupDone.current = true;
  }, [updateFilter, filters.contentType, filters.vehicleTypes, filters.brand, filters.model, 
      filters.propertyTypes, filters.usefulArea, contentType, filters]);
      
  return { initialSetupDone };
};

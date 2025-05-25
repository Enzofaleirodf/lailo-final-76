
import { useEffect, useRef } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { ContentType } from '@/types/filters';
import { useUrlParams } from '@/hooks/useUrlParams';
import { logUserAction } from '@/utils/loggingUtils';

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

    // Always update the content type to ensure consistency
    if (filters.contentType !== contentType) {
      logUserAction('buscador_setup', { contentType });
      updateFilter('contentType', contentType);

      // Limpar filtros específicos com base no tipo de conteúdo
      if (contentType === 'property') {
        // Limpar quaisquer filtros específicos de veículos
        if (filters.vehicleTypes.length > 0 || filters.brand !== 'todas' || filters.model !== 'todos') {
          logUserAction('clean_vehicle_filters');
          updateFilter('vehicleTypes', []);
          updateFilter('brand', 'todas');
          updateFilter('model', 'todos');
          updateFilter('color', 'todas');
          updateFilter('year', { min: '', max: '' });
        }
      } else if (contentType === 'vehicle') {
        // Limpar quaisquer filtros específicos de imóveis
        if (filters.propertyTypes.length > 0 || filters.usefulArea.min !== '' || filters.usefulArea.max !== '') {
          logUserAction('clean_property_filters');
          updateFilter('propertyTypes', []);
          updateFilter('usefulArea', {
            min: '',
            max: ''
          });
        }
      }
    }
    
    initialSetupDone.current = true;
  }, [updateFilter, filters, contentType]);
      
  return { initialSetupDone };
};

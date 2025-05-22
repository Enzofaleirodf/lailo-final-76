
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useVehicleFiltersStore } from '@/stores/useVehicleFiltersStore';
import { ContentType, FilterState, ExpandedSectionsState } from '@/types/filters';

/**
 * Hook que retorna a store correta com base no tipo de conteúdo
 * Simplifica o acesso às stores específicas de cada página
 */
export const useFilterStoreSelector = (contentType: ContentType) => {
  // Escolher a store apropriada com base no tipo de conteúdo
  const propertyStore = usePropertyFiltersStore();
  const vehicleStore = useVehicleFiltersStore();

  // Retornar a store correta
  return contentType === 'property' ? propertyStore : vehicleStore;
};

/**
 * Hook que retorna os valores de filtro com base no tipo de conteúdo
 */
export const useFilterValues = (contentType: ContentType) => {
  const store = useFilterStoreSelector(contentType);
  return store.filters;
};

/**
 * Hook que retorna as funções de atualização de filtro com base no tipo de conteúdo
 */
export const useFilterActions = (contentType: ContentType) => {
  const store = useFilterStoreSelector(contentType);
  
  return {
    updateFilter: store.updateFilter,
    resetFilters: store.resetFilters,
    setFilters: store.setFilters,
    toggleSection: store.toggleSection,
    collapseAllSections: store.collapseAllSections,
    expandAllSections: store.expandAllSections
  };
};

/**
 * Hook que retorna as seções expandidas com base no tipo de conteúdo
 */
export const useExpandedSections = (contentType: ContentType) => {
  const store = useFilterStoreSelector(contentType);
  return store.expandedSections;
};

/**
 * Hook que retorna o número de filtros ativos com base no tipo de conteúdo
 */
export const useActiveFilters = (contentType: ContentType) => {
  const store = useFilterStoreSelector(contentType);
  return store.activeFilters;
};

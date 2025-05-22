
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useVehicleFiltersStore } from '@/stores/useVehicleFiltersStore';
import { ContentType, FilterState, ExpandedSectionsState } from '@/types/filters';
import { useMemo } from 'react';

/**
 * Hook que retorna a store correta com base no tipo de conteúdo
 * Simplifica o acesso às stores específicas de cada página
 * Versão otimizada com seletores Zustand mais eficientes
 */
export const useFilterStoreSelector = (contentType: ContentType) => {
  // Escolher a store apropriada com base no tipo de conteúdo
  return useMemo(() => {
    return contentType === 'property' 
      ? usePropertyFiltersStore() 
      : useVehicleFiltersStore();
  }, [contentType]);
};

/**
 * Hook que retorna os valores de filtro com base no tipo de conteúdo
 * Usa seletores otimizados para evitar re-renderizações desnecessárias
 */
export const useFilterValues = (contentType: ContentType) => {
  return contentType === 'property'
    ? usePropertyFiltersStore(state => state.filters)
    : useVehicleFiltersStore(state => state.filters);
};

/**
 * Hook que retorna as funções de atualização de filtro com base no tipo de conteúdo
 * Usa seletores específicos para cada ação
 */
export const useFilterActions = (contentType: ContentType) => {
  const updateFilter = contentType === 'property'
    ? usePropertyFiltersStore(state => state.updateFilter)
    : useVehicleFiltersStore(state => state.updateFilter);
    
  const resetFilters = contentType === 'property'
    ? usePropertyFiltersStore(state => state.resetFilters)
    : useVehicleFiltersStore(state => state.resetFilters);
    
  const setFilters = contentType === 'property'
    ? usePropertyFiltersStore(state => state.setFilters)
    : useVehicleFiltersStore(state => state.setFilters);
    
  const toggleSection = contentType === 'property'
    ? usePropertyFiltersStore(state => state.toggleSection)
    : useVehicleFiltersStore(state => state.toggleSection);
    
  const collapseAllSections = contentType === 'property'
    ? usePropertyFiltersStore(state => state.collapseAllSections)
    : useVehicleFiltersStore(state => state.collapseAllSections);
    
  const expandAllSections = contentType === 'property'
    ? usePropertyFiltersStore(state => state.expandAllSections)
    : useVehicleFiltersStore(state => state.expandAllSections);
  
  return {
    updateFilter,
    resetFilters,
    setFilters,
    toggleSection,
    collapseAllSections,
    expandAllSections
  };
};

/**
 * Hook que retorna as seções expandidas com base no tipo de conteúdo
 */
export const useExpandedSections = (contentType: ContentType) => {
  return contentType === 'property'
    ? usePropertyFiltersStore(state => state.expandedSections)
    : useVehicleFiltersStore(state => state.expandedSections);
};

/**
 * Hook que retorna o número de filtros ativos com base no tipo de conteúdo
 */
export const useActiveFilters = (contentType: ContentType) => {
  return contentType === 'property'
    ? usePropertyFiltersStore(state => state.activeFilters)
    : useVehicleFiltersStore(state => state.activeFilters);
};

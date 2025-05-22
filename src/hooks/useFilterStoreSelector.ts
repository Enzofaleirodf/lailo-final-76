import { useCallback, useMemo } from 'react';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useVehicleFiltersStore } from '@/stores/useVehicleFiltersStore';
import { ContentType, FilterState } from '@/types/filters';

/**
 * Hook que retorna a store correta com base no tipo de conteúdo
 * Implementação otimizada com memoização e seletores específicos
 */
export const useFilterStoreSelector = (contentType: ContentType) => {
  // Usar seletores específicos para cada prop para evitar re-renders desnecessários
  const propertyFilters = usePropertyFiltersStore(state => state.filters);
  const propertyUpdateFilter = usePropertyFiltersStore(state => state.updateFilter);
  const propertySetFilters = usePropertyFiltersStore(state => state.setFilters);
  const propertyResetFilters = usePropertyFiltersStore(state => state.resetFilters);
  
  const vehicleFilters = useVehicleFiltersStore(state => state.filters);
  const vehicleUpdateFilter = useVehicleFiltersStore(state => state.updateFilter);
  const vehicleSetFilters = useVehicleFiltersStore(state => state.setFilters);
  const vehicleResetFilters = useVehicleFiltersStore(state => state.resetFilters);
  
  // Selecionar os valores corretos com base no tipo de conteúdo
  const filters = useMemo(() => {
    return contentType === 'property' ? propertyFilters : vehicleFilters;
  }, [contentType, propertyFilters, vehicleFilters]);
  
  // Memoizar funções para evitar recriações desnecessárias
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    if (contentType === 'property') {
      propertyUpdateFilter(key, value);
    } else {
      vehicleUpdateFilter(key, value);
    }
  }, [contentType, propertyUpdateFilter, vehicleUpdateFilter]);
  
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    if (contentType === 'property') {
      propertySetFilters(newFilters);
    } else {
      vehicleSetFilters(newFilters);
    }
  }, [contentType, propertySetFilters, vehicleSetFilters]);
  
  const resetFilters = useCallback(() => {
    if (contentType === 'property') {
      propertyResetFilters();
    } else {
      vehicleResetFilters();
    }
  }, [contentType, propertyResetFilters, vehicleResetFilters]);
  
  return {
    filters,
    updateFilter,
    setFilters,
    resetFilters
  };
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

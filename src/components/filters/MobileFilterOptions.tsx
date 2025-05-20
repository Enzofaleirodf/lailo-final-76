
/**
 * @fileoverview Componente de opções de filtros para dispositivos móveis
 * Renderiza as seções de filtros específicas para o modo mobile
 */
import React, { memo, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import FilterDropdown from './FilterDropdown';
import FilterSectionComponent from '@/components/filters/FilterSectionComponent';

/**
 * MobileFilterOptions - Exibe as opções de filtro em formato móvel
 * Implementa os filtros de formato, origem e etapa do leilão
 */
const MobileFilterOptions: React.FC = () => {
  const {
    filters,
    updateFilter,
    expandedSections,
    toggleSection
  } = useFilterStore();

  // Handlers memoizados para evitar renderizações desnecessárias
  const handleFormatChange = useCallback((value: string) => {
    updateFilter('format', value as FilterFormat);
  }, [updateFilter]);

  const handleOriginChange = useCallback((value: string) => {
    updateFilter('origin', value as FilterOrigin);
  }, [updateFilter]);

  const handlePlaceChange = useCallback((value: string) => {
    updateFilter('place', value as FilterPlace);
  }, [updateFilter]);

  // Opções para os dropdowns
  const formatOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Alienação Particular', label: 'Alienação Particular' },
    { value: 'Leilão', label: 'Leilão' },
    { value: 'Venda Direta', label: 'Venda Direta' }
  ];

  const originOptions = [
    { value: 'Todas', label: 'Todas' },
    { value: 'Extrajudicial', label: 'Extrajudicial' },
    { value: 'Judicial', label: 'Judicial' },
    { value: 'Particular', label: 'Particular' },
    { value: 'Público', label: 'Público' }
  ];

  const placeOptions = [
    { value: 'Todas', label: 'Todas' },
    { value: 'Praça única', label: 'Praça única' },
    { value: '1ª Praça', label: '1ª Praça' },
    { value: '2ª Praça', label: '2ª Praça' },
    { value: '3ª Praça', label: '3ª Praça' }
  ];

  // Usando React.memo em conjunto com useCallback para otimizar renderizações
  const handleToggleFormat = useCallback(() => toggleSection('format'), [toggleSection]);
  const handleToggleOrigin = useCallback(() => toggleSection('origin'), [toggleSection]);
  const handleTogglePlace = useCallback(() => toggleSection('place'), [toggleSection]);

  return (
    <div className="grid grid-cols-1 gap-0">
      <FilterSectionComponent 
        title="Formato" 
        isExpanded={expandedSections.format} 
        onToggle={handleToggleFormat}
      >
        <FilterDropdown 
          id="format-filter-mobile" 
          aria-label="Selecionar formato" 
          value={filters.format} 
          onChange={handleFormatChange} 
          options={formatOptions} 
          className="border-gray-200 shadow-sm bg-white" 
        />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Origem" 
        isExpanded={expandedSections.origin} 
        onToggle={handleToggleOrigin}
      >
        <FilterDropdown 
          id="origin-filter-mobile" 
          aria-label="Selecionar origem" 
          value={filters.origin} 
          onChange={handleOriginChange} 
          options={originOptions} 
          className="border-gray-200 shadow-sm bg-white" 
        />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Etapa" 
        isExpanded={expandedSections.place} 
        onToggle={handleTogglePlace}
      >
        <FilterDropdown 
          id="place-filter-mobile" 
          aria-label="Selecionar etapa" 
          value={filters.place} 
          onChange={handlePlaceChange} 
          options={placeOptions} 
          className="border-gray-200 shadow-sm bg-white" 
        />
      </FilterSectionComponent>
    </div>
  );
};

// Usar memo para evitar renderizações desnecessárias quando o componente pai re-renderiza
export default memo(MobileFilterOptions);

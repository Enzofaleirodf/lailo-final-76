
/**
 * @fileoverview Componente de opções de filtros para dispositivos móveis
 * Renderiza as seções de filtros específicas para o modo mobile,
 * garantindo consistência visual e comportamental com a versão desktop
 */
import React, { memo, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import FilterDropdown from './FilterDropdown';
import FilterSectionComponent from '@/components/filters/FilterSectionComponent';
import { 
  formatOptions, 
  originOptions, 
  placeOptions 
} from '@/utils/filterUtils';

/**
 * MobileFilterOptions - Exibe as opções de filtro em formato móvel
 * Implementa os filtros de formato, origem e etapa do leilão com
 * aparência e comportamento consistentes com a versão desktop
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

  // Usando React.memo em conjunto com useCallback para otimizar renderizações
  const handleToggleFormat = useCallback(() => toggleSection('format'), [toggleSection]);
  const handleToggleOrigin = useCallback(() => toggleSection('origin'), [toggleSection]);
  const handleTogglePlace = useCallback(() => toggleSection('place'), [toggleSection]);

  return (
    <div 
      className="grid grid-cols-1 gap-0" 
      role="region" 
      aria-label="Filtros básicos"
    >
      <FilterSectionComponent 
        title="Formato" 
        isExpanded={expandedSections.format} 
        onToggle={() => {}}
      >
        <FilterDropdown 
          id="format-filter-mobile" 
          aria-label="Selecionar formato" 
          value={filters.format} 
          onChange={handleFormatChange} 
          options={formatOptions} 
          className={`${COLORS.border.gray[200]} shadow-sm ${COLORS.bg.white}`} 
        />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Origem" 
        isExpanded={expandedSections.origin} 
        onToggle={() => {}}
      >
        <FilterDropdown 
          id="origin-filter-mobile" 
          aria-label="Selecionar origem" 
          value={filters.origin} 
          onChange={handleOriginChange} 
          options={originOptions} 
          className={`${COLORS.border.gray[200]} shadow-sm ${COLORS.bg.white}`} 
        />
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Etapa" 
        isExpanded={expandedSections.place} 
        onToggle={() => {}}
      >
        <FilterDropdown 
          id="place-filter-mobile" 
          aria-label="Selecionar etapa" 
          value={filters.place} 
          onChange={handlePlaceChange} 
          options={placeOptions} 
          className={`${COLORS.border.gray[200]} shadow-sm ${COLORS.bg.white}`} 
        />
      </FilterSectionComponent>
    </div>
  );
};

// Usar memo para evitar renderizações desnecessárias quando o componente pai re-renderiza
export default memo(MobileFilterOptions);

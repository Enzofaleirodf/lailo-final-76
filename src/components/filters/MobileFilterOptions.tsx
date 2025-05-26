
/**
 * @fileoverview Componente de opções de filtros para dispositivos móveis
 * Renderiza as seções de filtros específicas para o modo mobile,
 * garantindo consistência visual e comportamental com a versão desktop
 */
import React, { memo, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import FilterSectionComponent from '@/components/filters/FilterSectionComponent';
import { 
  formatOptions, 
  originOptions, 
  placeOptions 
} from '@/utils/filterUtils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
        onToggle={handleToggleFormat}
      >
        <ToggleGroup 
          type="single" 
          value={filters.format} 
          onValueChange={(value) => {
            if (value) handleFormatChange(value);
          }}
          className="flex flex-wrap gap-2"
        >
          {formatOptions.map(option => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="text-sm"
              aria-label={`Formato: ${option.label}`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Origem" 
        isExpanded={expandedSections.origin} 
        onToggle={handleToggleOrigin}
      >
        <ToggleGroup 
          type="multiple" 
          value={[filters.origin]} 
          onValueChange={(value) => {
            if (value.length > 0) handleOriginChange(value[0]);
          }}
          className="flex flex-wrap gap-2"
        >
          {originOptions.map(option => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="text-sm"
              aria-label={`Origem: ${option.label}`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Etapa" 
        isExpanded={expandedSections.place} 
        onToggle={handleTogglePlace}
      >
        <ToggleGroup 
          type="multiple" 
          value={[filters.place]} 
          onValueChange={(value) => {
            if (value.length > 0) handlePlaceChange(value[0]);
          }}
          className="flex flex-wrap gap-2"
          disabled={filters.format === 'Venda Direta'}
        >
          {placeOptions.map(option => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="text-sm"
              aria-label={`Etapa: ${option.label}`}
              disabled={filters.format === 'Venda Direta'}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSectionComponent>
    </div>
  );
};

// Usar memo para evitar renderizações desnecessárias quando o componente pai re-renderiza
export default memo(MobileFilterOptions);

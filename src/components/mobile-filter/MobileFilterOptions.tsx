
import React, { useCallback, memo } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { FilterSectionComponent } from '@/components/filters/FilterSectionComponent';
import { 
  formatOptions, 
  originOptions, 
  placeOptions 
} from '@/utils/filterUtils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from '@/components/ui/button';

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
    toggleSection,
    getSelectedOrigins,
    getSelectedPlaces,
    updateMultipleOrigins,
    updateMultiplePlaces
  } = useFilterStore();

  // Handlers memoizados para evitar renderizações desnecessárias
  const handleFormatChange = useCallback((value: string) => {
    if (!value) return;
    updateFilter('format', value as FilterFormat);
  }, [updateFilter]);

  const handleOriginChange = useCallback((values: string[]) => {
    if (values.length === 0) return;
    updateMultipleOrigins(values as FilterOrigin[]);
  }, [updateMultipleOrigins]);

  const handlePlaceChange = useCallback((values: string[]) => {
    if (values.length === 0) return;
    updateMultiplePlaces(values as FilterPlace[]);
  }, [updateMultiplePlaces]);

  // Usando React.memo em conjunto com useCallback para otimizar renderizações
  const handleToggleFormat = useCallback(() => toggleSection('format'), [toggleSection]);
  const handleToggleOrigin = useCallback(() => toggleSection('origin'), [toggleSection]);
  const handleTogglePlace = useCallback(() => toggleSection('place'), [toggleSection]);

  // Reset filters to default values
  const handleResetFilters = useCallback(() => {
    updateFilter('format', 'Leilão');
    updateFilter('origin', 'Extrajudicial');
    updateFilter('place', 'Praça única');
  }, [updateFilter]);

  // Check if any filters are active
  const hasActiveFilters = 
    filters.format !== 'Leilão' || 
    filters.origin !== 'Extrajudicial' || 
    filters.place !== 'Praça única';
    
  // Get selected origins and places for multi-select
  const selectedOrigins = getSelectedOrigins();
  const selectedPlaces = getSelectedPlaces();

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
        <ToggleGroup 
          type="single" 
          value={filters.format} 
          onValueChange={(value) => {
            if (value) handleFormatChange(value);
          }}
          className="flex flex-wrap gap-2 w-full p-1"
          variant="brand"
        >
          {formatOptions.map(option => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="text-sm flex-1 whitespace-nowrap rounded-md"
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
        onToggle={() => {}}
      >
        <ToggleGroup 
          type="multiple" 
          value={selectedOrigins} 
          onValueChange={handleOriginChange}
          className="flex flex-wrap gap-2 w-full p-1"
          variant="multi"
        >
          {originOptions.map(option => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="text-sm flex-1 whitespace-nowrap rounded-md"
              aria-label={`Origem: ${option.label}`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSectionComponent>

      <FilterSectionComponent 
        title="Praça" 
        isExpanded={expandedSections.place} 
        onToggle={() => {}}
      >
        <ToggleGroup 
          type="multiple" 
          value={selectedPlaces} 
          onValueChange={handlePlaceChange}
          className="flex flex-wrap gap-2 w-full p-1"
          variant="multi"
          disabled={filters.format === 'Venda Direta'}
        >
          {placeOptions.map(option => {
            // Simplify the display text for place options
            const displayText = option.value === 'Praça única' ? 'Única' : 
                               option.value === '1ª Praça' ? '1ª' :
                               option.value === '2ª Praça' ? '2ª' :
                               option.value === '3ª Praça' ? '3ª' : option.label;
            
            return (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value}
                className="text-sm flex-1 whitespace-nowrap rounded-md"
                aria-label={`Praça: ${option.label}`}
                disabled={filters.format === 'Venda Direta'}
              >
                {displayText}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </FilterSectionComponent>
      
      {/* Reset Filters Button - Only show when filters are active */}
      {hasActiveFilters && (
        <div className="p-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters}
            className="text-xs"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

// Usar memo para evitar renderizações desnecessárias quando o componente pai re-renderiza
export default memo(MobileFilterOptions);

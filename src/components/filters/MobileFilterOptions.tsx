
import React from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import FilterSectionComponent from './FilterSectionComponent';
import { ContentType, FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import FilterDropdown from './FilterDropdown';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';

interface MobileFilterOptionsProps {
  contentType: ContentType;
}

/**
 * Componente de opções de filtro para exibição em dispositivos móveis
 * Este componente renderiza filtros adicionais específicos para o modo móvel
 */
const MobileFilterOptions: React.FC<MobileFilterOptionsProps> = ({ contentType }) => {
  const { filters, updateFilter, toggleSection, expandedSections } = useFilterStoreSelector(contentType);

  // Manipuladores de alteração
  const handleFormatChange = (value: string) => {
    // Garantindo que apenas valores válidos do tipo FilterFormat sejam passados
    updateFilter('format', value as FilterFormat);
  };

  const handleOriginChange = (value: string) => {
    // Garantindo que apenas valores válidos do tipo FilterOrigin sejam passados
    updateFilter('origin', value as FilterOrigin);
  };

  const handlePlaceChange = (value: string) => {
    // Garantindo que apenas valores válidos do tipo FilterPlace sejam passados
    updateFilter('place', value as FilterPlace);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Seção de formato */}
      <FilterSectionComponent
        title="Formato"
        isExpanded={expandedSections.format}
        onToggle={() => toggleSection('format')}
      >
        <FilterDropdown
          id="format-filter"
          aria-label="Selecionar formato"
          value={filters.format}
          onChange={handleFormatChange}
          options={formatOptions}
          placeholder="Selecione um formato"
        />
      </FilterSectionComponent>

      {/* Seção de origem */}
      <FilterSectionComponent
        title="Origem"
        isExpanded={expandedSections.origin}
        onToggle={() => toggleSection('origin')}
      >
        <FilterDropdown
          id="origin-filter"
          aria-label="Selecionar origem"
          value={filters.origin}
          onChange={handleOriginChange}
          options={originOptions}
          placeholder="Selecione uma origem"
        />
      </FilterSectionComponent>

      {/* Seção de praça */}
      <FilterSectionComponent
        title="Etapa"
        isExpanded={expandedSections.place}
        onToggle={() => toggleSection('place')}
      >
        <FilterDropdown
          id="place-filter"
          aria-label="Selecionar etapa"
          value={filters.place}
          onChange={handlePlaceChange}
          options={placeOptions}
          placeholder="Selecione uma etapa"
        />
      </FilterSectionComponent>
    </div>
  );
};

export default React.memo(MobileFilterOptions);

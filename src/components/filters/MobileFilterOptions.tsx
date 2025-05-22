
import React from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import FilterDropdown from './FilterDropdown';
import { FilterFormat, FilterOrigin, FilterPlace, ContentType } from '@/types/filters';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import FilterSectionComponent from './FilterSectionComponent';

interface MobileFilterOptionsProps {
  contentType: ContentType;
}

/**
 * Componente que exibe opções de filtro específicas para dispositivos móveis
 * (formato, origem, etapa)
 */
const MobileFilterOptions: React.FC<MobileFilterOptionsProps> = ({ contentType }) => {
  const { filters, updateFilter, expandedSections, toggleSection } = useFilterStoreSelector(contentType);
  
  // Verificar se o filtro de etapa deve estar desativado
  const isPlaceDisabled = React.useMemo(() => {
    return filters.format === 'Alienação Particular' || filters.format === 'Venda Direta';
  }, [filters.format]);
  
  // Efeito para resetar etapa quando formato desabilita o filtro
  React.useEffect(() => {
    if (isPlaceDisabled && filters.place) {
      updateFilter('place', '');
    }
  }, [isPlaceDisabled, filters.place, updateFilter]);

  return (
    <div className="space-y-1 mb-2">
      {/* Seção de Formato */}
      <FilterSectionComponent
        title="Formato"
        isExpanded={expandedSections.format}
        onToggle={() => toggleSection('format')}
      >
        <FilterDropdown
          id="format-filter"
          aria-label="Selecionar formato"
          value={filters.format}
          onChange={(value) => updateFilter('format', value as FilterFormat)}
          options={formatOptions}
          placeholder="Selecione um formato"
        />
      </FilterSectionComponent>
      
      {/* Seção de Origem */}
      <FilterSectionComponent
        title="Origem"
        isExpanded={expandedSections.origin}
        onToggle={() => toggleSection('origin')}
      >
        <FilterDropdown
          id="origin-filter"
          aria-label="Selecionar origem"
          value={filters.origin}
          onChange={(value) => updateFilter('origin', value as FilterOrigin)}
          options={originOptions}
          placeholder="Selecione uma origem"
        />
      </FilterSectionComponent>
      
      {/* Seção de Etapa */}
      <FilterSectionComponent
        title="Etapa"
        isExpanded={expandedSections.place}
        onToggle={() => toggleSection('place')}
      >
        <FilterDropdown
          id="place-filter"
          aria-label="Selecionar etapa"
          value={filters.place}
          onChange={(value) => updateFilter('place', value as FilterPlace)}
          options={placeOptions}
          placeholder="Selecione uma etapa"
          disabled={isPlaceDisabled}
        />
        {isPlaceDisabled && (
          <p className="text-xs text-gray-500 mt-1">
            Este filtro não está disponível para o formato selecionado.
          </p>
        )}
      </FilterSectionComponent>
    </div>
  );
};

export default React.memo(MobileFilterOptions);

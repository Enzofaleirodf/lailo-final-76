
import React from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import FilterSectionComponent from './FilterSectionComponent';
import { ContentType } from '@/types/filters';
import FilterDropdown from './FilterDropdown';

interface MobileFilterOptionsProps {
  contentType: ContentType;
}

/**
 * Componente de opções de filtro para exibição em dispositivos móveis
 * Este componente renderiza filtros adicionais específicos para o modo móvel
 */
const MobileFilterOptions: React.FC<MobileFilterOptionsProps> = ({ contentType }) => {
  const { filters, updateFilter, toggleSection, expandedSections } = useFilterStoreSelector(contentType);

  // Opções de formato
  const formatOptions = [
    { value: 'Todos', label: 'Todos os formatos' },
    { value: 'Leilão', label: 'Leilão' },
    { value: 'Alienação Particular', label: 'Alienação Particular' },
    { value: 'Venda Direta', label: 'Venda Direta' }
  ];

  // Opções de origem
  const originOptions = [
    { value: 'Todas', label: 'Todas as origens' },
    { value: 'Judicial', label: 'Judicial' },
    { value: 'Extrajudicial', label: 'Extrajudicial' },
    { value: 'Particular', label: 'Particular' }
  ];

  // Opções de praça
  const placeOptions = [
    { value: 'Todas', label: 'Todas as etapas' },
    { value: '1ª Praça', label: '1ª Praça' },
    { value: '2ª Praça', label: '2ª Praça' },
    { value: 'Praça única', label: 'Praça única' }
  ];

  // Manipuladores de alteração
  const handleFormatChange = (value: string) => {
    updateFilter('format', value);
  };

  const handleOriginChange = (value: string) => {
    updateFilter('origin', value);
  };

  const handlePlaceChange = (value: string) => {
    updateFilter('place', value);
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

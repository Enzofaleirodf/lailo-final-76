
import React from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import FilterDropdown from './FilterDropdown';
import FilterSectionComponent from '@/components/filters/FilterSectionComponent';

const MobileFilterOptions: React.FC = () => {
  const {
    filters,
    updateFilter,
    expandedSections,
    toggleSection
  } = useFilterStore();

  const handleFormatChange = (value: string) => {
    updateFilter('format', value as FilterFormat);
  };

  const handleOriginChange = (value: string) => {
    updateFilter('origin', value as FilterOrigin);
  };

  const handlePlaceChange = (value: string) => {
    updateFilter('place', value as FilterPlace);
  };

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

  return (
    <div className="grid grid-cols-1 gap-0">
      <FilterSectionComponent 
        title="Formato" 
        isExpanded={expandedSections.format} 
        onToggle={() => toggleSection('format')}
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
        onToggle={() => toggleSection('origin')}
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
        onToggle={() => toggleSection('place')}
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

export default React.memo(MobileFilterOptions);

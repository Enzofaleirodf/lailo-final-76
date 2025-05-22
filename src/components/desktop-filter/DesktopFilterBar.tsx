
import React from 'react';
import { ContentType } from '@/types/filters';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import FilterDropdown from '../filters/FilterDropdown';
import { formatOptions, originOptions, placeOptions } from '@/utils/filterUtils';
import { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';

interface DesktopFilterBarProps {
  contentType: ContentType;
}

/**
 * Barra de filtros para desktop que exibe os filtros de formato, origem e etapa
 */
const DesktopFilterBar: React.FC<DesktopFilterBarProps> = ({ contentType }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);

  // Manipuladores de alteração
  const handleFormatChange = (value: string) => {
    updateFilter('format', value as FilterFormat);
  };

  const handleOriginChange = (value: string) => {
    updateFilter('origin', value as FilterOrigin);
  };

  const handlePlaceChange = (value: string) => {
    updateFilter('place', value as FilterPlace);
  };

  return (
    <div 
      className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm" 
      role="region" 
      aria-label="Filtros de busca específicos"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-40 lg:w-44">
          <label htmlFor="desktop-format-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Formato
          </label>
          <FilterDropdown
            id="desktop-format-filter"
            aria-label="Selecionar formato"
            value={filters.format}
            onChange={handleFormatChange}
            options={formatOptions}
            placeholder="Todos os formatos"
          />
        </div>
        
        <div className="w-40 lg:w-44">
          <label htmlFor="desktop-origin-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Origem
          </label>
          <FilterDropdown
            id="desktop-origin-filter"
            aria-label="Selecionar origem"
            value={filters.origin}
            onChange={handleOriginChange}
            options={originOptions}
            placeholder="Todas as origens"
          />
        </div>
        
        <div className="w-40 lg:w-44">
          <label htmlFor="desktop-place-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Etapa
          </label>
          <FilterDropdown
            id="desktop-place-filter"
            aria-label="Selecionar etapa"
            value={filters.place}
            onChange={handlePlaceChange}
            options={placeOptions}
            placeholder="Todas as etapas"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DesktopFilterBar);


import React, { useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import type { FilterFormat, FilterOrigin, FilterPlace } from '@/types/filters';
import FilterDropdown from './FilterDropdown';
import { Label } from '@/components/ui/label';

const MobileFilterOptions: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();

  const handleFormatChange = useCallback((value: string) => {
    updateFilter('format', value as FilterFormat);
  }, [updateFilter]);

  const handleOriginChange = useCallback((value: string) => {
    updateFilter('origin', value as FilterOrigin);
  }, [updateFilter]);

  const handlePlaceChange = useCallback((value: string) => {
    updateFilter('place', value as FilterPlace);
  }, [updateFilter]);

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
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Formato</Label>
        <FilterDropdown
          id="format-filter-mobile"
          aria-label="Selecionar formato"
          value={filters.format}
          onChange={handleFormatChange}
          options={formatOptions}
          className="border-gray-200 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Origem</Label>
        <FilterDropdown
          id="origin-filter-mobile"
          aria-label="Selecionar origem"
          value={filters.origin}
          onChange={handleOriginChange}
          options={originOptions}
          className="border-gray-200 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Etapa</Label>
        <FilterDropdown
          id="place-filter-mobile"
          aria-label="Selecionar etapa"
          value={filters.place}
          onChange={handlePlaceChange}
          options={placeOptions}
          className="border-gray-200 shadow-sm"
        />
      </div>

      <div className="h-3"></div>
    </div>
  );
};

export default React.memo(MobileFilterOptions);

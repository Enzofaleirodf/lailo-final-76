
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';

const locationOptions = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' }
];

const LocationFilter: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleLocationChange = useCallback((value: string) => {
    updateFilter('location', value);
  }, [updateFilter]);

  return (
    <FilterDropdown
      id="location-filter"
      aria-label="Selecione a localização"
      value={filters.location}
      onChange={handleLocationChange}
      options={locationOptions}
      placeholder="Selecione"
    />
  );
};

export default React.memo(LocationFilter);

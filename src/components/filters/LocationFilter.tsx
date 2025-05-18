
import React from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilter } from '@/contexts/FilterContext';

const locationOptions = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' }
];

const LocationFilter: React.FC = () => {
  const { filters, updateFilter } = useFilter();
  
  const handleLocationChange = (value: string) => {
    updateFilter('location', value);
  };

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

export default LocationFilter;

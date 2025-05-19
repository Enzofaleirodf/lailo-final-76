
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';

interface LocationFilterProps {
  onFilterChange?: () => void;
}

const locationOptions = [
  { value: 'todos', label: 'Todos os locais' },
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' }
];

const LocationFilter: React.FC<LocationFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleLocationChange = useCallback((value: string) => {
    updateFilter('location', value);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
    
    // Dispatch event to trigger URL update (for desktop)
    const event = new CustomEvent('filters:applied', {
      detail: { scrollPosition: window.scrollY }
    });
    window.dispatchEvent(event);
  }, [updateFilter, onFilterChange]);

  return (
    <FilterDropdown
      id="location-filter"
      aria-label="Selecione a localização"
      value={filters.location || 'todos'}
      onChange={handleLocationChange}
      options={locationOptions}
      placeholder="Selecione"
    />
  );
};

export default React.memo(LocationFilter);

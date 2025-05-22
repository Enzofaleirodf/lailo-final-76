
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ContentType } from '@/types/filters';

interface LocationFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

/**
 * Componente de filtro de localização
 * Permite ao usuário inserir estado e cidade para filtragem
 */
const LocationFilter: React.FC<LocationFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.value.toUpperCase();
    updateFilter('location', {
      ...filters.location,
      state: newState
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.location, updateFilter, onFilterChange]);
  
  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('location', {
      ...filters.location,
      city: e.target.value
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.location, updateFilter, onFilterChange]);
  
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="state-filter" className="text-sm font-medium text-gray-700">
          Estado (UF)
        </Label>
        <Input
          id="state-filter"
          type="text"
          placeholder="Ex: SP"
          value={filters.location.state}
          onChange={handleStateChange}
          className="mt-1 h-10 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          maxLength={2}
          aria-label="Estado"
        />
      </div>
      
      <div>
        <Label htmlFor="city-filter" className="text-sm font-medium text-gray-700">
          Cidade
        </Label>
        <Input
          id="city-filter"
          type="text"
          placeholder="Ex: São Paulo"
          value={filters.location.city}
          onChange={handleCityChange}
          className="mt-1 h-10 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          aria-label="Cidade"
        />
      </div>
    </div>
  );
};

export default React.memo(LocationFilter);

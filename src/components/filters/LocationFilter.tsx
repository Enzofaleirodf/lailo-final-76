import React, { useCallback, useEffect, useState } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getAllStates, getCitiesByState } from '@/utils/locationUtils';
import { Select } from "@/components/ui/select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckIcon, ChevronDown } from 'lucide-react';
import FilterSectionComponent from './FilterSectionComponent';

interface LocationFilterProps {
  onFilterChange?: () => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter, expandedSections, toggleSection } = useFilterStore();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isActiveState, setIsActiveState] = useState(false);
  const [isActiveCity, setIsActiveCity] = useState(false);

  useEffect(() => {
    setIsActiveState(filters.location.state !== 'Todos' && filters.location.state !== '');
    setIsActiveCity(filters.location.city !== 'Todas' && filters.location.city !== '');
  }, [filters.location.state, filters.location.city]);

  // Buscar cidades quando o estado for alterado
  useEffect(() => {
    if (filters.location.state && filters.location.state !== 'Todos') {
      const cities = getCitiesByState(filters.location.state);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
      updateFilter('location', { state: 'Todos', city: 'Todas' });
    }
  }, [filters.location.state, updateFilter]);

  // Manipular a mudança de estado
  const handleStateChange = useCallback((state: string) => {
    updateFilter('location', { ...filters.location, state, city: 'Todas' });
    setIsActiveState(state !== 'Todos');
    setIsActiveCity(false);
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.location, updateFilter, onFilterChange]);

  // Manipular a mudança de cidade
  const handleCityChange = useCallback((city: string) => {
    updateFilter('location', { ...filters.location, city });
    setIsActiveCity(city !== 'Todas');
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.location, updateFilter, onFilterChange]);

  const handleSectionToggle = () => {
    toggleSection('location');
  };

  // Verificar se este filtro está ativo
  const isFilterActive = Boolean(
    (filters.location.state && filters.location.state !== 'Todos') || 
    (filters.location.city && filters.location.city !== 'Todas')
  );

  return (
    <FilterSectionComponent 
      title="Localização" 
      isExpanded={expandedSections.location} 
      onToggle={handleSectionToggle}
      isActive={isFilterActive}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <div className={`relative rounded-md ${isActiveState ? 'border-purple-300' : 'border-gray-200'} border`}>
            <select
              id="state-select"
              value={filters.location.state || ''}
              onChange={(e) => handleStateChange(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-0 focus:ring-0 sm:text-sm sm:leading-6 appearance-none bg-transparent"
              aria-label="Selecione um estado"
            >
              <option value="Todos">Todos</option>
              {getAllStates().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <div className={`relative rounded-md ${isActiveCity ? 'border-purple-300' : 'border-gray-200'} border`}>
            <select
              id="city-select"
              value={filters.location.city || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!filters.location.state || filters.location.state === 'Todos'}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-0 focus:ring-0 sm:text-sm sm:leading-6 appearance-none bg-transparent disabled:bg-gray-100"
              aria-label="Selecione uma cidade"
            >
              <option value="Todas">Todas</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </FilterSectionComponent>
  );
};

export default React.memo(LocationFilter);

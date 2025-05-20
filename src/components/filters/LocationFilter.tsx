
import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, X, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFilterStore } from '@/stores/useFilterStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useStates, useCities } from '@/services/ibgeApi';
import FilterDropdown from './FilterDropdown';
import { LocationFilter as LocationFilterType } from '@/types/filters';

interface LocationFilterProps {
  onFilterChange?: () => void;
}

interface FilterDropdownOption {
  value: string;
  label: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const [open, setOpen] = useState(false);
  const [localState, setLocalState] = useState(filters.location.state);
  const [localCity, setLocalCity] = useState(filters.location.city);
  const { states, loading: loadingStates } = useStates();
  const { cities, loading: loadingCities } = useCities(localState);

  // Update local state when filters change (e.g. reset)
  useEffect(() => {
    setLocalState(filters.location.state);
    setLocalCity(filters.location.city);
  }, [filters.location.state, filters.location.city]);

  // Format states for dropdown
  const stateOptions: FilterDropdownOption[] = [
    { value: '', label: 'Todos os estados' },
    ...states.map(state => ({
      value: state.sigla,
      label: `${state.sigla} - ${state.nome}`
    }))
  ];

  // Format cities for dropdown
  const cityOptions: FilterDropdownOption[] = [
    { value: '', label: 'Todas as cidades' },
    ...cities.map(city => ({
      value: city.nome,
      label: city.nome
    }))
  ];

  // Handle state change
  const handleStateChange = useCallback((value: string) => {
    setLocalState(value);
    // Reset city when state changes
    setLocalCity('');
  }, []);

  // Handle city change
  const handleCityChange = useCallback((value: string) => {
    setLocalCity(value);
  }, []);

  // Apply filter changes
  const applyChanges = useCallback(() => {
    const newLocation: LocationFilterType = {
      state: localState,
      city: localCity
    };
    
    updateFilter('location', newLocation);
    setOpen(false);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
    
    // Dispatch event to trigger URL update (for desktop)
    const event = new CustomEvent('filters:applied', {
      detail: { scrollPosition: window.scrollY, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }, [localState, localCity, updateFilter, onFilterChange]);

  // Reset filter
  const resetFilter = useCallback(() => {
    setLocalState('');
    setLocalCity('');
  }, []);

  // Check if the filter is active
  const isFilterActive = filters.location.state || filters.location.city;
  
  // Generate display text for the button
  const getDisplayText = () => {
    if (filters.location.state && filters.location.city) {
      return `${filters.location.city}, ${filters.location.state}`;
    } else if (filters.location.state) {
      return states.find(s => s.sigla === filters.location.state)?.nome || filters.location.state;
    } else if (filters.location.city) {
      return filters.location.city;
    }
    return 'Selecione a localização';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open} 
          className={`w-full justify-between h-10 border rounded-lg px-3 py-2 ${isFilterActive ? 'text-brand-700 font-medium' : 'text-gray-700'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className={isFilterActive ? 'text-brand-700' : 'text-gray-500'} />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown size={16} className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80 p-4 bg-white shadow-md rounded-md z-[150]" align="start">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="state-select" className="text-sm font-medium text-gray-700">
              Estado
            </label>
            {loadingStates ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <FilterDropdown
                id="state-select"
                aria-label="Selecione o estado"
                value={localState}
                onChange={handleStateChange}
                options={stateOptions}
                placeholder="Todos os estados"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="city-select" className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            {localState ? (
              loadingCities ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FilterDropdown
                  id="city-select"
                  aria-label="Selecione a cidade"
                  value={localCity}
                  onChange={handleCityChange}
                  options={cityOptions}
                  placeholder="Todas as cidades"
                />
              )
            ) : (
              <div className="h-10 w-full border rounded-lg px-3 flex items-center text-gray-500 bg-gray-100">
                Selecione um estado
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline"
              size="sm" 
              className="flex-1 h-9 text-sm"
              onClick={resetFilter}
            >
              Redefinir
            </Button>
            <Button 
              size="sm"
              className="flex-1 h-9 bg-brand-600 hover:bg-brand-700 text-sm"
              onClick={applyChanges}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(LocationFilter);

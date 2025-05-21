
import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, X, ChevronDown, Search } from 'lucide-react';
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

const LocationFilter: React.FC<LocationFilterProps> = ({
  onFilterChange
}) => {
  const {
    filters,
    updateFilter
  } = useFilterStore();
  const [open, setOpen] = useState(false);
  const [localState, setLocalState] = useState(filters.location.state);
  const [localCity, setLocalCity] = useState(filters.location.city);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    states,
    loading: loadingStates
  } = useStates();
  const {
    cities,
    loading: loadingCities
  } = useCities(localState);

  // Update local state when filters change (e.g. reset)
  useEffect(() => {
    setLocalState(filters.location.state);
    setLocalCity(filters.location.city);
  }, [filters.location.state, filters.location.city]);

  // Format states for dropdown
  const stateOptions: FilterDropdownOption[] = [{
    value: '',
    label: 'Todos'
  }, ...states.map(state => ({
    value: state.sigla,
    label: `${state.sigla} - ${state.nome}`
  }))];

  // Format cities for dropdown
  const cityOptions: FilterDropdownOption[] = [{
    value: '',
    label: 'Todas'
  }, ...cities.map(city => ({
    value: city.nome,
    label: city.nome
  }))];

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

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
      detail: {
        scrollPosition: window.scrollY,
        timestamp: Date.now()
      }
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
  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={`w-full justify-between h-10 border rounded-lg px-3 py-2 border-gray-300 ${isFilterActive ? 'text-brand-700 font-medium' : 'text-gray-700'} focus-visible:outline-none ${!open ? 'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2' : ''}`}>
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
            {loadingStates ? <Skeleton className="h-10 w-full" /> : <FilterDropdown id="state-select" aria-label="Selecione o estado" value={localState} onChange={handleStateChange} options={stateOptions} className="border-gray-300" />}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="city-select" className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            {localState ? 
              loadingCities ? 
                <Skeleton className="h-10 w-full" /> 
                : 
                <FilterDropdown 
                  id="city-select" 
                  aria-label="Selecione a cidade" 
                  value={localCity} 
                  onChange={handleCityChange} 
                  options={cityOptions} 
                  className="border-gray-300"
                /> 
              : 
              <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
                Selecione um estado antes
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              </div>
            }
          </div>
          
          {/* Search bar for location - moved below city selection */}
          <div className="space-y-2">
            <label htmlFor="address-search" className="text-sm font-medium text-gray-700">
              Endereço
            </label>
            <div className="relative w-full">
              <input 
                id="address-search" 
                type="text" 
                value={searchQuery} 
                onChange={handleSearchChange} 
                placeholder="Busque por rua ou bairro" 
                className="w-full h-10 rounded-lg border border-gray-300 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" 
              />
              <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 h-9 text-sm border-gray-300" onClick={resetFilter}>
              Redefinir
            </Button>
            <Button size="sm" className="flex-1 h-9 bg-brand-600 hover:bg-brand-700 text-sm" onClick={applyChanges}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>;
};

export default React.memo(LocationFilter);

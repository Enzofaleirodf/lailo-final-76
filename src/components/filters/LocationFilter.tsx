
import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, X, ChevronDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFilterStore } from '@/stores/useFilterStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useStates, useCities } from '@/services/ibgeApi';
import FilterDropdown from './FilterDropdown';
import { LocationFilter as LocationFilterType } from '@/types/filters';
import { cn } from '@/lib/utils';

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
  
  // Log para debug
  console.log('LocationFilter - isFilterActive:', isFilterActive);

  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open} 
          className={cn(
            "w-full justify-between h-10 border rounded-lg px-3 py-2",
            isFilterActive ? "border-purple-300 text-gray-900 font-medium" : "border-gray-300 text-gray-700",
            "focus-visible:outline-none",
            !open ? 'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2' : '',
            "font-urbanist"
          )} 
          data-active={isFilterActive ? 'true' : 'false'}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className={isFilterActive ? "text-gray-800" : "text-gray-500"} />
            <span className="truncate">
              {getDisplayText()}
            </span>
          </div>
          <ChevronDown size={16} className="text-gray-500 ml-2 flex-shrink-0" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-full md:min-w-[320px] p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-900">Localização</h3>
            {isFilterActive && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilter}
                className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
              >
                Limpar
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              {loadingStates ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FilterDropdown 
                  id="state-filter"
                  value={localState}
                  onChange={handleStateChange}
                  options={stateOptions}
                  aria-label="Selecione o estado"
                  isActive={!!localState}
                />
              )}
            </div>
            
            <div>
              <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              {loadingCities ? (
                <Skeleton className="h-10 w-full" />
              ) : !localState ? (
                <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
                  Selecione um estado antes
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              ) : (
                <FilterDropdown 
                  id="city-filter"
                  value={localCity}
                  onChange={handleCityChange}
                  options={cityOptions}
                  aria-label="Selecione a cidade"
                  isActive={!!localCity}
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={applyChanges}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>;
};

export default React.memo(LocationFilter);

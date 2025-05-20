
import React, { useCallback } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilterStore } from '@/stores/useFilterStore';
import { CircleDashed, Building, Home, Building2, Warehouse, GalleryHorizontal, Store, Mountain, Fence, Hotel, DoorOpen } from 'lucide-react';

interface PropertyTypeFilterProps {
  onFilterChange?: () => void;
}

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  const handlePropertyTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    updateFilter('propertyTypes', value ? [value] : []);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  const propertyTypes = [
    { value: 'todos', icon: CircleDashed, label: 'Todos' },
    { value: 'apartamento', icon: Hotel, label: 'Apartamento' },
    { value: 'casa', icon: Home, label: 'Casa' },
    { value: 'condominio', icon: Building2, label: 'Condomínio' },
    { value: 'edificio', icon: Building, label: 'Edifício' },
    // Removed flat option
    { value: 'galpao', icon: Warehouse, label: 'Galpão' },
    { value: 'garagem', icon: GalleryHorizontal, label: 'Garagem' },
    { value: 'loja', icon: Store, label: 'Loja' },
    { value: 'sala', icon: DoorOpen, label: 'Sala' },
    { value: 'rural', icon: Fence, label: 'Rural' },
    { value: 'terreno', icon: Mountain, label: 'Terreno' }
  ];

  // Get the current single value from the array
  const currentValue = filters.propertyTypes && filters.propertyTypes.length > 0 
    ? filters.propertyTypes[0] 
    : '';

  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap gap-2 w-full justify-start"
        value={currentValue}
        onValueChange={handlePropertyTypeChange}
      >
        {propertyTypes.map(({ value, icon: Icon, label }) => (
          <ToggleGroupItem 
            key={value}
            value={value} 
            className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300 font-normal"
            aria-label={`Filtrar por ${label}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default React.memo(PropertyTypeFilter);

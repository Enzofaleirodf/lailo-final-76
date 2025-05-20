
import React, { useCallback } from 'react';
import { List, Plane, Car, Truck, Tractor, Bike, Ship, Bus } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilterStore } from '@/stores/useFilterStore';

interface VehicleTypeFilterProps {
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleVehicleTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    updateFilter('vehicleTypes', value ? [value] : []);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  const vehicleTypes = [
    { value: 'todos', icon: List, label: 'Todos' },
    { value: 'aereos', icon: Plane, label: 'Aéreo' },
    { value: 'carros', icon: Car, label: 'Carro' },
    { value: 'caminhoes', icon: Truck, label: 'Caminhão' },
    { value: 'maquinas', icon: Tractor, label: 'Máquina' },
    { value: 'micromobilidade', icon: Car, label: 'Micromobilidade' },
    { value: 'motos', icon: Bike, label: 'Moto' },
    { value: 'nauticos', icon: Ship, label: 'Naútico' },
    { value: 'onibus', icon: Bus, label: 'Ônibus' }
  ];

  // Get the current single value from the array
  const currentValue = filters.vehicleTypes && filters.vehicleTypes.length > 0 
    ? filters.vehicleTypes[0] 
    : '';

  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap gap-2 w-full justify-start"
        value={currentValue}
        onValueChange={handleVehicleTypeChange}
      >
        {vehicleTypes.map(({ value, icon: Icon, label }) => (
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

export default React.memo(VehicleTypeFilter);

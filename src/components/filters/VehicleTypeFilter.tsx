
import React, { useCallback } from 'react';
import { List, Plane, Car, Truck, Tractor, Bike, Ship, Bus } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilterStore } from '@/stores/useFilterStore';

const VehicleTypeFilter = () => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleVehicleTypeChange = useCallback((values: string[]) => {
    updateFilter('vehicleTypes', values);
  }, [updateFilter]);
  
  const vehicleTypes = [
    { value: 'todos', icon: List, label: 'Todos' },
    { value: 'aereos', icon: Plane, label: 'Aéreos' },
    { value: 'carros', icon: Car, label: 'Carros' },
    { value: 'caminhoes', icon: Truck, label: 'Caminhões' },
    { value: 'maquinas', icon: Tractor, label: 'Maquinas' },
    { value: 'micromobilidade', icon: Car, label: 'Micromobilidade' },
    { value: 'motos', icon: Bike, label: 'Motos' },
    { value: 'nauticos', icon: Ship, label: 'Naúticos' },
    { value: 'onibus', icon: Bus, label: 'Ônibus' },
    { value: 'reboques', icon: Truck, label: 'Reboques' },
    { value: 'tratores', icon: Tractor, label: 'Tratores' }
  ];

  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <ToggleGroup 
        type="multiple" 
        className="flex flex-wrap gap-2 w-full justify-start"
        value={filters.vehicleTypes as string[]}
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

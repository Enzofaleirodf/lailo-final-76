
import React, { useCallback, useId, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VehicleTypeFilterProps {
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ onFilterChange }) => {
  const id = useId();
  const { filters, updateFilter } = useFilterStore();
  const { category, contentType } = filters;
  
  // Obter os tipos de veículo disponíveis para a categoria selecionada
  let availableTypes = getTypesByCategory(category, 'vehicle');
  
  // Ordenar alfabeticamente
  if (availableTypes.includes('Todos')) {
    const todosIndex = availableTypes.indexOf('Todos');
    availableTypes.splice(todosIndex, 1);
    availableTypes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    availableTypes.unshift('Todos');
  } else {
    availableTypes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }
  
  // Quando a categoria mudar, selecionar automaticamente o tipo "Todos"
  useEffect(() => {
    if (category && filters.vehicleTypes.length === 0) {
      updateFilter('vehicleTypes', ['Todos']);
    }
  }, [category, updateFilter, filters.vehicleTypes]);
  
  const handleVehicleTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    updateFilter('vehicleTypes', value ? [value] : []);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);

  // Get the current single value from the array
  const currentValue = filters.vehicleTypes && filters.vehicleTypes.length > 0 
    ? filters.vehicleTypes[0] 
    : '';

  // Não mostrar nada se não houver categoria selecionada ou se estivermos no modo imóvel
  // Agora também ocultando quando a categoria é 'Todos'
  if (contentType !== 'vehicle' || !category || category === 'Todos') {
    return null;
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none text-foreground">
        Tipos
      </legend>
      <RadioGroup 
        className="flex flex-wrap gap-2" 
        value={currentValue}
        onValueChange={handleVehicleTypeChange}
      >
        {availableTypes.map((type) => (
          <div
            key={`${id}-${type}`}
            className="relative flex flex-col items-start gap-2 rounded-lg border border-input p-2 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-purple-300 has-[[data-state=checked]]:bg-purple-50"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id={`${id}-${type}`}
                value={type}
                className="after:absolute after:inset-0"
              />
              <Label 
                htmlFor={`${id}-${type}`} 
                className="text-xs font-normal cursor-pointer"
                aria-label={`Filtrar por ${type}`}
              >
                {type}
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default React.memo(VehicleTypeFilter);

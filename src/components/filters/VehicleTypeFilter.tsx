
import React, { useCallback, useId } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface VehicleTypeFilterProps {
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ onFilterChange }) => {
  const id = useId();
  const { filters, updateFilter } = useFilterStore();
  const { category, contentType } = filters;
  
  // Obter os tipos de veículo disponíveis para a categoria selecionada
  let availableTypes = category ? getTypesByCategory(category, 'vehicle') : [];
  
  // Ordenar alfabeticamente
  if (availableTypes.includes('Todos')) {
    const todosIndex = availableTypes.indexOf('Todos');
    availableTypes.splice(todosIndex, 1);
    availableTypes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    availableTypes.unshift('Todos');
  } else {
    availableTypes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }
  
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

  // Verificar se os controles devem estar desabilitados
  const isDisabled = !category;

  // Não mostrar nada se não for o modo veículo
  if (contentType !== 'vehicle') {
    return null;
  }

  if (availableTypes.length === 0) {
    return (
      <div className="px-1 py-2 text-sm text-gray-400">
        Escolha uma categoria antes
      </div>
    );
  }

  return (
    <fieldset className="space-y-4">
      <RadioGroup 
        className="flex flex-wrap gap-2" 
        value={currentValue}
        onValueChange={handleVehicleTypeChange}
        disabled={isDisabled}
      >
        {availableTypes.map((type) => (
          <div
            key={`${id}-${type}`}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-lg border p-2 shadow-sm shadow-black/5",
              isDisabled 
                ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                : "border-input has-[[data-state=checked]]:border-blue-300 has-[[data-state=checked]]:bg-blue-50"
            )}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id={`${id}-${type}`}
                value={type}
                className="after:absolute after:inset-0"
                disabled={isDisabled}
              />
              <Label 
                htmlFor={`${id}-${type}`} 
                className={cn(
                  "text-xs font-normal",
                  isDisabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
                )}
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

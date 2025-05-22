
import React, { useCallback, useId, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VehicleTypeFilterProps {
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ onFilterChange }) => {
  const id = useId();
  const { filters, updateFilter } = useFilterStore();
  const { category, contentType } = filters;
  
  // Obter os tipos de veículo disponíveis para a categoria selecionada
  let availableTypes = getTypesByCategory(category, 'vehicle');
  
  // Converter para plural, exceto "Todos"
  availableTypes = availableTypes.map(type => {
    if (type === 'Todos') return type;
    
    // Regras de pluralização em português
    if (type.endsWith('ão')) return type.replace(/ão$/, 'ões');
    if (type.endsWith('r')) return type + 'es';
    if (type.endsWith('il')) return type.replace(/il$/, 'is');
    if (type.endsWith('m')) return type.replace(/m$/, 'ns');
    if (['a', 'e', 'i', 'o', 'u'].includes(type.slice(-1))) return type + 's';
    return type + 's';
  });
  
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
  if (contentType !== 'vehicle' || !category) {
    return null;
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none text-foreground">
        Tipos de {category === 'Todos' ? 'Veículos' : category}
      </legend>
      <RadioGroup 
        className="grid grid-cols-3 gap-2" 
        value={currentValue}
        onValueChange={handleVehicleTypeChange}
      >
        {availableTypes.map((type) => (
          <label
            key={`${id}-${type}`}
            className="relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-input px-2 py-2 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-purple-300 has-[[data-state=checked]]:bg-purple-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
            aria-label={`Filtrar por ${type}`}
          >
            <RadioGroupItem
              id={`${id}-${type}`}
              value={type}
              className="sr-only after:absolute after:inset-0"
            />
            <p className="text-xs font-normal leading-tight text-foreground">{type}</p>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default React.memo(VehicleTypeFilter);

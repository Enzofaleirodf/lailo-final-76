
import React, { useCallback, useId } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PropertyTypeFilterProps {
  onFilterChange?: () => void;
}

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  onFilterChange
}) => {
  const id = useId();
  const {
    filters,
    updateFilter
  } = useFilterStore();
  const {
    category,
    contentType
  } = filters;

  // Obter os tipos de imóvel disponíveis para a categoria selecionada
  let availableTypes = getTypesByCategory(category, 'property');

  // Ordenar alfabeticamente
  // Make sure we always have 'Todos' as an option
  if (!availableTypes.includes('Todos')) {
    availableTypes = ['Todos', ...availableTypes];
  } else {
    const todosIndex = availableTypes.indexOf('Todos');
    availableTypes.splice(todosIndex, 1);
    availableTypes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    availableTypes.unshift('Todos');
  }

  const handlePropertyTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    if (value === 'Todos') {
      updateFilter('propertyTypes', []);
    } else {
      updateFilter('propertyTypes', value ? [value] : []);
    }

    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);

  // Get the current single value from the array
  const currentValue = filters.propertyTypes && filters.propertyTypes.length > 0 ? filters.propertyTypes[0] : '';

  // Não mostrar nada se não houver categoria selecionada ou se estivermos no modo veículo
  // Ou se a categoria for 'Todos'
  if (contentType !== 'property' || !category || category === 'Todos') {
    return null;
  }

  return (
    <fieldset className="space-y-4">
      <RadioGroup className="flex flex-wrap gap-2" value={currentValue} onValueChange={handlePropertyTypeChange}>
        {availableTypes.map(type => (
          <div key={`${id}-${type}`} className="relative flex flex-col items-start gap-2 rounded-lg border border-input p-2 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-purple-300 has-[[data-state=checked]]:bg-purple-50">
            <div className="flex items-center gap-2">
              <RadioGroupItem id={`${id}-${type}`} value={type} className="after:absolute after:inset-0" />
              <Label htmlFor={`${id}-${type}`} className="text-xs font-normal cursor-pointer" aria-label={`Filtrar por ${type}`}>
                {type}
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default React.memo(PropertyTypeFilter);

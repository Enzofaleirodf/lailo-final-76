
import React, { useCallback } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilterStore } from '@/stores/useFilterStore';
import { CircleDashed, Building, Home, Building2, Warehouse, Store, Mountain, Fence, Hotel, DoorOpen } from 'lucide-react';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';

interface PropertyTypeFilterProps {
  onFilterChange?: () => void;
}

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { category, contentType } = filters;
  
  // Obter os tipos de imóvel disponíveis para a categoria selecionada
  const availableTypes = getTypesByCategory(category, 'property');
  
  const handlePropertyTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    updateFilter('propertyTypes', value ? [value] : []);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  // Função para determinar o ícone com base no tipo
  const getIconForType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'apartamento':
      case 'kitnet':
      case 'quitinete':
      case 'flat':
      case 'studio':
      case 'loft':
        return Hotel;
      case 'casa':
      case 'sobrado':
      case 'imóvel misto':
        return Home;
      case 'condomínio residencial':
      case 'condomínio comercial':
      case 'conjunto residencial':
      case 'conjunto comercial':
        return Building2;
      case 'galpão':
      case 'industria':
        return Warehouse;
      case 'loja':
      case 'sala':
      case 'escritório':
      case 'depósito':
        return Store;
      case 'terreno residencial':
      case 'terreno comercial':
      case 'lote residencial':
      case 'lote comercial':
      case 'terreno rural':
        return Mountain;
      case 'chácara':
      case 'fazenda':
      case 'sítio':
        return Fence;
      case 'hotel':
      case 'motel':
      case 'pousada':
        return Hotel; // Alterado de Hotel2 para Hotel
      case 'prédio comercial':
      case 'prédio residencial':
      case 'edifício':
        return Building;
      case 'todos':
        return CircleDashed;
      default:
        return DoorOpen;
    }
  };

  // Get the current single value from the array
  const currentValue = filters.propertyTypes && filters.propertyTypes.length > 0 
    ? filters.propertyTypes[0] 
    : '';

  // Não mostrar nada se não houver categoria selecionada ou se estivermos no modo veículo
  if (contentType !== 'property' || !category) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <h4 className="text-sm font-medium text-gray-700 mb-2 w-full">
        Tipo de {category === 'Todos' ? 'Imóvel' : category}
      </h4>
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap gap-2 w-full justify-start"
        value={currentValue}
        onValueChange={handlePropertyTypeChange}
      >
        {availableTypes.map((type) => {
          const Icon = getIconForType(type);
          
          return (
            <ToggleGroupItem 
              key={type}
              value={type} 
              className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-gray-800 data-[state=on]:border-purple-300 font-normal"
              aria-label={`Filtrar por ${type}`}
            >
              <Icon size={14} />
              <span>{type}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

export default React.memo(PropertyTypeFilter);

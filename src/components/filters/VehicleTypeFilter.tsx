
import React, { useCallback } from 'react';
import { List, Plane, Car, Truck, Tractor, Bike, Ship, Bus, CircleDashed } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilterStore } from '@/stores/useFilterStore';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';

interface VehicleTypeFilterProps {
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ onFilterChange }) => {
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
  
  const handleVehicleTypeChange = useCallback((value: string) => {
    // Convert to array with single value for compatibility with existing filter logic
    updateFilter('vehicleTypes', value ? [value] : []);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);
  
  // Mapear ícones para os tipos de veículos
  const getIconForType = (type: string) => {
    // Remover possível final 's' para verificação
    const singularType = type.endsWith('s') ? type.slice(0, -1) : type;
    
    switch(singularType.toLowerCase()) {
      case 'avião':
      case 'aviõe':
      case 'helicóptero':
      case 'drone':
        return Plane;
      case 'barco':
      case 'lancha':
      case 'jet ski':
        return Ship;
      case 'caminhão':
      case 'caminhõe':
      case 'carreta':
      case 'cavalo mecânico':
      case 'reboque':
      case 'trailer':
        return Truck;
      case 'trator':
      case 'tratore':
      case 'colheitadeira':
      case 'plantadeira':
      case 'roçadeira':
        return Tractor;
      case 'moto':
      case 'bicicleta':
      case 'ciclomotor':
        return Bike;
      case 'micro-ônibu':
      case 'micro-ônibus':
      case 'ônibu':
      case 'ônibus':
      case 'motorhome':
        return Bus;
      case 'todo':
      case 'todos':
        return CircleDashed;
      default:
        return Car;
    }
  };

  // Get the current single value from the array
  const currentValue = filters.vehicleTypes && filters.vehicleTypes.length > 0 
    ? filters.vehicleTypes[0] 
    : '';

  // Não mostrar nada se não houver categoria selecionada ou se estivermos no modo imóvel
  if (contentType !== 'vehicle' || !category) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <h4 className="text-sm font-medium text-gray-700 mb-2 w-full">
        Tipos de {category === 'Todos' ? 'Veículos' : category}
      </h4>
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap gap-2 w-full justify-start"
        value={currentValue}
        onValueChange={handleVehicleTypeChange}
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

export default React.memo(VehicleTypeFilter);

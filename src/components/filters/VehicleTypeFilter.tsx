
import React, { useCallback, useMemo } from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import VirtualizedFilterOptions from './VirtualizedFilterOptions';
import { ChevronDown } from 'lucide-react';
import { getTypesByCategory } from '@/utils/categoryTypeMapping';
import { ContentType } from '@/types/filters';

interface VehicleTypeFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Obter tipos de veículo com base na categoria selecionada
  const typeOptions = useMemo(() => {
    return getTypesByCategory(filters.category, 'vehicle') || [];
  }, [filters.category]);
  
  const isDisabled = !filters.category;
  
  const handleSelectType = useCallback((type: string) => {
    // Garantir que vehicleTypes seja sempre um array
    const vehicleTypes = filters.vehicleTypes || [];
    let newTypes: string[];
    
    if (vehicleTypes.includes(type)) {
      // Se o tipo já está selecionado, remova-o
      newTypes = vehicleTypes.filter(t => t !== type);
    } else {
      // Caso contrário, adicione-o
      newTypes = [...vehicleTypes, type];
    }
    
    updateFilter('vehicleTypes', newTypes);
    
    // Notificar componente pai sobre a mudança
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.vehicleTypes, updateFilter, onFilterChange]);
  
  return (
    <div className="space-y-2">
      {isDisabled ? (
        <div className="relative h-10 w-full border border-gray-300 rounded-lg px-3 flex items-center text-gray-400 bg-gray-50 text-sm">
          Escolha uma categoria antes
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
        </div>
      ) : (
        <VirtualizedFilterOptions
          options={typeOptions}
          selectedOptions={filters.vehicleTypes || []}
          onSelectOption={handleSelectType}
          placeholder="Selecione os tipos"
          maxHeight={200}
          testId="vehicle-type-filter-options"
        />
      )}
    </div>
  );
};

export default React.memo(VehicleTypeFilter);

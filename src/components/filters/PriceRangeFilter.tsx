
import React, { useCallback, useState } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

/**
 * Componente de filtro de intervalo de preços
 * Agora usando o hook de consistência para comportamento padronizado
 */
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { range } = filters.price;
  
  // Use our filter consistency hook for unified behavior
  useFilterConsistency(onFilterChange);

  const handleMinChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        min: value
      }
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.price, range, updateFilter, onFilterChange]);

  const handleMaxChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        max: value
      }
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.price, range, updateFilter, onFilterChange]);

  return (
    <div className="space-y-3">
      <FilterRangeInput
        minValue={range.min}
        maxValue={range.max}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
        minPlaceholder="R$ Min"
        maxPlaceholder="R$ Max"
        ariaLabelMin="Preço mínimo"
        ariaLabelMax="Preço máximo"
        allowDecimals={true} 
        minAllowed={0}
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);

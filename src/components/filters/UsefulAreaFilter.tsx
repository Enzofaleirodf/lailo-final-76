
import React, { useCallback } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { formatUsefulArea } from '@/utils/auctionUtils';

interface UsefulAreaFilterProps {
  onFilterChange?: () => void;
}

const UsefulAreaFilter: React.FC<UsefulAreaFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleMinChange = useCallback((value: string) => {
    updateFilter('usefulArea', { 
      ...filters.usefulArea,
      min: value 
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.usefulArea, updateFilter, onFilterChange]);

  const handleMaxChange = useCallback((value: string) => {
    updateFilter('usefulArea', { 
      ...filters.usefulArea,
      max: value 
    });
    
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.usefulArea, updateFilter, onFilterChange]);

  // Format the placeholder with the correct notation
  const formatPlaceholder = (value: string, isMin: boolean) => {
    if (!value) return isMin ? "Min m²" : "Max m²";
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return isMin ? "Min m²" : "Max m²";
    return formatUsefulArea(numValue).replace('m²', '') + ' m²';
  };

  return (
    <div className="space-y-3">
      <FilterRangeInput
        minValue={filters.usefulArea.min}
        maxValue={filters.usefulArea.max}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
        minPlaceholder="Min m²"
        maxPlaceholder="Max m²"
        ariaLabelMin="Área útil mínima"
        ariaLabelMax="Área útil máxima"
      />
    </div>
  );
};

export default React.memo(UsefulAreaFilter);

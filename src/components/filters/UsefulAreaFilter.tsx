
import React, { useCallback } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { formatUsefulArea } from '@/utils/auctionUtils';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface UsefulAreaFilterProps {
  onFilterChange?: () => void;
}

const UsefulAreaFilter: React.FC<UsefulAreaFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  const handleMinChange = useCallback((value: string) => {
    updateFilter('usefulArea', { 
      ...filters.usefulArea,
      min: value 
    });
    
    handleFilterChange();
  }, [filters.usefulArea, updateFilter, handleFilterChange]);

  const handleMaxChange = useCallback((value: string) => {
    updateFilter('usefulArea', { 
      ...filters.usefulArea,
      max: value 
    });
    
    handleFilterChange();
  }, [filters.usefulArea, updateFilter, handleFilterChange]);

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
        allowDecimals={true} // Allow decimals for area measurements
        minAllowed={0} // Area cannot be negative
      />
    </div>
  );
};

export default React.memo(UsefulAreaFilter);

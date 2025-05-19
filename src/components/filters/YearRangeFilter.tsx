
import React, { useCallback } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { year } = filters;

  const handleMinChange = useCallback((minValue: string) => {
    updateFilter('year', {
      ...year,
      min: minValue
    });
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [year, updateFilter, onFilterChange]);

  const handleMaxChange = useCallback((maxValue: string) => {
    updateFilter('year', {
      ...year,
      max: maxValue
    });
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [year, updateFilter, onFilterChange]);

  return (
    <FilterRangeInput
      minValue={year.min}
      maxValue={year.max}
      onMinChange={handleMinChange}
      onMaxChange={handleMaxChange}
      minPlaceholder="Ano Min"
      maxPlaceholder="Ano Max"
      ariaLabelMin="Ano mínimo"
      ariaLabelMax="Ano máximo"
    />
  );
};

export default React.memo(YearRangeFilter);

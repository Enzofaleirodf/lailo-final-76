
import React, { useCallback } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';

const YearRangeFilter: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  const { year } = filters;

  const handleMinChange = useCallback((minValue: string) => {
    updateFilter('year', {
      ...year,
      min: minValue
    });
  }, [year, updateFilter]);

  const handleMaxChange = useCallback((maxValue: string) => {
    updateFilter('year', {
      ...year,
      max: maxValue
    });
  }, [year, updateFilter]);

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

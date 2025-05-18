
import React from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilter } from '@/contexts/FilterContext';

const YearRangeFilter: React.FC = () => {
  const { filters, updateFilter } = useFilter();
  const { year } = filters;

  const handleMinChange = (minValue: string) => {
    updateFilter('year', {
      ...year,
      min: minValue
    });
  };

  const handleMaxChange = (maxValue: string) => {
    updateFilter('year', {
      ...year,
      max: maxValue
    });
  };

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

export default YearRangeFilter;

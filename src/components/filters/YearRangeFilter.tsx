
import React, { useState, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import { FormLabel } from '@/components/ui/form';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import FilterRangeInput from './FilterRangeInput';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { handleFilterChange } = useFilterConsistency();
  const currentYear = new Date().getFullYear();
  
  // Estado local para controlar os valores de input
  const [yearMin, setYearMin] = useState(filters.year.min || '');
  const [yearMax, setYearMax] = useState(filters.year.max || '');
  
  // Validação de intervalo
  const { minError, maxError, validateRange, handleMinChange, handleMaxChange } = useFilterRangeValidator(yearMin, yearMax, {
    minAllowed: 1900,
    maxAllowed: currentYear,
    onMinChange: setYearMin,
    onMaxChange: setYearMax
  });
  
  // Atualizar o filtro no store
  const updateYearFilter = useCallback((min: string, max: string) => {
    updateFilter('year', { min, max });
    
    if (onFilterChange) {
      onFilterChange();
    }
    
    handleFilterChange();
  }, [updateFilter, onFilterChange, handleFilterChange]);
  
  // Lidar com mudança no valor mínimo
  const handleMinYearChange = useCallback((value: string) => {
    handleMinChange(value);
    
    if (!minError && !maxError) {
      updateYearFilter(value, yearMax);
    }
  }, [yearMax, minError, maxError, handleMinChange, updateYearFilter]);
  
  // Lidar com mudança no valor máximo
  const handleMaxYearChange = useCallback((value: string) => {
    handleMaxChange(value);
    
    if (!minError && !maxError) {
      updateYearFilter(yearMin, value);
    }
  }, [yearMin, minError, maxError, handleMaxChange, updateYearFilter]);
  
  return (
    <div className="space-y-1">
      <FormLabel className="text-sm font-medium leading-none text-gray-700">Ano</FormLabel>
      
      <div className="flex items-center space-x-2 mt-1">
        <FilterRangeInput
          minValue={yearMin}
          maxValue={yearMax}
          onMinChange={handleMinYearChange}
          onMaxChange={handleMaxYearChange}
          minPlaceholder="Min."
          maxPlaceholder="Max."
          ariaLabelMin="Ano mínimo"
          ariaLabelMax="Ano máximo"
          allowDecimals={false}
          allowNegative={false}
          minAllowed={1900}
          maxAllowed={currentYear}
          className="w-full"
        />
      </div>
      
      {(minError || maxError) && (
        <p className="text-xs text-red-500">
          {minError || maxError}
        </p>
      )}
    </div>
  );
};

export default YearRangeFilter;


import React, { useState, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import { FormLabel } from '@/components/ui/form';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { FilterRangeInput } from './FilterRangeInput';

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
  const { error, validateRange } = useFilterRangeValidator({
    min: { value: yearMin, type: 'number', minValue: 1900, maxValue: currentYear },
    max: { value: yearMax, type: 'number', minValue: 1900, maxValue: currentYear },
    errorMessages: {
      invalidMin: 'Ano mínimo inválido',
      invalidMax: 'Ano máximo inválido',
      rangeError: 'Ano mínimo deve ser menor que o máximo'
    }
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
  const handleMinChange = useCallback((value: string) => {
    setYearMin(value);
    
    if (validateRange(value, yearMax)) {
      updateYearFilter(value, yearMax);
    }
  }, [yearMax, validateRange, updateYearFilter]);
  
  // Lidar com mudança no valor máximo
  const handleMaxChange = useCallback((value: string) => {
    setYearMax(value);
    
    if (validateRange(yearMin, value)) {
      updateYearFilter(yearMin, value);
    }
  }, [yearMin, validateRange, updateYearFilter]);
  
  return (
    <div className="space-y-2">
      <FormLabel className="text-sm font-medium leading-none text-gray-700 mb-0">Ano</FormLabel>
      
      <div className="flex items-center space-x-2">
        <FilterRangeInput
          id="year-min"
          value={yearMin}
          onChange={handleMinChange}
          placeholder="Min."
          maxLength={4}
          inputMode="numeric"
          aria-label="Ano mínimo"
          hasError={!!error}
          className="w-full"
        />
        <span className="text-gray-400">-</span>
        <FilterRangeInput
          id="year-max"
          value={yearMax}
          onChange={handleMaxChange}
          placeholder="Max."
          maxLength={4}
          inputMode="numeric"
          aria-label="Ano máximo"
          hasError={!!error}
          className="w-full"
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default YearRangeFilter;

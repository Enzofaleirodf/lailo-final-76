
import React, { useCallback, useEffect } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { min, max } = filters.year;
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });

  // Definir range total ao montar o componente
  useEffect(() => {
    // Aqui setaríamos valores do banco, mas como temos dados simulados,
    // deixamos os campos vazios para representar o range total
    // No futuro, quando estiver integrado com API real, substituir por:
    // updateFilter('year', {
    //   min: minYearFromDatabase,
    //   max: currentYear
    // });
  }, []);
  
  const handleMinChange = useCallback((value: string) => {
    updateFilter('year', { 
      ...filters.year,
      min: value 
    });
    
    handleFilterChange();
  }, [filters.year, updateFilter, handleFilterChange]);
  
  const handleMaxChange = useCallback((value: string) => {
    updateFilter('year', { 
      ...filters.year,
      max: value 
    });
    
    handleFilterChange();
  }, [filters.year, updateFilter, handleFilterChange]);
  
  return (
    <div className="space-y-3">
      <FilterRangeInput 
        minValue={min}
        maxValue={max}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
        minPlaceholder="Ano min."
        maxPlaceholder="Ano máx."
        ariaLabelMin="Ano mínimo"
        ariaLabelMax="Ano máximo"
        allowDecimals={false}
        minAllowed={1900}
      />
    </div>
  );
};

export default React.memo(YearRangeFilter);

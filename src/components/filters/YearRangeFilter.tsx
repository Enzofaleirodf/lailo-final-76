
import React, { useCallback, useEffect, useId } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { Label } from "@/components/ui/label";
import FilterRangeInput from './FilterRangeInput';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { defaultRangeValues } from '@/stores/useFilterStore';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const id = useId();
  const { filters, updateFilter } = useFilterStore();
  const { year } = filters;
  
  // Usar o hook de validação para gerenciar erros
  const {
    minError,
    maxError,
    handleMinChange,
    handleMaxChange,
    validateRange,
    clearErrors,
    hasErrors
  } = useFilterRangeValidator({
    min: year.min,
    max: year.max,
    fieldName: 'year',
    minLimit: defaultRangeValues.year.min,
    maxLimit: defaultRangeValues.year.max
  });

  // Limpar erros ao desmontar o componente
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Funções para atualizar os valores de filtro
  const handleMinYearChange = useCallback((value: string) => {
    handleMinChange(value);
    
    updateFilter('year', {
      ...year,
      min: value
    });
    
    if (onFilterChange) onFilterChange();
  }, [handleMinChange, updateFilter, year, onFilterChange]);

  const handleMaxYearChange = useCallback((value: string) => {
    handleMaxChange(value);
    
    updateFilter('year', {
      ...year,
      max: value
    });
    
    if (onFilterChange) onFilterChange();
  }, [handleMaxChange, updateFilter, year, onFilterChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-min-year`} className="text-sm font-medium text-gray-700">
        Ano do veículo
      </Label>
      
      <div className="flex gap-2 items-center">
        <FilterRangeInput
          value={year.min}
          onChange={handleMinYearChange}
          placeholder="Min"
          maxLength={4}
          inputMode="numeric"
          aria-label="Ano mínimo"
          hasError={!!minError}
          className="flex-1"
        />
        
        <span className="text-gray-400">até</span>
        
        <FilterRangeInput
          value={year.max}
          onChange={handleMaxYearChange}
          placeholder="Max"
          maxLength={4}
          inputMode="numeric"
          aria-label="Ano máximo"
          hasError={!!maxError}
          className="flex-1"
        />
      </div>
      
      {/* Exibir mensagens de erro */}
      {(minError || maxError) && (
        <div className="text-xs text-red-500 mt-1">
          {minError || maxError}
        </div>
      )}
    </div>
  );
};

export default React.memo(YearRangeFilter);

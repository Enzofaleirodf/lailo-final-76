
import React, { useCallback, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { Label } from "@/components/ui/label";
import FilterRangeInput from './FilterRangeInput';
import { useFilterRangeValidator } from '@/hooks/useFilterRangeValidator';
import { defaultRangeValues } from '@/stores/useFilterStore';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
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
  } = useFilterRangeValidator(
    year.min,
    year.max,
    {
      minAllowed: Number(defaultRangeValues.year.min),
      maxAllowed: Number(defaultRangeValues.year.max),
      onMinChange: (value) => {
        updateFilter('year', {
          ...year,
          min: value
        });
        
        if (onFilterChange) onFilterChange();
      },
      onMaxChange: (value) => {
        updateFilter('year', {
          ...year,
          max: value
        });
        
        if (onFilterChange) onFilterChange();
      }
    }
  );

  // Limpar erros ao desmontar o componente
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Verificar se o filtro está ativo - corrigido para considerar apenas valores não vazios
  const isFilterActive = 
    (year.min !== '' && year.min !== defaultRangeValues.year.min) || 
    (year.max !== '' && year.max !== defaultRangeValues.year.max);

  return (
    <div className="space-y-2">
      <Label htmlFor="year-filter" className="text-sm font-medium text-gray-700">
        Ano do veículo
      </Label>
      
      <div className="flex items-center gap-2">
        <FilterRangeInput
          minValue={year.min}
          maxValue={year.max}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          minPlaceholder="Min"
          maxPlaceholder="Max"
          ariaLabelMin="Ano mínimo"
          ariaLabelMax="Ano máximo"
          className="flex-1"
          minAllowed={Number(defaultRangeValues.year.min)}
          maxAllowed={Number(defaultRangeValues.year.max)}
          isFilterActive={isFilterActive}
          defaultMin={defaultRangeValues.year.min}
          defaultMax={defaultRangeValues.year.max}
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

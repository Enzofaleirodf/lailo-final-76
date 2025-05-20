
import React, { useCallback, useEffect, useState } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { min, max } = filters.year;
  const [defaultRange, setDefaultRange] = useState<{min: string, max: string}>({min: '', max: ''});
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });

  // Definir range total ao montar o componente
  useEffect(() => {
    // Simular valores mínimos e máximos do banco
    // Em uma implementação real, isso viria de uma chamada API
    const currentYear = new Date().getFullYear();
    const minYearFromDatabase = "2000"; // Ano mais antigo na base
    const maxYearFromDatabase = currentYear.toString(); // Ano atual
    
    // Armazenar os valores padrão para comparação posterior
    setDefaultRange({
      min: minYearFromDatabase,
      max: maxYearFromDatabase
    });
    
    // Atualizar os valores no store apenas se estiverem vazios
    if (!min && !max) {
      updateFilter('year', {
        min: minYearFromDatabase,
        max: maxYearFromDatabase
      });
    } else {
      // Se já existirem valores, verificar se são diferentes dos padrão
      checkIfFilterActive(min, max, minYearFromDatabase, maxYearFromDatabase);
    }
  }, []);
  
  // Verificar se o filtro está ativo (valores diferentes dos padrão)
  const checkIfFilterActive = useCallback((min: string, max: string, defaultMin: string, defaultMax: string) => {
    const isActive = min !== defaultMin || max !== defaultMax;
    setIsFilterActive(isActive);
    return isActive;
  }, []);
  
  const handleMinChange = useCallback((value: string) => {
    updateFilter('year', { 
      ...filters.year,
      min: value 
    });
    
    // Verificar se o filtro está ativo após a mudança
    const isActive = checkIfFilterActive(value, max, defaultRange.min, defaultRange.max);
    
    // Se o filtro estiver ativo ou acabou de ser desativado, notificar mudança
    if (isActive || isFilterActive) {
      handleFilterChange();
    }
  }, [filters.year, max, updateFilter, handleFilterChange, defaultRange, checkIfFilterActive, isFilterActive]);
  
  const handleMaxChange = useCallback((value: string) => {
    updateFilter('year', { 
      ...filters.year,
      max: value 
    });
    
    // Verificar se o filtro está ativo após a mudança
    const isActive = checkIfFilterActive(min, value, defaultRange.min, defaultRange.max);
    
    // Se o filtro estiver ativo ou acabou de ser desativado, notificar mudança
    if (isActive || isFilterActive) {
      handleFilterChange();
    }
  }, [filters.year, min, updateFilter, handleFilterChange, defaultRange, checkIfFilterActive, isFilterActive]);
  
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
        isFilterActive={isFilterActive}
        defaultMin={defaultRange.min}
        defaultMax={defaultRange.max}
      />
    </div>
  );
};

export default React.memo(YearRangeFilter);

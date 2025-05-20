
import React, { useCallback, useEffect } from 'react';
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
  
  // Definir range total ao montar o componente
  useEffect(() => {
    // Simular valores mínimos e máximos do banco
    // Em uma implementação real, isso viria de uma chamada API
    const minValueFromDatabase = "30"; // 30m²
    const maxValueFromDatabase = "500"; // 500m²
    
    // Atualizar os valores no store apenas se estiverem vazios
    if (!filters.usefulArea.min && !filters.usefulArea.max) {
      updateFilter('usefulArea', {
        min: minValueFromDatabase,
        max: maxValueFromDatabase
      });
    }
  }, []);
  
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

  // Verificar se os valores são diferentes dos valores iniciais para marcar o filtro como ativo
  const isFilterActive = filters.usefulArea.min !== "30" || filters.usefulArea.max !== "500";

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
        inputSuffix="m²"
        isFilterActive={isFilterActive}
        defaultMin="30"
        defaultMax="500"
      />
    </div>
  );
};

export default React.memo(UsefulAreaFilter);

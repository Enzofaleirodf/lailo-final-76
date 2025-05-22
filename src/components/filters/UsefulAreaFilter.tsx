
import React, { useCallback, useEffect } from 'react';
import { useFilterStore, defaultRangeValues } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';

interface UsefulAreaFilterProps {
  onFilterChange?: () => void;
}

/**
 * Componente de filtro para área útil de imóveis
 * Melhorado para tratamento adequado do sufixo "m²"
 */
const UsefulAreaFilter: React.FC<UsefulAreaFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Define default values (mocado - normalmente viria do banco)
  const defaultValues = defaultRangeValues.usefulArea;
  
  // Handle filter value changes
  const handleRangeChange = useCallback((values: RangeValues) => {
    updateFilter('usefulArea', values);
    handleFilterChange();
  }, [updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    if (!filters.usefulArea.min && !filters.usefulArea.max) {
      updateFilter('usefulArea', defaultValues);
    }
  }, []);
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.usefulArea.min !== defaultValues.min || 
    filters.usefulArea.max !== defaultValues.max;
  
  return (
    <div className="space-y-3">
      <SimplifiedRangeFilter
        initialValues={filters.usefulArea}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Área útil mínima"
        ariaLabelMax="Área útil máxima"
        allowDecimals={true}
        minAllowed={Number(defaultValues.min)}
        maxAllowed={Number(defaultValues.max)}
        inputSuffix="m²"
        isActive={isFilterActive}
        formatterOptions={{
          useThousandSeparator: true,
          formatDisplay: true
        }}
      />
    </div>
  );
};

export default React.memo(UsefulAreaFilter);

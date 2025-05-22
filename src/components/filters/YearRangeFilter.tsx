
import React, { useCallback, useEffect } from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';
import { ContentType } from '@/types/filters';

interface YearRangeFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Definir os valores padrão baseados na store correta
  const storeModule = contentType === 'property' ? 
    require('@/stores/usePropertyFiltersStore') : 
    require('@/stores/useVehicleFiltersStore');
  
  // Define default values
  const defaultValues = storeModule.defaultRangeValues.year;
  
  // Handle filter value changes
  const handleRangeChange = useCallback((values: RangeValues) => {
    updateFilter('year', values);
    handleFilterChange();
  }, [updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    if (!filters.year.min && !filters.year.max) {
      updateFilter('year', defaultValues);
    }
  }, []);
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.year.min !== defaultValues.min || 
    filters.year.max !== defaultValues.max;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-3">
      <SimplifiedRangeFilter
        initialValues={filters.year}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Ano mínimo"
        ariaLabelMax="Ano máximo"
        allowDecimals={false}
        minAllowed={Number(defaultValues.min)}
        maxAllowed={currentYear}
        isActive={isFilterActive}
        formatterOptions={{
          useThousandSeparator: false,
          formatDisplay: false
        }}
      />
    </div>
  );
};

export default React.memo(YearRangeFilter);

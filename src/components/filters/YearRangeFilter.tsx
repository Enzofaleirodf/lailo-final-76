
import React, { useCallback, useEffect } from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import RangeFilter from './RangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';
import { ContentType } from '@/types/filters';
import { defaultRangeValues as propertyDefaultRangeValues } from '@/stores/usePropertyFiltersStore';
import { defaultRangeValues as vehicleDefaultRangeValues } from '@/stores/useVehicleFiltersStore';

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
  
  // Obter valores padrão corretos com base no tipo de conteúdo
  const defaultValues = contentType === 'property' ? 
    propertyDefaultRangeValues.year : 
    vehicleDefaultRangeValues.year;
  
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
  }, [defaultValues]); // Adicionar dependências para evitar loops
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.year.min !== defaultValues.min || 
    filters.year.max !== defaultValues.max;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-3">
      <RangeFilter
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

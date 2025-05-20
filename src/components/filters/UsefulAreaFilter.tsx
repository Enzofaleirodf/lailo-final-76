
import React, { useCallback, useEffect } from 'react';
import { useFilterStore, defaultRangeValues } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';

interface UsefulAreaFilterProps {
  onFilterChange?: () => void;
}

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
  
  return (
    <div className="space-y-3">
      <SimplifiedRangeFilter
        initialValues={filters.usefulArea}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Min m²"
        maxPlaceholder="Max m²"
        ariaLabelMin="Área útil mínima"
        ariaLabelMax="Área útil máxima"
        allowDecimals={true}
        minAllowed={Number(defaultValues.min)}
        maxAllowed={Number(defaultValues.max)}
        inputSuffix="m²"
        formatterOptions={{
          useThousandSeparator: true,
          formatDisplay: true
        }}
      />
    </div>
  );
};

export default React.memo(UsefulAreaFilter);

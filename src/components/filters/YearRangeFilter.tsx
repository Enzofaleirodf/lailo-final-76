
import React, { useCallback, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Define default values (mocado - normalmente viria do banco)
  const currentYear = new Date().getFullYear();
  const defaultValues = {
    min: "2000",
    max: currentYear.toString()
  };
  
  // Handle filter value changes
  const handleRangeChange = useCallback((values: RangeValues) => {
    updateFilter('year', values);
    handleFilterChange();
  }, [updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty
  useEffect(() => {
    if (!filters.year.min && !filters.year.max) {
      updateFilter('year', defaultValues);
    }
  }, []);
  
  return (
    <div className="space-y-3">
      <SimplifiedRangeFilter
        initialValues={filters.year}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Ano min."
        maxPlaceholder="Ano máx."
        ariaLabelMin="Ano mínimo"
        ariaLabelMax="Ano máximo"
        allowDecimals={false}
        minAllowed={1900}
        maxAllowed={currentYear}
        formatterOptions={{
          useThousandSeparator: false,
          formatDisplay: true
        }}
      />
    </div>
  );
};

export default React.memo(YearRangeFilter);

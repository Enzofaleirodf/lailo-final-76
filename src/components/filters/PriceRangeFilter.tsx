
import React, { useCallback, useEffect } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Define default values
  const defaultValues = {
    min: "10000",
    max: "1000000"
  };
  
  // Handle filter value changes
  const handleRangeChange = useCallback((values: RangeValues) => {
    updateFilter('price', {
      ...filters.price,
      range: values
    });
    handleFilterChange();
  }, [filters.price, updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty
  useEffect(() => {
    if (!filters.price.range.min && !filters.price.range.max) {
      updateFilter('price', {
        ...filters.price,
        range: defaultValues
      });
    }
  }, []);
  
  return (
    <div className="space-y-3">
      <SimplifiedRangeFilter
        initialValues={filters.price.range}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Preço mínimo"
        ariaLabelMax="Preço máximo"
        allowDecimals={true}
        minAllowed={0}
        inputPrefix="R$"
        showActiveBadge={true}
        formatterOptions={{
          useThousandSeparator: true,
          formatDisplay: true
        }}
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);

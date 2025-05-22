
import React, { useCallback, useEffect } from 'react';
import { useFilterStore, defaultRangeValues } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import SimplifiedRangeFilter from './SimplifiedRangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';
import FilterSectionComponent from './FilterSectionComponent';

interface YearRangeFilterProps {
  onFilterChange?: () => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter, expandedSections, toggleSection } = useFilterStore();
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Define default values (mocado - normalmente viria do banco)
  const defaultValues = defaultRangeValues.year;
  
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

  const handleSectionToggle = () => {
    toggleSection('year');
  };
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.year.min !== defaultValues.min || 
    filters.year.max !== defaultValues.max;
  
  return (
    <FilterSectionComponent 
      title="Ano" 
      isExpanded={expandedSections.year} 
      onToggle={handleSectionToggle}
      isActive={isFilterActive}
    >
      <div className="space-y-3">
        <label htmlFor="year-range" className="block text-sm font-medium text-gray-700 mb-1">
          Ano
        </label>
        <SimplifiedRangeFilter
          initialValues={filters.year}
          defaultValues={defaultValues}
          onChange={handleRangeChange}
          minPlaceholder="Ano min."
          maxPlaceholder="Ano máx."
          ariaLabelMin="Ano mínimo"
          ariaLabelMax="Ano máximo"
          allowDecimals={false}
          minAllowed={Number(defaultValues.min)}
          maxAllowed={Number(defaultValues.max)}
          isActive={isFilterActive}
          formatterOptions={{
            useThousandSeparator: false,
            formatDisplay: false
          }}
          id="year-range"
        />
      </div>
    </FilterSectionComponent>
  );
};

export default React.memo(YearRangeFilter);

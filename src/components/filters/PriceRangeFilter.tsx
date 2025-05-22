
import React, { useCallback, useEffect } from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import RangeFilter from './RangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';
import { ContentType } from '@/types/filters';
import { defaultRangeValues as propertyDefaultRangeValues } from '@/stores/usePropertyFiltersStore';
import { defaultRangeValues as vehicleDefaultRangeValues } from '@/stores/useVehicleFiltersStore';

interface PriceRangeFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Obter valores padrão corretos com base no tipo de conteúdo
  const defaultValues = contentType === 'property' ? 
    propertyDefaultRangeValues.price : 
    vehicleDefaultRangeValues.price;
  
  // Handle filter value changes
  const handleRangeChange = useCallback((values: RangeValues) => {
    updateFilter('price', {
      ...filters.price,
      range: values
    });
    handleFilterChange();
  }, [filters.price, updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    if (!filters.price.range.min && !filters.price.range.max) {
      updateFilter('price', {
        ...filters.price,
        range: defaultValues
      });
    }
  }, [defaultValues, filters.price]); // Adicionar dependências para evitar loops
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.price.range.min !== defaultValues.min || 
    filters.price.range.max !== defaultValues.max;
  
  return (
    <div className="space-y-3">
      <RangeFilter
        initialValues={filters.price.range}
        defaultValues={defaultValues}
        onChange={handleRangeChange}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Preço mínimo"
        ariaLabelMax="Preço máximo"
        allowDecimals={true}
        minAllowed={Number(defaultValues.min)}
        maxAllowed={Number(defaultValues.max)}
        inputPrefix="R$"
        isActive={isFilterActive}
        formatterOptions={{
          useThousandSeparator: true,
          formatDisplay: true
        }}
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);

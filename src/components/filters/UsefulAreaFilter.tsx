
import React, { useCallback, useEffect } from 'react';
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import RangeFilter from './RangeFilter';
import { RangeValues } from '@/hooks/useRangeFilter';
import { ContentType } from '@/types/filters';
import { defaultRangeValues as propertyDefaultRangeValues } from '@/stores/usePropertyFiltersStore';
import { defaultRangeValues as vehicleDefaultRangeValues } from '@/stores/useVehicleFiltersStore';

interface UsefulAreaFilterProps {
  contentType: ContentType;
  onFilterChange?: () => void;
}

/**
 * Componente de filtro para área útil de imóveis
 * Melhorado para tratamento adequado do sufixo "m²"
 */
const UsefulAreaFilter: React.FC<UsefulAreaFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Obter valores padrão corretos com base no tipo de conteúdo
  const defaultValues = contentType === 'property' ? 
    propertyDefaultRangeValues.usefulArea : 
    vehicleDefaultRangeValues.usefulArea;
  
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
  }, [defaultValues, filters.usefulArea]); // Adicionar dependências para evitar loops
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.usefulArea.min !== defaultValues.min || 
    filters.usefulArea.max !== defaultValues.max;
  
  return (
    <div className="space-y-3">
      <RangeFilter
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

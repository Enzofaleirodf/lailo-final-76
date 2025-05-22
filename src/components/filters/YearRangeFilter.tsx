
import React, { useCallback, useEffect, useRef } from 'react';
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
  const initializationDone = useRef(false);
  
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
    if (!filters?.year) return; // Proteção contra valores indefinidos
    
    // Não atualizar se os valores forem iguais aos atuais
    if (filters?.year?.min === values.min && 
        filters?.year?.max === values.max) {
      return;
    }
    
    updateFilter('year', values);
    handleFilterChange();
  }, [filters?.year, updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    // Garantir que a inicialização aconteça apenas uma vez
    if (initializationDone.current) return;
    if (!filters) return; // Proteção adicional
    
    // Inicializar apenas se ambos os valores estiverem vazios
    if (!filters?.year?.min && !filters?.year?.max) {
      // Apenas atualizar se realmente diferente dos valores padrão
      if (defaultValues.min !== filters?.year?.min || 
          defaultValues.max !== filters?.year?.max) {
        updateFilter('year', defaultValues);
      }
    }
    
    initializationDone.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); 
  
  // Verificação de segurança para evitar erros
  if (!filters?.year) {
    return null; // Não renderizar nada se os dados não estiverem prontos
  }
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters.year.min !== defaultValues.min || 
    filters.year.max !== defaultValues.max;
  
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
        maxAllowed={Number(defaultValues.max)}
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

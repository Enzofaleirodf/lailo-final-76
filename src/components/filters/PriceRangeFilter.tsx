
import React, { useCallback, useEffect, useRef } from 'react';
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
  const initializationDone = useRef(false);
  
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
    // Não atualizar se os valores forem iguais aos atuais
    if (filters?.price?.range?.min === values.min && 
        filters?.price?.range?.max === values.max) {
      return;
    }
    
    updateFilter('price', {
      ...filters.price,
      range: values
    });
    handleFilterChange();
  }, [filters?.price, updateFilter, handleFilterChange]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    // Se a inicialização já foi feita, não execute novamente
    if (initializationDone.current) return;
    
    // Verificar se o filtro price existe e se já tem valores
    if (!filters?.price?.range?.min && !filters?.price?.range?.max) {
      updateFilter('price', {
        value: filters?.price?.value || [0, 100],
        range: defaultValues
      });
    }
    
    initializationDone.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem
  
  // Adicionar verificação de segurança para evitar erros
  if (!filters?.price?.range) {
    return null; // Não renderizar nada se os dados não estiverem prontos
  }
  
  // Verificar se o filtro está ativo (não está usando valores padrão)
  const isFilterActive = 
    filters?.price?.range?.min !== defaultValues.min || 
    filters?.price?.range?.max !== defaultValues.max;
  
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

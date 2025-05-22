
import React, { useCallback, useEffect, useRef } from 'react';
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
 * Versão otimizada para evitar loops de renderização
 */
const UsefulAreaFilter: React.FC<UsefulAreaFilterProps> = ({ contentType, onFilterChange }) => {
  const { filters, updateFilter } = useFilterStoreSelector(contentType);
  const initializationDone = useRef(false);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  // Obter valores padrão corretos com base no tipo de conteúdo
  const defaultValues = contentType === 'property' ? 
    propertyDefaultRangeValues.usefulArea : 
    vehicleDefaultRangeValues.usefulArea;
  
  // Handle filter value changes - com memoização para prevenir recriação desnecessária
  const handleRangeChange = useCallback((values: RangeValues) => {
    // Não atualizar se os valores forem iguais aos atuais
    if (filters?.usefulArea?.min === values.min && 
        filters?.usefulArea?.max === values.max) {
      return;
    }
    
    updateFilter('usefulArea', values);
    handleFilterChange();
  }, [updateFilter, handleFilterChange, filters?.usefulArea?.min, filters?.usefulArea?.max]);
  
  // Initialize with default values if empty - only on first mount
  useEffect(() => {
    // Garantir que a inicialização aconteça apenas uma vez
    if (initializationDone.current) return;
    
    // Inicializar apenas se ambos os valores estiverem vazios
    if (!filters?.usefulArea?.min && !filters?.usefulArea?.max) {
      // Apenas atualizar se realmente diferente dos valores padrão
      if (defaultValues.min !== filters?.usefulArea?.min || 
          defaultValues.max !== filters?.usefulArea?.max) {
        updateFilter('usefulArea', defaultValues);
      }
    }
    
    initializationDone.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  // Verificação de segurança para evitar erros
  if (!filters?.usefulArea) {
    return null; // Não renderizar nada se os dados não estiverem prontos
  }
  
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

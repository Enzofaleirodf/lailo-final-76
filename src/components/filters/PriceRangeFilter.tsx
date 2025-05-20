
import React, { useCallback, useEffect, useState } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

/**
 * Componente de filtro de intervalo de preços
 * Implementa as regras para considerar o filtro como ativo apenas quando
 * os valores estão diferentes dos limites padrão do banco de dados
 */
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { range } = filters.price;
  const [defaultRange, setDefaultRange] = useState<{min: string, max: string}>({min: '', max: ''});
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  // Use our filter consistency hook for unified behavior
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });

  // Definir range total ao montar o componente
  useEffect(() => {
    // Simular valores mínimos e máximos do banco
    // Em uma implementação real, isso viria de uma chamada API
    const minValueFromDatabase = "10000"; // R$ 10.000
    const maxValueFromDatabase = "1000000"; // R$ 1.000.000
    
    // Armazenar os valores padrão para comparação posterior
    setDefaultRange({
      min: minValueFromDatabase,
      max: maxValueFromDatabase
    });
    
    // Atualizar os valores no store apenas se estiverem vazios
    if (!range.min && !range.max) {
      updateFilter('price', {
        ...filters.price,
        range: {
          min: minValueFromDatabase,
          max: maxValueFromDatabase
        }
      });
    } else {
      // Se já existirem valores, verificar se são diferentes dos padrão
      checkIfFilterActive(range.min, range.max, minValueFromDatabase, maxValueFromDatabase);
    }
  }, []);

  // Verificar se o filtro está ativo (valores diferentes dos padrão)
  const checkIfFilterActive = useCallback((min: string, max: string, defaultMin: string, defaultMax: string) => {
    const isActive = min !== defaultMin || max !== defaultMax;
    setIsFilterActive(isActive);
    return isActive;
  }, []);

  const handleMinChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        min: value
      }
    });
    
    // Verificar se o filtro está ativo após a mudança
    const isActive = checkIfFilterActive(value, range.max, defaultRange.min, defaultRange.max);
    
    // Se o filtro estiver ativo ou acabou de ser desativado, notificar mudança
    if (isActive || isFilterActive) {
      handleFilterChange();
    }
  }, [filters.price, range, updateFilter, handleFilterChange, defaultRange, checkIfFilterActive, isFilterActive]);

  const handleMaxChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        max: value
      }
    });
    
    // Verificar se o filtro está ativo após a mudança
    const isActive = checkIfFilterActive(range.min, value, defaultRange.min, defaultRange.max);
    
    // Se o filtro estiver ativo ou acabou de ser desativado, notificar mudança
    if (isActive || isFilterActive) {
      handleFilterChange();
    }
  }, [filters.price, range, updateFilter, handleFilterChange, defaultRange, checkIfFilterActive, isFilterActive]);

  return (
    <div className="space-y-3">
      <FilterRangeInput
        minValue={range.min}
        maxValue={range.max}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
        minPlaceholder="Min"
        maxPlaceholder="Max"
        ariaLabelMin="Preço mínimo"
        ariaLabelMax="Preço máximo"
        allowDecimals={true} 
        minAllowed={0}
        inputPrefix="R$"
        isFilterActive={isFilterActive}
        defaultMin={defaultRange.min}
        defaultMax={defaultRange.max}
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);

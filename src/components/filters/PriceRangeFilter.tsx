
import React, { useCallback, useEffect } from 'react';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import { formatCurrency } from '@/utils/auctionUtils';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

/**
 * Componente de filtro de intervalo de preços
 * Agora usando o hook de consistência para comportamento padronizado
 */
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { range } = filters.price;
  
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
    
    // Atualizar os valores no store apenas se estiverem vazios
    if (!range.min && !range.max) {
      updateFilter('price', {
        ...filters.price,
        range: {
          min: minValueFromDatabase,
          max: maxValueFromDatabase
        }
      });
    }
  }, []);

  const handleMinChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        min: value
      }
    });
    
    handleFilterChange();
  }, [filters.price, range, updateFilter, handleFilterChange]);

  const handleMaxChange = useCallback((value: string) => {
    updateFilter('price', {
      ...filters.price,
      range: {
        ...range,
        max: value
      }
    });
    
    handleFilterChange();
  }, [filters.price, range, updateFilter, handleFilterChange]);

  // Format the display values for the input fields
  const formatDisplayValue = (value: string): string => {
    if (!value) return '';
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return value;
    
    // Format with R$ prefix and thousands separator
    return formatCurrency(numValue);
  };

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
        displayMinValue={formatDisplayValue(range.min)}
        displayMaxValue={formatDisplayValue(range.max)}
        inputPrefix="R$"
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);

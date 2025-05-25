
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';
import { COLOR_OPTIONS } from '@/constants/filterConstants';
import { TYPOGRAPHY, COLORS } from '@/constants/designSystem';

interface ColorFilterProps {
  onFilterChange?: () => void;
}

/**
 * Componente de filtro de cor
 * Permite ao usuário selecionar cores para filtragem
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const ColorFilter: React.FC<ColorFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  const handleColorChange = useCallback((value: string) => {
    updateFilter('color', value);
    handleFilterChange();
  }, [updateFilter, handleFilterChange]);

  return (
    <div 
      role="group" 
      aria-labelledby="color-filter-label"
    >
      <label id="color-filter-label" htmlFor="color-filter" className={`block ${TYPOGRAPHY.size.sm} ${TYPOGRAPHY.weight.medium} ${COLORS.text.gray[700]} mb-1 ${TYPOGRAPHY.family.urbanist}`}>
        Cor
      </label>
      <FilterDropdown
        id="color-filter"
        aria-label="Selecione a cor"
        value={filters.color || 'todas'}
        onChange={handleColorChange}
        options={COLOR_OPTIONS}
        className={`${COLORS.border.gray[300]} ${TYPOGRAPHY.family.urbanist}`}
      />
    </div>
  );
};

export default React.memo(ColorFilter);

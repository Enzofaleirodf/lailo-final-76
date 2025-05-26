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
    <div className="w-full">
      <FilterDropdown
        id="color-filter"
        aria-label="Selecione a cor"
        value={filters.color || 'todas'}
        onChange={handleColorChange}
        options={COLOR_OPTIONS}
        className={`w-full ${COLORS.border.gray[300]} ${TYPOGRAPHY.family.urbanist}`}
      />
    </div>
  );
};

export default React.memo(ColorFilter);
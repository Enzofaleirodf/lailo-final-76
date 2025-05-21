
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface ColorFilterProps {
  onFilterChange?: () => void;
}

const colorOptions = [
  { value: 'todas', label: 'Todas' },
  { value: 'preto', label: 'Preto' },
  { value: 'branco', label: 'Branco' },
  { value: 'prata', label: 'Prata' },
  { value: 'azul', label: 'Azul' },
  { value: 'vermelho', label: 'Vermelho' }
];

/**
 * Componente de filtro de cor
 * Permite ao usuário selecionar cores para filtragem
 * Mantém consistência visual e comportamental entre desktop e mobile
 */
const ColorFilter: React.FC<ColorFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our new hook to ensure filter consistency
  const { handleFilterChange } = useFilterConsistency({
    onChange: onFilterChange
  });
  
  const handleColorChange = useCallback((value: string) => {
    updateFilter('color', value);
    
    // Notify parent component that filter has changed
    handleFilterChange();
  }, [updateFilter, handleFilterChange]);

  return (
    <div 
      role="group" 
      aria-labelledby="color-filter-label"
    >
      <div id="color-filter-label" className="sr-only">Filtro de cor</div>
      <FilterDropdown
        id="color-filter"
        aria-label="Selecione a cor"
        value={filters.color || 'todas'}
        onChange={handleColorChange}
        options={colorOptions}
        placeholder="Selecione"
        className="border-gray-200 shadow-sm bg-white"
      />
    </div>
  );
};

export default React.memo(ColorFilter);

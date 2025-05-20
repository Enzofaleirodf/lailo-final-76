
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFilterConsistency } from '@/hooks/useFilterConsistency';

interface ColorFilterProps {
  onFilterChange?: () => void;
}

const colorOptions = [
  { value: 'todas', label: 'Todas as cores' },
  { value: 'preto', label: 'Preto' },
  { value: 'branco', label: 'Branco' },
  { value: 'prata', label: 'Prata' },
  { value: 'azul', label: 'Azul' },
  { value: 'vermelho', label: 'Vermelho' }
];

const ColorFilter: React.FC<ColorFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  
  // Use our new hook to ensure filter consistency
  useFilterConsistency(onFilterChange);
  
  const handleColorChange = useCallback((value: string) => {
    updateFilter('color', value);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [updateFilter, onFilterChange]);

  return (
    <div role="group" aria-label="Filtro de cor">
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

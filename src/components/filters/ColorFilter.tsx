
import React, { useCallback } from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilterStore } from '@/stores/useFilterStore';

const colorOptions = [
  { value: 'todas', label: 'Todas as cores' },
  { value: 'preto', label: 'Preto' },
  { value: 'branco', label: 'Branco' },
  { value: 'prata', label: 'Prata' },
  { value: 'azul', label: 'Azul' },
  { value: 'vermelho', label: 'Vermelho' }
];

const ColorFilter: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  
  const handleColorChange = useCallback((value: string) => {
    updateFilter('color', value);
  }, [updateFilter]);

  return (
    <FilterDropdown
      id="color-filter"
      aria-label="Selecione a cor"
      value={filters.color || 'todas'}
      onChange={handleColorChange}
      options={colorOptions}
      placeholder="Selecione"
    />
  );
};

export default React.memo(ColorFilter);

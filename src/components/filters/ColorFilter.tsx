
import React from 'react';
import FilterDropdown from './FilterDropdown';
import { useFilter } from '@/contexts/FilterContext';

const colorOptions = [
  { value: 'preto', label: 'Preto' },
  { value: 'branco', label: 'Branco' },
  { value: 'prata', label: 'Prata' },
  { value: 'azul', label: 'Azul' },
  { value: 'vermelho', label: 'Vermelho' }
];

const ColorFilter: React.FC = () => {
  const { filters, updateFilter } = useFilter();
  
  const handleColorChange = (value: string) => {
    updateFilter('color', value);
  };

  return (
    <FilterDropdown
      id="color-filter"
      aria-label="Selecione a cor"
      value={filters.color}
      onChange={handleColorChange}
      options={colorOptions}
      placeholder="Selecione"
    />
  );
};

export default ColorFilter;
